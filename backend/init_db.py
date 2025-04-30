from django.core.management import call_command
from django.contrib.auth import get_user_model

def run():
    print("🔄 Застосування міграцій...")
    call_command('migrate')

    print("👤 Створення суперкористувача...")
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("✅ Суперкористувача створено")

    print("🚚 Генерація тестових водіїв...")
    call_command('generate_drivers')

    print("✅ Базу заповнено початковими даними")
