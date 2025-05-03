from django.core.management.base import BaseCommand
from core.models import LocationPoint

class Command(BaseCommand):
    help = "Автоматичне призначення parent для LocationPoint на основі КОАТУУ-коду"

    def handle(self, *args, **options):
        all_points = LocationPoint.objects.exclude(code__isnull=True).exclude(code="")

        assigned = 0
        skipped = 0

        for point in all_points:
            code = point.code

            parent_code = None
            if code.endswith("00000000"):
                # Це область — не має parent
                continue
            elif code.endswith("00000"):
                # Це район — parent → область
                parent_code = code[:2] + "00000000"
            elif code.endswith("000"):
                # Це громада/місто — parent → район
                parent_code = code[:5] + "00000"
            else:
                # Це населений пункт — parent → громада/місто
                parent_code = code[:7] + "000"

            try:
                parent = LocationPoint.objects.get(code=parent_code)
                if point.parent != parent:
                    point.parent = parent
                    point.save()
                    assigned += 1
            except LocationPoint.DoesNotExist:
                skipped += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ Призначено parent для {assigned} пунктів. Пропущено (не знайдено parent): {skipped}"
        ))
