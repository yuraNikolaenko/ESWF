from django.core.management.base import BaseCommand
from fleet.models import Vehicle, Driver
import random
from datetime import datetime
import uuid

class Command(BaseCommand):
    help = 'Генерує тестові машини (Vehicle)'

    def handle(self, *args, **options):
        brands = ['Mercedes', 'Volvo', 'MAN', 'Scania', 'Renault']
        models = {
            'Mercedes': ['Actros', 'Atego', 'Axor'],
            'Volvo': ['FH', 'FMX', 'FE'],
            'MAN': ['TGX', 'TGS', 'TGM'],
            'Scania': ['R-Series', 'S-Series', 'P-Series'],
            'Renault': ['T High', 'C 460', 'K 520']
        }

        drivers = list(Driver.objects.all())

        for i in range(50):
            brand = random.choice(brands)
            model = random.choice(models[brand])
            year = random.randint(2005, 2023)
            vin = f"VIN{random.randint(1000000,9999999)}"
            license_plate = f"AA{random.randint(1000,9999)}BB"
            name = f"{brand} {model} {license_plate}"

            driver = random.choice(drivers) if drivers else None

            Vehicle.objects.create(
                name=name,
                brand=brand,
                model=model,
                year=year,
                vin=vin,
                license_plate=license_plate,
                driver=driver,
                uuid=uuid.uuid4(),
                isfolder=False,
                ismark=False
            )

        self.stdout.write(self.style.SUCCESS('Успішно створено 50 машин!'))
