from rest_framework import serializers
from .models import Persona, Tarea

class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = '__all__'

class PersonaSerializer(serializers.ModelSerializer):
    tareas = TareaSerializer(many=True, read_only=True)

    class Meta:
        model = Persona
        fields = '__all__'