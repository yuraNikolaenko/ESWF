from django.core.management.base import BaseCommand
from django.core.management import call_command
from core.models import Country, LocationPoint
from pathlib import Path
import json

class Command(BaseCommand):
    help = 'Завантажує початкові дані: країни, населені пункти, водії, машини'

    def handle(self, *args, **kwargs):
        base_dir = Path("core/fixtures/initial")

        # --- Імпорт країн ---
        self.stdout.write("📥 Імпорт країн...")
        with open(base_dir / "countries.json", encoding="utf-8-sig") as f:
            countries = json.load(f)
        for item in countries:
            Country.objects.update_or_create(
                name=item["name"],
                defaults={
                    "name_local": item.get("name_local"),
                    "alpha2_code": item.get("alpha2_code"),
                    "alpha3_code": item.get("alpha3_code"),
                    "numeric_code": item.get("numeric_code"),
                }
            )
        self.stdout.write(self.style.SUCCESS(f"✅ Імпортовано {len(countries)} країн."))

        # 2. LocationPoint
        print("📍 Імпорт населених пунктів...")
        with open(base_dir / "locationpoints.json", encoding="utf-8") as f:
            ukraine = Country.objects.filter(numeric_code="804").first()
            data = json.load(f)
            for item in data:
                LocationPoint.objects.update_or_create(
                    code=item["code"],
                    defaults={
                        "name": item["name"],
                        "region": item.get("region"),
                        "latitude": item.get("latitude"),
                        "longitude": item.get("longitude"),
                        "type": item.get("type"),
                        "country": ukraine,
                    }
                )
        print(f"✅ Завантажено {len(data)} пунктів.")

        # --- Імпорт населених пунктів ---
        self.stdout.write("📍 Модіфікація  населених пунктів...")
        call_command("assign_parents")

        # --- Генерація водіїв ---
        self.stdout.write("👤 Генерація водіїв...")
        call_command("generate_drivers")

        # --- Генерація машин ---
        self.stdout.write("🚚 Генерація машин...")
        call_command("generate_vehicles")

        self.stdout.write(self.style.SUCCESS("🎉 Початкові дані успішно завантажені."))
