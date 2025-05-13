from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Генерує водіїв та машини для fleet-модуля'

    def handle(self, *args, **kwargs):
        self.stdout.write("👤 Генерація водіїв...")
        call_command("generate_drivers")

        self.stdout.write("🚚 Генерація машин...")
        call_command("generate_vehicles")

        self.stdout.write(self.style.SUCCESS("✅ Дані модуля fleet згенеровано."))
