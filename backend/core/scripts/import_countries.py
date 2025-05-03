# core/scripts/import_countries.py

import json
from core.models import Country
from django.db import transaction

def import_countries(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        countries = json.load(f)

    with transaction.atomic():
        for entry in countries:
            Country.objects.update_or_create(
                alpha3_code=entry["alpha3_code"],
                defaults={
                    "name": entry["name"],
                    "name_local": entry["name_local"],
                    "alpha2_code": entry["alpha2_code"],
                    "numeric_code": entry["numeric_code"],
                    "ismark": False
                }
            )
    print(f"✅ Імпорт завершено: {len(countries)} країн.")

