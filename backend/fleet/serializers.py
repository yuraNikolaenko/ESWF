from rest_framework import serializers
from fleet.models import (
    Driver, Vehicle, Waybill, OdometerReading, Route,
    TransportComponent, VehicleComponent
)
from core.models import LocationPoint
from fleet.models import RouteWaypoint, Order, TransportInvoice



# --- DRIVER ---
class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


class DriverShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'name']


# --- VEHICLE ---
class VehicleSerializer(serializers.ModelSerializer):
    driver = DriverShortSerializer(read_only=True)
    driver_id = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(), source='driver', write_only=True
    )

    parent_vehicle = serializers.SerializerMethodField()
    parent_vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), source='parent_vehicle', write_only=True, required=False, allow_null=True
    )

    def get_parent_vehicle(self, obj):
        if obj.parent_vehicle:
            return {
                "id": obj.parent_vehicle.id,
                "name": obj.parent_vehicle.name
            }
        return None

    class Meta:
        model = Vehicle
        fields = [
            'id', 'uuid', 'isfolder', 'ismark', 'parent',
            'vehicle_type', 'parent_vehicle', 'parent_vehicle_id',
            'driver', 'driver_id',
            'name', 'brand', 'model', 'year',
            'vin', 'license_plate', 'photo', 'created_at'
        ]


# --- ROUTE ---
class LocationPointShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationPoint
        fields = ['id', 'name']


class RouteSerializer(serializers.ModelSerializer):
    departure_point = LocationPointShortSerializer(read_only=True)
    departure_point_id = serializers.PrimaryKeyRelatedField(
        queryset=LocationPoint.objects.all(), source='departure_point', write_only=True
    )
    return_point = LocationPointShortSerializer(read_only=True)
    return_point_id = serializers.PrimaryKeyRelatedField(
        queryset=LocationPoint.objects.all(), source='return_point', write_only=True
    )

    class Meta:
        model = Route
        fields = [
            'id', 'uuid', 'isfolder', 'ismark', 'parent',
            'name', 'code',
            'departure_point', 'departure_point_id',
            'return_point', 'return_point_id',
            'distance_km', 'estimated_time_min',
            'comment', 'created_at'
        ]


# --- WAYBILL ---
class WaybillSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), source='vehicle', write_only=True
    )
    driver = DriverShortSerializer(read_only=True)
    driver_id = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(), source='driver', write_only=True
    )

    class Meta:
        model = Waybill
        fields = [
            'id', 'uuid', 'ismark', 'posted',
            'vehicle', 'vehicle_id',
            'driver', 'driver_id',
            'document_number', 'date',
            'odometer_departure', 'odometer_return',
            'created_at'
        ]


# --- ODOMETER ---
class OdometerReadingSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), source="vehicle", write_only=True
    )
    waybill_id = serializers.PrimaryKeyRelatedField(
        queryset=Waybill.objects.all(), source="waybill", write_only=True, required=False, allow_null=True
    )
    waybill = WaybillSerializer(read_only=True)

    class Meta:
        model = OdometerReading
        fields = '__all__'


# --- TRANSPORT COMPONENT ---
class TransportComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportComponent
        fields = '__all__'


# --- VEHICLE COMPONENT ---
class VehicleComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleComponent
        fields = '__all__'

class RouteWaypointSerializer(serializers.ModelSerializer):
    point = serializers.StringRelatedField()
    point_id = serializers.PrimaryKeyRelatedField(
        queryset=LocationPoint.objects.all(), source='point', write_only=True
    )

    class Meta:
        model = RouteWaypoint
        fields = ['id', 'route', 'point', 'point_id', 'order', 'comment']

class OrderSerializer(serializers.ModelSerializer):
    route = RouteSerializer(read_only=True)
    route_id = serializers.PrimaryKeyRelatedField(
        queryset=Route.objects.all(), source='route', write_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'uuid', 'ismark', 'posted',
            'customer', 'date', 'route', 'route_id',
            'cargo_name', 'cargo_weight', 'comment', 'created_at'
        ]

class TransportInvoiceSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), source='vehicle', write_only=True
    )
    driver = DriverShortSerializer(read_only=True)
    driver_id = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(), source='driver', write_only=True
    )

    departure_point = LocationPointShortSerializer(read_only=True)
    departure_point_id = serializers.PrimaryKeyRelatedField(
        queryset=LocationPoint.objects.all(), source='departure_point', write_only=True
    )
    arrival_point = LocationPointShortSerializer(read_only=True)
    arrival_point_id = serializers.PrimaryKeyRelatedField(
        queryset=LocationPoint.objects.all(), source='arrival_point', write_only=True
    )

    order = OrderSerializer(read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(), source='order', write_only=True
    )

    class Meta:
        model = TransportInvoice
        fields = [
            'id', 'uuid', 'ttn_number', 'date',
            'sender', 'recipient', 'cargo_name', 'cargo_weight',
            'vehicle', 'vehicle_id',
            'driver', 'driver_id',
            'departure_point', 'departure_point_id',
            'arrival_point', 'arrival_point_id',
            'order', 'order_id',
            'status', 'created_at'
        ]
