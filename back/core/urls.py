from django.urls import path
from .views import persona_list_create, persona_detail, persona_by_documento

urlpatterns = [
    path('personas/', persona_list_create, name='persona-list-create'),
    path('personas/<int:pk>/', persona_detail, name='persona-detail'),
    path('personas/documento/<str:documento>/', persona_by_documento, name='persona-by-doc'),
]