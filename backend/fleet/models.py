from django.db import models

# Create your models here.
import uuid as uuid_lib
from core.enums import VEHICLE_TYPE


class Driver(models.Model):
    GENDER_CHOICES = (
        ('M', 'Чоловік'),
        ('F', 'Жінка'),
    )

    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    license_number = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    ipn = models.CharField(max_length=20, unique=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    photo = models.ImageField(upload_to='drivers_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=255, default='', blank=True)

    def __str__(self):
        return self.name


class Vehicle(models.Model):

    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    driver = models.ForeignKey('fleet.Driver', on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles')

    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    year = models.IntegerField()
    vin = models.CharField(max_length=100, unique=True)
    license_plate = models.CharField(max_length=20)
    photo = models.ImageField(upload_to='vehicles_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=255, default='', blank=True)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE, default='car')

    parent_vehicle = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='attached_units',
        verbose_name="Базовий ТЗ (для причепів)"
    )

    def __str__(self):
        return f"{self.license_plate} - {self.brand} {self.model}"


class Waybill(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)
    posted = models.BooleanField(default=False)

    vehicle = models.ForeignKey('fleet.Vehicle', on_delete=models.CASCADE, related_name='waybills')
    driver = models.ForeignKey('fleet.Driver', on_delete=models.CASCADE, related_name='waybills')

    document_number = models.CharField(max_length=50)
    date = models.DateField()

    odometer_departure = models.PositiveIntegerField(verbose_name="Показник одометра при виїзді")
    odometer_return = models.PositiveIntegerField(verbose_name="Показник одометра при поверненні")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Пут. лист {self.document_number} від {self.date}"


class OdometerReading(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)

    vehicle = models.ForeignKey('fleet.Vehicle', on_delete=models.CASCADE, related_name='odometer_readings')
    date = models.DateField(verbose_name="Дата показання")
    odometer = models.PositiveIntegerField(verbose_name="Показання одометра")

    waybill = models.ForeignKey('fleet.Waybill', on_delete=models.SET_NULL, null=True, blank=True, related_name='odometer_readings')

    def __str__(self):
        return f"{self.vehicle} — {self.date} — {self.odometer} км"


class Route(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255, help_text="Назва маршруту (наприклад, 'Київ - Львів')")
    code = models.CharField(max_length=50, unique=True, null=True, blank=True, help_text="Унікальний код маршруту")

    departure_point = models.ForeignKey('core.LocationPoint', on_delete=models.CASCADE, related_name='routes_from')
    return_point = models.ForeignKey('core.LocationPoint', on_delete=models.CASCADE, related_name='routes_to')

    distance_km = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True, help_text="Відстань у кілометрах")
    estimated_time_min = models.IntegerField(null=True, blank=True, help_text="Орієнтовний час у хвилинах")
    comment = models.CharField(max_length=255, default='', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TransportComponent(models.Model):
    COMPONENT_TYPES = (
        ('tire', 'Шина'),
        ('battery', 'Акумулятор'),
        ('other', 'Інше'),
    )

    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=20, choices=COMPONENT_TYPES)
    brand = models.CharField(max_length=100, null=True, blank=True)
    serial = models.CharField(max_length=100, null=True, blank=True)
    lifetime_months = models.PositiveIntegerField(null=True, blank=True, verbose_name="Строк служби (міс.)")

    comment = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Компонент ТЗ"
        verbose_name_plural = "Компоненти ТЗ"

    def __str__(self):
        return f"{self.name} ({self.code})"

class VehicleComponent(models.Model):
    STATUS_CHOICES = (
        ('in_use', 'В роботі'),
        ('in_stock', 'На складі'),
        ('disposed', 'Списано'),
    )

    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='components')
    component = models.ForeignKey('TransportComponent', on_delete=models.CASCADE, related_name='assignments')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_use')
    installed_at = models.DateField(null=True, blank=True)
    comment = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Комплектуюча ТЗ"
        verbose_name_plural = "Комплектуючі ТЗ"

    def __str__(self):
        return f"{self.vehicle} ← {self.component} ({self.get_status_display()})"



# -------------------------------
# Проміжні точки маршруту
# -------------------------------
class RouteWaypoint(models.Model):
    route = models.ForeignKey('Route', on_delete=models.CASCADE, related_name='waypoints')
    point = models.ForeignKey('core.LocationPoint', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    comment = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Проміжна точка"
        verbose_name_plural = "Проміжні точки"

    def __str__(self):
        return f"{self.order}. {self.point.name} [{self.route.name}]"


# -------------------------------
# Документ "Замовлення"
# -------------------------------
class Order(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, unique=True)
    ismark = models.BooleanField(default=False)
    posted = models.BooleanField(default=False)

    customer = models.CharField(max_length=255)
    date = models.DateField()
    route = models.ForeignKey('Route', on_delete=models.SET_NULL, null=True, blank=True)
    cargo_name = models.CharField(max_length=255)
    cargo_weight = models.DecimalField(max_digits=10, decimal_places=2)
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Замовлення"
        verbose_name_plural = "Замовлення"

    def __str__(self):
        return f"Замовлення {self.date} – {self.customer}"


# -------------------------------
# Товарно-транспортна накладна (ТТН)
# -------------------------------
class TransportInvoice(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, unique=True)
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='ttns')

    ttn_number = models.CharField(max_length=100)
    date = models.DateField()
    sender = models.CharField(max_length=255)
    recipient = models.CharField(max_length=255)
    cargo_name = models.CharField(max_length=255)
    cargo_weight = models.DecimalField(max_digits=10, decimal_places=2)

    vehicle = models.ForeignKey('Vehicle', on_delete=models.SET_NULL, null=True)
    driver = models.ForeignKey('Driver', on_delete=models.SET_NULL, null=True)

    departure_point = models.ForeignKey(
        'core.LocationPoint',
        on_delete=models.SET_NULL,
        null=True,
        related_name='departure_transport_invoices'
    )

    arrival_point = models.ForeignKey(
        'core.LocationPoint',
        on_delete=models.SET_NULL,
        null=True,
        related_name='arrival_transport_invoices'
    )

    status = models.CharField(max_length=50, default="draft")  # можна винести в ENUM
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Товарно-транспортна накладна"
        verbose_name_plural = "ТТН"

    def __str__(self):
        return f"ТТН {self.ttn_number}"