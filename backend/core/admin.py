from django.contrib import admin
from django.utils.html import format_html
from .models import Driver, Country, LocationPoint, Route

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'birth_date', 'gender', 'license_number', 'phone_number',
        'isfolder', 'ismark', 'parent', 'show_photo', 'created_at',
    )
    list_filter = ('isfolder', 'ismark', 'gender')
    search_fields = ('name', 'license_number', 'ipn')
    readonly_fields = ('uuid', 'created_at')

    def show_photo(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit:cover;border-radius:50%;" />',
                obj.photo.url
            )
        return "-"
    show_photo.short_description = "Фото"

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_local', 'alpha2_code']
    search_fields = ['name', 'name_local', 'alpha2_code', 'alpha3_code', 'numeric_code']

@admin.register(LocationPoint)
class LocationPointAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'country', 'code', 'parent')
    search_fields = ('name', 'code')
    list_filter = ('country',)

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'departure_point', 'return_point',
        'distance_km', 'isfolder', 'ismark', 'parent', 'comment'
    )
    search_fields = ('name', 'comment', 'code')
    list_filter = ('isfolder', 'ismark', 'departure_point__region')
    autocomplete_fields = ['departure_point', 'return_point', 'parent']
