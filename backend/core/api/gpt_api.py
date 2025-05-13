from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.apps import apps
from datetime import datetime, date
import os
import openai
from django.conf import settings
from core.api.semantic_parser import parse_query

openai.api_key = os.getenv("OPENAI_API_KEY") or getattr(settings, "OPENAI_API_KEY", None)

SYSTEM_PROMPT = '''
Ти корпоративний логістичний помічник.
Розумієш українську, російську, суржик.
Вмієш виправляти орфографічні помилки.
Якщо запит сформульовано неточно — здогадуєшся по контексту.
'''

@api_view(['POST'])
def chat_with_gpt(request):
    raw_message = request.data.get("message", "").strip()
    user_message = raw_message

    print("GPT: Отримано повідомлення:", raw_message)
    print("GPT: Нормалізоване:", user_message)

    parsed = parse_query(user_message)
    intent = parsed.get("intent")
    params = parsed.get("params", {})
    current_year = datetime.now().year

    # приклади обробки запитів
    if intent == "vehicle_age_query":
        years = int(params.get("years", 5))
        Vehicle = apps.get_model("core", "Vehicle")
        count = Vehicle.objects.filter(year__lt=current_year - years).count()
        return Response({"reply": f"У базі зареєстровано {count} автомобілів, старших за {years} років."})

    if intent == "driver_age_query":
        years = int(params.get("years", 30))
        cutoff = date.today().replace(year=date.today().year - years)
        Vehicle = apps.get_model("core", "Vehicle")
        count = Vehicle.objects.filter(driver__isnull=False, driver__birth_date__lt=cutoff).count()
        return Response({"reply": f"У базі {count} автомобілів із водіями віком понад {years} років."})

    # fallback
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": raw_message}
            ],
            temperature=0.4,
        )
        answer = response.choices[0].message.content.strip()
        return Response({"reply": answer})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
