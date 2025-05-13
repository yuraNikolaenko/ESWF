from django.contrib import admin
from django.utils.html import format_html
from .models import Country, LocationPoint

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_local', 'alpha2_code']
    search_fields = ['name', 'name_local', 'alpha2_code', 'alpha3_code', 'numeric_code']

@admin.register(LocationPoint)
class LocationPointAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'country', 'code', 'parent')
    search_fields = ('name', 'code')
    list_filter = ('country',)

