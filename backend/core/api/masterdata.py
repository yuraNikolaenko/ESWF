# core/api/masterdata.py

from rest_framework.views import APIView
from rest_framework.response import Response
from django.apps import apps
from core.models import (
    Driver, Vehicle, Country, LocationPoint,
    TransportHub, DeliveryPoint, Route,
    OdometerReading, Waybill  # ← Додано
)
from core.serializers import (
    DriverSerializer, VehicleSerializer, CountrySerializer,
    LocationPointSerializer, TransportHubSerializer,
    DeliveryPointSerializer, RouteSerializer,
    OdometerReadingSerializer, WaybillSerializer  # ← Додано
)
from core.api.field_titles import FIELD_TITLE_MAP

MODEL_MAP = {
    "drivers": ("core", "Driver", DriverSerializer),
    "vehicles": ("core", "Vehicle", VehicleSerializer),
    "countries": ("core", "Country", CountrySerializer),
    "locationpoints": ("core", "LocationPoint", LocationPointSerializer),
    "transporthubs": ("core", "TransportHub", TransportHubSerializer),
    "deliverypoints": ("core", "DeliveryPoint", DeliveryPointSerializer),
    "routes": ("core", "Route", RouteSerializer),
    "odometerreadings": ("core", "OdometerReading", OdometerReadingSerializer),
    "waybills": ("core", "Waybill", WaybillSerializer),  # ← Цей рядок додай
}

class MasterdataMeta(APIView):
    def get(self, request, code):
        app_label, model_name, _ = MODEL_MAP.get(code, (None, None, None))
        if not app_label:
            return Response({"error": "Invalid code"}, status=400)

        model = apps.get_model(app_label, model_name)
        meta = model._meta
        fields = []
        field_titles = FIELD_TITLE_MAP.get(code, {})

        for f in meta.fields:
            if f.name == "id":
                continue

            field_type = (
                "reference" if f.is_relation else
                "boolean" if f.get_internal_type() == "BooleanField" else
                "date" if f.get_internal_type() == "DateField" else
                "integer" if f.get_internal_type() in ["IntegerField", "BigIntegerField"] else
                "string"
            )

            titles = field_titles.get(f.name, {
                "en": f.verbose_name.title(),
                "ua": f.verbose_name,
            })

            fields.append({
                "name": f.name,
                "title": titles,
                "type": field_type,
                **({"ref": f.related_model.__name__.lower()} if field_type == "reference" else {})
            })

        return Response({"fields": fields})

class MasterdataData(APIView):
    def get(self, request, code):
        app_label, model_name, serializer_class = MODEL_MAP.get(code, (None, None, None))
        if not app_label:
            return Response({"error": "Invalid code"}, status=400)

        model = apps.get_model(app_label, model_name)
        objects = model.objects.all()
        serializer = serializer_class(objects, many=True)
        return Response(serializer.data)

class MasterdataFull(APIView):
    def get(self, request, code):
        app_label, model_name, serializer_class = MODEL_MAP.get(code, (None, None, None))
        if not app_label:
            return Response({"error": "Invalid code"}, status=400)

        model = apps.get_model(app_label, model_name)
        objects = model.objects.all()
        serializer = serializer_class(objects, many=True)
        meta = MasterdataMeta().get(request, code=code).data

        return Response({"meta": meta, "data": serializer.data})

class MasterdataItem(APIView):
    def get(self, request, code, id):
        app_label, model_name, serializer_class = MODEL_MAP.get(code, (None, None, None))
        if not app_label:
            return Response({"error": "Invalid code"}, status=400)

        model = apps.get_model(app_label, model_name)
        try:
            obj = model.objects.get(id=id)
        except model.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        serializer = serializer_class(obj)
        return Response(serializer.data)
