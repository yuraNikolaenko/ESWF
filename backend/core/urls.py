from django.urls import path
from .views import (
    DriverListCreateAPIView,
    DriverRetrieveUpdateDestroyAPIView,
    VehicleListCreateAPIView,                 # <-- додати
    VehicleRetrieveUpdateDestroyAPIView       # <-- додати
)

urlpatterns = [
    path('drivers/',
         DriverListCreateAPIView.as_view(),
         name='driver_list_create'),
    path('drivers/<int:pk>/',
         DriverRetrieveUpdateDestroyAPIView.as_view(),
         name='driver_detail'),
    path('vehicles/',
         VehicleListCreateAPIView.as_view(),
         name='vehicle_list_create'),
    path('vehicles/<int:pk>/',
         VehicleRetrieveUpdateDestroyAPIView.as_view(),
         name='vehicle_detail'),
]
