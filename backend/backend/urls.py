from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from core.views import root_info

urlpatterns = [
    path('', root_info),  # ← ось це має бути
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
