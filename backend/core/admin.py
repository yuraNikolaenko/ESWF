from django.contrib import admin
from .models import Driver
from django.utils.html import format_html
from .models import Country

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = (
        'name', 
        'birth_date', 
        'gender', 
        'license_number', 
        'phone_number',
        'isfolder', 
        'ismark', 
        'parent', 
        'show_photo', 
        'created_at',
    )
    list_filter = ('isfolder', 'ismark', 'gender')
    search_fields = ('name', 'license_number', 'ipn')
    readonly_fields = ('uuid', 'created_at')

    def show_photo(self, obj):
        if obj.photo:
            return format_html('<img src="{}" width="50" height="50" style="object-fit:cover;border-radius:50%;" />', obj.photo.url)
        return "-"
    show_photo.short_description = "Фото"


class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_local', 'alpha2_code']
    search_fields = ['name', 'name_local', 'alpha2_code', 'alpha3_code', 'numeric_code']

admin.site.register(Country, CountryAdmin)
