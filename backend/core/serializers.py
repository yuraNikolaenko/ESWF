from rest_framework import serializers
from .models import Country, LocationPoint, TransportHub, DeliveryPoint


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class LocationPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationPoint
        fields = '__all__'


class LocationPointShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationPoint
        fields = ['id', 'name']


class TransportHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportHub
        fields = '__all__'


class DeliveryPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPoint
        fields = '__all__'

from core.models import Item  # переконайся, що імпортовано

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


from core.models import ItemComponent

class ItemComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemComponent
        fields = '__all__'
