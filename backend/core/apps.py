from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        from core.registry import register_model
        from core.models import (
            Country, LocationPoint, TransportHub, DeliveryPoint, Item, ItemComponent,
            Unit, Department, Warehouse, Cashbox, Bank, SettlementAccount,
            Person, BusinessDirection, ExpenseItem, PriceType
            # Додавай сюди всі нові masterdata-моделі!
        )
        from core.serializers import (
            CountrySerializer, LocationPointSerializer,
            TransportHubSerializer, DeliveryPointSerializer,
            ItemSerializer, ItemComponentSerializer
        )
        from core.serializers_factory import generate_serializer

        # Кастомні серіалізатори (якщо є особливі поля/логіка)
        register_model("countries", "core", "Country", CountrySerializer)
        register_model("locationpoints", "core", "LocationPoint", LocationPointSerializer)
        register_model("transporthubs", "core", "TransportHub", TransportHubSerializer)
        register_model("deliverypoints", "core", "DeliveryPoint", DeliveryPointSerializer)
        register_model("items", "core", "Item", ItemSerializer)
        register_model("itemcomponents", "core", "ItemComponent", ItemComponentSerializer)

        # Автоматично для простих masterdata-довідників
        register_model("units", "core", "Unit", generate_serializer(Unit))
        register_model("departments", "core", "Department", generate_serializer(Department))
        register_model("warehouses", "core", "Warehouse", generate_serializer(Warehouse))
        register_model("cashboxes", "core", "Cashbox", generate_serializer(Cashbox))
        register_model("banks", "core", "Bank", generate_serializer(Bank))
        register_model("settlementaccounts", "core", "SettlementAccount", generate_serializer(SettlementAccount))
        register_model("persons", "core", "Person", generate_serializer(Person))
        register_model("businessDirections", "core", "BusinessDirection", generate_serializer(BusinessDirection))
        register_model("expenseItems", "core", "ExpenseItem", generate_serializer(ExpenseItem))
        register_model("priceTypes", "core", "PriceType", generate_serializer(PriceType))
