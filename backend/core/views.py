from rest_framework import generics
from .models import Driver
from .models import Vehicle
from .serializers import DriverSerializer,VehicleSerializer

class DriverListCreateAPIView(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class DriverRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView                                         ):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class VehicleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class VehicleRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView                                          ):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
