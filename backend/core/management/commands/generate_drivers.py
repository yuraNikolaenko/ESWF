from django.core.management.base import BaseCommand
from core.models import Driver
import random
from datetime import date, timedelta
import uuid

class Command(BaseCommand):
    help = 'Генерує тестових водіїв (Driver)'

    def handle(self, *args, **options):
        first_names = ['Олександр', 'Максим', 'Іван', 'Дмитро', 'Артем', 'Володимир', 'Андрій', 'Сергій', 'Віталій', 'Руслан']
        last_names = ['Шевченко', 'Ковальчук', 'Бондаренко', 'Ткаченко', 'Кравченко', 'Олійник', 'Мельник', 'Поліщук', 'Романенко', 'Гончар']

        for i in range(50):
            name = f"{random.choice(first_names)} {random.choice(last_names)}"
            birth_date = date.today() - timedelta(days=random.randint(25*365, 60*365))  # Вік 25-60 років
            gender = random.choice(['M', 'F'])
            license_number = f"{random.randint(100000, 999999)}-{random.randint(1000, 9999)}"
            phone_number = f"+380{random.randint(500000000, 679999999)}"
            ipn = f"{random.randint(1000000000, 9999999999)}"
            address = f"м. {random.choice(['Київ', 'Львів', 'Одеса', 'Дніпро', 'Харків'])}, вул. {random.choice(['Шевченка', 'Грушевського', 'Соборна', 'Перемоги'])}, {random.randint(1, 100)}"
            
            Driver.objects.create(
                name=name,
                birth_date=birth_date,
                gender=gender,
                license_number=license_number,
                phone_number=phone_number,
                ipn=ipn,
                address=address,
                isfolder=False,
                ismark=False,
                uuid=uuid.uuid4()
            )

        self.stdout.write(self.style.SUCCESS('Успішно створено 50 водіїв!'))
