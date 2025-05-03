from django.db import models
import uuid as uuid_lib

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
    
    driver = models.ForeignKey('core.Driver', on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles')
    
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    year = models.IntegerField()
    vin = models.CharField(max_length=100, unique=True)
    license_plate = models.CharField(max_length=20)
    photo = models.ImageField(upload_to='vehicles_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.CharField(max_length=255, default='', blank=True)

    def __str__(self):
        return f"{self.license_plate} - {self.brand} {self.model}"
    
class Country(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    # основна назва (наприклад, "Ukraine")
    name = models.CharField(max_length=100)

    # локалізована назва — українською ("Україна")
    name_local = models.CharField(max_length=100, null=True, blank=True)

    # ISO 3166 коди
    alpha2_code = models.CharField(max_length=2, null=True, blank=True, verbose_name="Alpha-2 code (UA)")
    alpha3_code = models.CharField(max_length=3, null=True, blank=True, verbose_name="Alpha-3 code (UKR)")
    numeric_code = models.CharField(max_length=3, null=True, blank=True, verbose_name="Numeric code (804)")

    def __str__(self):
        return f"{self.name_local or self.name}"

class LocationPoint(models.Model):
    
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
# ❌ TreeForeignKey
# ✅ просто ForeignKey:
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255)
    region = models.CharField(max_length=255, null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="location_points")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    country = models.ForeignKey("Country", on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=20, null=True, blank=True)
    code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    class Meta:
        verbose_name = "Населений пункт"
        verbose_name_plural = "Населені пункти"

    def __str__(self):
        return self.name


class TransportHub(models.Model):
    HUB_TYPES = (
        ('port', 'Порт'),
        ('airport', 'Аеропорт'),
        ('station', 'Станція'),
        ('other', 'Інше'),
    )

    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=HUB_TYPES)
    location_point = models.ForeignKey(LocationPoint, on_delete=models.CASCADE, related_name="hubs")
    code = models.CharField(max_length=50, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    comment = models.CharField(max_length=255, default='', blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class DeliveryPoint(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    location_point = models.ForeignKey(LocationPoint, on_delete=models.CASCADE, related_name="delivery_points")
    address = models.CharField(max_length=255)
    note = models.TextField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    comment = models.CharField(max_length=255, default='', blank=True)

    def __str__(self):
        return self.address 
