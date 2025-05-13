# core/registry.py

MODEL_MAP = {}

def register_model(code: str, app_label: str, model_name: str, serializer):
    """
    Регіструє модель для Masterdata API.

    :param code: назва, яка використовується в URL (наприклад, "vehicles")
    :param app_label: назва додатку Django (наприклад, "fleet")
    :param model_name: назва моделі (наприклад, "Vehicle")
    :param serializer: клас серіалізатора
    """
    MODEL_MAP[code] = (app_label, model_name, serializer)
