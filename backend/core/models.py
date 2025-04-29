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

    def __str__(self):
        return f"{self.license_plate} - {self.brand} {self.model}"

