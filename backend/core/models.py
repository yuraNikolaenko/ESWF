from django.db import models
import uuid as uuid_lib

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



class Item(models.Model):
    ITEM_TYPES = (
        ('good', 'Товар'),
        ('service', 'Послуга'),
        ('kit', 'Комплект'),
    )

    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)
    isfolder = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255, verbose_name="Найменування")
    code = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=10, choices=ITEM_TYPES, default='good')
    unit = models.CharField(max_length=20, default="шт", verbose_name="Одиниця виміру")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    comment = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Номенклатура"
        verbose_name_plural = "Номенклатура"

    def __str__(self):
        return self.name
    
class ItemComponent(models.Model):
    parent_item = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='components')
    component = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='used_in_kits')

    quantity = models.DecimalField(max_digits=10, decimal_places=3, default=1.000)
    comment = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "Комплектуюча позиція"
        verbose_name_plural = "Комплектуючі позиції"

    def __str__(self):
        return f"{self.parent_item.name} → {self.component.name} x {self.quantity}"
