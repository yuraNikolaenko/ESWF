from rest_framework import serializers
from .models import Driver, Vehicle, Country, LocationPoint, TransportHub, DeliveryPoint, Route, OdometerReading
from .models import Waybill

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


class DriverShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'name']


class VehicleSerializer(serializers.ModelSerializer):
    driver = DriverShortSerializer(read_only=True)
    driver_id = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(), source='driver', write_only=True
    )

    class Meta:
        model = Vehicle
        fields = [
            'id', 'uuid', 'isfolder', 'ismark', 'parent',
            'driver', 'driver_id',
            'name', 'brand', 'model', 'year',
            'vin', 'license_plate', 'photo', 'created_at'
        ]

# ... existing serializers ...

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class LocationPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationPoint
        fields = '__all__'

class TransportHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportHub
        fields = '__all__'

class DeliveryPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPoint
        fields = '__all__'

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

# ...

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

