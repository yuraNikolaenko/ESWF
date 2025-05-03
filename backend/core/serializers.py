from rest_framework import serializers
from .models import Driver, Vehicle, Country, LocationPoint, TransportHub, DeliveryPoint

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
