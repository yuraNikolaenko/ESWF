from django.urls import path
from .views import DriverListCreateAPIView, DriverRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('drivers/', DriverListCreateAPIView.as_view(), name='driver_list_create'),
    path('drivers/<int:pk>/', DriverRetrieveUpdateDestroyAPIView.as_view(), name='driver_detail'),
]
