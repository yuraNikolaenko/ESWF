from django.apps import AppConfig


class FleetConfig(AppConfig):
    name = 'fleet'

    def ready(self):
        from core.registry import register_model
        from fleet.models import (Driver, Vehicle, Waybill, OdometerReading, Route,
        TransportComponent,VehicleComponent,RouteWaypoint, Order, TransportInvoice)

        from fleet.serializers import (
            DriverSerializer, VehicleSerializer, WaybillSerializer,
            OdometerReadingSerializer, RouteSerializer,TransportComponentSerializer,VehicleComponentSerializer,
            RouteWaypointSerializer, OrderSerializer, TransportInvoiceSerializer
        )

        register_model("drivers", "fleet", "Driver", DriverSerializer)
        register_model("vehicles", "fleet", "Vehicle", VehicleSerializer)
        register_model("waybills", "fleet", "Waybill", WaybillSerializer)
        register_model("odometerreadings", "fleet", "OdometerReading", OdometerReadingSerializer)
        register_model("routes", "fleet", "Route", RouteSerializer)
        register_model("transportcomponents", "fleet", "TransportComponent", TransportComponentSerializer)
        register_model("vehiclecomponents", "fleet", "VehicleComponent", VehicleComponentSerializer)
        register_model("routewaypoints", "fleet", "RouteWaypoint", RouteWaypointSerializer)
        register_model("orders", "fleet", "Order", OrderSerializer)
        register_model("transportinvoices", "fleet", "TransportInvoice", TransportInvoiceSerializer)
