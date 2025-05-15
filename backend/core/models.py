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

class Organization(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255, verbose_name="Назва організації")
    code = models.CharField(max_length=20, unique=True, verbose_name="Код ЄДРПОУ / внутрішній")
    tax_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="ІПН")
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Організація"
        verbose_name_plural = "Організації"

    def __str__(self):
        return self.name

class Contract(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    number = models.CharField(max_length=50)
    date = models.DateField()

    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="contracts_as_supplier")
    client = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="contracts_as_client")

    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Контракт"
        verbose_name_plural = "Контракти"

    def __str__(self):
        return f"{self.number} ({self.organization.name} → {self.client.name})"

class Client(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255, verbose_name="Назва клієнта")
    code = models.CharField(max_length=50, unique=True)
    tax_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="ІПН")
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Клієнт"
        verbose_name_plural = "Клієнти"

    def __str__(self):
        return self.name

class Currency(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    code = models.CharField(max_length=3, unique=True, verbose_name="Код (UAH, USD, EUR)")
    name = models.CharField(max_length=50, verbose_name="Назва валюти")
    symbol = models.CharField(max_length=5, blank=True, null=True, verbose_name="Символ (₴, $, €)")
    rate = models.DecimalField(max_digits=12, decimal_places=4, default=1.0000, verbose_name="Курс до базової")

    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Валюта"
        verbose_name_plural = "Валюти"

    def __str__(self):
        return f"{self.code} — {self.name}"

class ChartOfAccount(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=True)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    code = models.CharField(max_length=20, unique=True, verbose_name="Код рахунку")
    name = models.CharField(max_length=255, verbose_name="Назва рахунку")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "План рахунків"
        verbose_name_plural = "План рахунків"

    def __str__(self):
        return f"{self.code} — {self.name}"

class BusinessOperation(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    code = models.CharField(max_length=20, unique=True, verbose_name="Код операції")
    name = models.CharField(max_length=255, verbose_name="Назва операції")
    description = models.TextField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Господарська операція"
        verbose_name_plural = "Господарські операції"

    def __str__(self):
        return f"{self.code} — {self.name}"

class Invoice(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    number = models.CharField(max_length=50, verbose_name="Номер рахунку")
    date = models.DateField(verbose_name="Дата")
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="invoices")
    client = models.ForeignKey("core.Client", on_delete=models.CASCADE, related_name="invoices")
    currency = models.ForeignKey("core.Currency", on_delete=models.SET_NULL, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, verbose_name="Сума")
    description = models.TextField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    comment = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Рахунок-фактура"
        verbose_name_plural = "Рахунки-фактури"

    def __str__(self):
        return f"{self.number} ({self.organization.name} → {self.client.name})"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey("core.Invoice", on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey("core.Item", on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=3, default=1.000)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    total = models.DecimalField(max_digits=14, decimal_places=2)

    comment = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "Позиція рахунку-фактури"
        verbose_name_plural = "Позиції рахунків-фактур"

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"

class IncomingPayment(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    number = models.CharField(max_length=50, verbose_name="Номер платіжки")
    date = models.DateField(verbose_name="Дата")
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="incoming_payments")
    client = models.ForeignKey("core.Client", on_delete=models.CASCADE, related_name="incoming_payments")
    invoice = models.ForeignKey("core.Invoice", on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    currency = models.ForeignKey("core.Currency", on_delete=models.SET_NULL, null=True, blank=True)
    account = models.ForeignKey("core.ChartOfAccount", on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=14, decimal_places=2, verbose_name="Сума")
    comment = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Надходження платежу"
        verbose_name_plural = "Надходження платежів"

    def __str__(self):
        return f"{self.number} ({self.client.name} → {self.organization.name})"

class Warehouse(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255, verbose_name="Назва складу")
    code = models.CharField(max_length=50, unique=True)
    address = models.TextField(blank=True, null=True)
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="warehouses")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Склад"
        verbose_name_plural = "Склади"

    def __str__(self):
        return self.name

class Department(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255, verbose_name="Назва підрозділу")
    code = models.CharField(max_length=50, unique=True)
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="departments")
    manager = models.CharField(max_length=255, blank=True, null=True, verbose_name="Керівник")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Підрозділ"
        verbose_name_plural = "Підрозділи"

    def __str__(self):
        return self.name

class Cashbox(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    name = models.CharField(max_length=255, verbose_name="Назва каси")
    code = models.CharField(max_length=50, unique=True)
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="cashboxes")
    department = models.ForeignKey("core.Department", on_delete=models.SET_NULL, null=True, blank=True, related_name="cashboxes")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Каса"
        verbose_name_plural = "Каси"

    def __str__(self):
        return self.name

class Bank(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    name = models.CharField(max_length=255, verbose_name="Назва банку")
    code = models.CharField(max_length=20, unique=True, verbose_name="МФО / BIC")
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Банк"
        verbose_name_plural = "Банки"

    def __str__(self):
        return f"{self.code} — {self.name}"

class SettlementAccount(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    account_number = models.CharField(max_length=34, unique=True, verbose_name="Розрахунковий рахунок (IBAN)")
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name="accounts")
    bank = models.ForeignKey("core.Bank", on_delete=models.CASCADE, related_name="accounts")
    currency = models.ForeignKey("core.Currency", on_delete=models.CASCADE, related_name="accounts")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Розрахунковий рахунок"
        verbose_name_plural = "Розрахункові рахунки"

    def __str__(self):
        return f"{self.account_number} — {self.organization.name}"

class Unit(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    code = models.CharField(max_length=10, unique=True, verbose_name="Код (шт, кг, м)")
    name = models.CharField(max_length=50, verbose_name="Назва")
    symbol = models.CharField(max_length=10, blank=True, null=True, verbose_name="Символ (шт, kg, m)")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Одиниця виміру"
        verbose_name_plural = "Одиниці виміру"

    def __str__(self):
        return self.name

class Person(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    last_name = models.CharField(max_length=50, verbose_name="Прізвище")
    first_name = models.CharField(max_length=50, verbose_name="Ім'я")
    middle_name = models.CharField(max_length=50, blank=True, null=True, verbose_name="По батькові")
    birth_date = models.DateField(blank=True, null=True)
    tax_number = models.CharField(max_length=12, blank=True, null=True, verbose_name="ІПН")
    passport = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Фізична особа"
        verbose_name_plural = "Фізичні особи"

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

class BusinessDirection(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    code = models.CharField(max_length=20, unique=True, verbose_name="Код напрямку")
    name = models.CharField(max_length=100, verbose_name="Назва напрямку")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Напрям діяльності"
        verbose_name_plural = "Напрями діяльності"

    def __str__(self):
        return self.name

class ExpenseItem(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    isfolder = models.BooleanField(default=False)
    ismark = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    code = models.CharField(max_length=20, unique=True, verbose_name="Код статті")
    name = models.CharField(max_length=100, verbose_name="Назва статті")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Стаття витрат"
        verbose_name_plural = "Статті витрат"

    def __str__(self):
        return self.name

class PriceType(models.Model):
    uuid = models.CharField(max_length=36, default=uuid_lib.uuid4, editable=False, unique=True)
    ismark = models.BooleanField(default=False)

    code = models.CharField(max_length=20, unique=True, verbose_name="Код")
    name = models.CharField(max_length=100, verbose_name="Назва")
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Вид ціни"
        verbose_name_plural = "Види цін"

    def __str__(self):
        return self.name
