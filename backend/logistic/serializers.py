# logistic/serializers.py

from rest_framework import serializers
from .models import LogisticOrder, LogisticLeg

def generate_serializer(model_class):
    class Meta:
        model = model_class
        fields = '__all__'
    serializer_name = f"{model_class.__name__}Serializer"
    return type(serializer_name, (serializers.ModelSerializer,), {'Meta': Meta})

LogisticOrderSerializer = generate_serializer(LogisticOrder)
LogisticLegSerializer = generate_serializer(LogisticLeg)
