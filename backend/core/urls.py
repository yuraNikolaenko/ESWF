from django.urls import path, re_path
from .views import (
    DriverListCreateAPIView,
    DriverRetrieveUpdateDestroyAPIView,
    VehicleListCreateAPIView,  # <-- додати
    VehicleRetrieveUpdateDestroyAPIView,
    ModelMetaView  # <-- додати
)
from .views import chat_with_gpt

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
    re_path(r"^(?P<model_name>\w+)/meta/$",
            ModelMetaView.as_view(),
            name="model-meta"),
    path('chat/', chat_with_gpt),
]
