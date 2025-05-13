from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        from core.registry import register_model
        from core.models import Country, LocationPoint, TransportHub, DeliveryPoint,Item,ItemComponent
        from core.serializers import (
            CountrySerializer, LocationPointSerializer,
            TransportHubSerializer, DeliveryPointSerializer,ItemSerializer,ItemComponentSerializer
        )

        register_model("countries", "core", "Country", CountrySerializer)
        register_model("locationpoints", "core", "LocationPoint", LocationPointSerializer)
        register_model("transporthubs", "core", "TransportHub", TransportHubSerializer)
        register_model("deliverypoints", "core", "DeliveryPoint", DeliveryPointSerializer)
        register_model("items", "core", "Item", ItemSerializer)
        register_model("itemcomponents", "core", "ItemComponent", ItemComponentSerializer)
