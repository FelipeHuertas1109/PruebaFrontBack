from django.contrib import admin
from .models import Persona

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ('tipo_persona', 'documento', 'razon_social', 'nombre_comercial', 'pais', 'departamento', 'municipio')
    search_fields = ('documento', 'razon_social', 'nombre_comercial')
    list_filter = ('tipo_persona', 'documento_tipo', 'pais', 'departamento')
