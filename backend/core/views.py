
# core/views.py
from django.http import HttpResponse

def root_info(request):
    return HttpResponse("<h2>👋 ESWF API Server</h2><p>Перейдіть до <a href='/api/'>/api/</a></p>")
