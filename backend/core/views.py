from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.apps import apps
from .models import Driver, Vehicle
from .serializers import DriverSerializer, VehicleSerializer
import re
import os
import openai
from datetime import datetime, date
from django.conf import settings
from .semantic_parser import parse_query

openai.api_key = os.getenv("OPENAI_API_KEY") or getattr(settings, "OPENAI_API_KEY", None)

SYSTEM_PROMPT = '''
Ти корпоративний логістичний помічник.
Розумієш українську, російську, суржик.
Вмієш виправляти орфографічні помилки.
Якщо запит сформульовано неточно — здогадуєшся по контексту.
'''

def normalize_text(text):
    text = text.lower()
    replacements = {
        "скілбку": "скільки",
        "скількиь": "скільки",
        "стераше": "старше",
        "старге": "старше",
        "автомобілв": "автомобілів",
        "машин": "автомобілів",
        "машини": "автомобілі",
        "номер": "license_plate",
        "держномер": "license_plate",
        "пошта": "email",
        "мейл": "email",
        "телефон": "phone_number",
        "тел.": "phone_number",
        "іпн": "ipn",
        "адреса": "address",
        "він": "vin",
        "вінкод": "vin",
        "ліцензія": "license_number",
        "водійське посвідчення": "license_number",
        "рік народження": "birth_date",
        "ім'я": "name",
        "прізвище": "name",
        "машина": "vehicle",
        "авто": "vehicle",
        "автівка": "vehicle",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text

# --- API для Driver ---
class DriverListCreateAPIView(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class DriverRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

# --- API для Vehicle ---
class VehicleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class VehicleRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

# --- Meta API ---
class ModelMetaView(APIView):
    def get(self, request, model_name):
        try:
            model = apps.get_model("core", model_name.capitalize())
        except LookupError:
            return Response({"error": "Model not found"}, status=404)

        meta = []
        for field in model._meta.fields:
            if field.name in ['id', 'uuid', 'isfolder', 'ismark']:
                continue

            field_type = "char"
            if field.get_internal_type() == "DateField":
                field_type = "date"
            elif field.get_internal_type() in ["BooleanField", "NullBooleanField"]:
                field_type = "boolean"
            elif field.choices:
                field_type = "choice"

            field_info = {
                "name": field.name,
                "type": field_type,
                "required": not field.blank,
            }

            if field_type == "choice":
                field_info["choices"] = list(field.choices)

            meta.append(field_info)

        return Response(meta)

# --- Основна GPT точка ---
@api_view(['POST'])
def chat_with_gpt(request):
    raw_message = request.data.get("message", "").strip()
    user_message = normalize_text(raw_message)

    print("GPT: Отримано повідомлення:", raw_message)
    print("GPT: Нормалізоване:", user_message)

    parsed = parse_query(
        user_message,
        model_fields={
            "Vehicle": ["name", "brand", "model", "year", "vin", "license_plate", "driver_id"],
            "Driver": ["name", "birth_date", "gender", "license_number", "phone_number", "email", "ipn", "address"]
        }
    )

    intent = parsed.get("intent")
    params = parsed.get("params", {})
    current_year = datetime.now().year

    if intent == "vehicle_age_query":
        years = int(params.get("years", 5))
        count = Vehicle.objects.filter(year__lt=current_year - years).count()
        return Response({"reply": f"У базі зареєстровано {count} автомобілів, старших за {years} років."})

    if intent == "driver_age_query":
        years = int(params.get("years", 30))
        cutoff = date.today().replace(year=date.today().year - years)
        count = Vehicle.objects.filter(driver__isnull=False, driver__birth_date__lt=cutoff).count()
        return Response({"reply": f"У базі {count} автомобілів, закріплених за водіями віком понад {years} років."})

    if intent == "count_all":
        model_name = params.get("model")
        try:
            Model = apps.get_model("core", model_name)
            count = Model.objects.count()
            return Response({"reply": f"У базі {count} записів у таблиці {model_name}."})
        except Exception as e:
            print("❌ count_all error:", e)

    if intent == "get_field_by_name":
        model_name = params.get("model")
        name = params.get("name")
        target_field = params.get("target_field")
        try:
            Model = apps.get_model("core", model_name)
            instance = Model.objects.filter(name__icontains=name).first()
            if instance:
                value = getattr(instance, target_field, None)
                return Response({"reply": f"{target_field.replace('_', ' ').capitalize()}: {value}"})
            else:
                return Response({"reply": f"{model_name} з ім’ям {name} не знайдено."})
        except Exception as e:
            print("❌ get_field_by_name error:", e)

    # Fallback — якщо нічого не спрацювало
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": raw_message}
    ]
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.4,
        )
        answer = response.choices[0].message.content.strip()
        return Response({"reply": answer})
    except Exception as e:
        import traceback
        print("GPT: ВИПАЛА ПОМИЛКА 🔥")
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
