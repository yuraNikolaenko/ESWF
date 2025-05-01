from rest_framework import generics
from .models import Driver, Vehicle
from .serializers import DriverSerializer, VehicleSerializer

class DriverListCreateAPIView(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class DriverRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class VehicleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class VehicleRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


from rest_framework import viewsets
from .models import Driver
from .serializers import DriverSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer


# ДОДАНО МЕТА-ENDPOINT
from rest_framework.views import APIView
from rest_framework.response import Response
from django.apps import apps

class ModelMetaView(APIView):
    def get(self, request, model_name):
        try:
            model = apps.get_model("core", model_name.capitalize())
        except LookupError:
            return Response({"error": "Model not found"}, status=404)

        meta = []
        for field in model._meta.fields:
            field_type = field.get_internal_type()
            field_info = {
                "name": field.name,
                "type": field_type.lower(),
                "required": not field.blank,
            }
            if hasattr(field, "choices") and field.choices:
                field_info["choices"] = list(field.choices)
            meta.append(field_info)

        return Response(meta)
class ModelMetaView(APIView):
    def get(self, request, model_name):
        try:
            model = apps.get_model("core", model_name.capitalize())
        except LookupError:
            return Response({"error": "Model not found"}, status=404)

        meta = []
        for field in model._meta.fields:
            # ❗️ Пропускаємо службові поля, але залишаємо 'parent'
            if field.name in ['id', 'uuid', 'isfolder', 'ismark']:
                continue

            # 🔧 Визначаємо тип поля
            if field.get_internal_type() == "DateField":
                field_type = "date"
            elif field.get_internal_type() in ["BooleanField", "NullBooleanField"]:
                field_type = "boolean"
            elif field.choices:
                field_type = "choice"
            else:
                field_type = "char"

            field_info = {
                "name": field.name,
                "type": field_type,
                "required": not field.blank,
            }

            if field_type == "choice":
                field_info["choices"] = list(field.choices)

            meta.append(field_info)

        return Response(meta)
