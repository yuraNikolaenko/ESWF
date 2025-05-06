from django.urls import path, re_path
from .views import (
    DriverListCreateAPIView,
    DriverRetrieveUpdateDestroyAPIView,
    VehicleListCreateAPIView,  # <-- додати
    VehicleRetrieveUpdateDestroyAPIView,
    ModelMetaView  # <-- додати
)
from .views import chat_with_gpt
from .views import (
    CountryViewSet, LocationPointViewSet,
    TransportHubViewSet, DeliveryPointViewSet
)
from core.views import root_info

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
    path('<str:code>/meta/', ModelMetaView.as_view(), name='model-meta'),
    path('chat/', chat_with_gpt),
       path('countries/', CountryViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('countries/<int:pk>/', CountryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('location-points/', LocationPointViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('location-points/<int:pk>/', LocationPointViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('transport-hubs/', TransportHubViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('transport-hubs/<int:pk>/', TransportHubViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('delivery-points/', DeliveryPointViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('delivery-points/<int:pk>/', DeliveryPointViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('', root_info),  # <- головна
]
