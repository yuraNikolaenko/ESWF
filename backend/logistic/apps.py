# logistic/apps.py

from django.apps import AppConfig

class LogisticConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'logistic'

    def ready(self):
        from core.registry import register_model
        from logistic.models import LogisticOrder, LogisticLeg
        from logistic.serializers import LogisticOrderSerializer, LogisticLegSerializer

        register_model("logisticOrders", "logistic", "LogisticOrder", LogisticOrderSerializer)
        register_model("logisticLegs", "logistic", "LogisticLeg", LogisticLegSerializer)
