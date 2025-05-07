from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Persona
from .serializers import PersonaSerializer

@api_view(['GET', 'POST'])
def persona_list_create(request):
    if request.method == 'GET':
        personas = Persona.objects.all()
        serializer = PersonaSerializer(personas, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PersonaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def persona_detail(request, pk):
    persona = get_object_or_404(Persona, pk=pk)
    if request.method == 'GET':
        serializer = PersonaSerializer(persona)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonaSerializer(persona, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        persona.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def persona_by_documento(request, documento):
    personas = Persona.objects.filter(documento=documento)
    serializer = PersonaSerializer(personas, many=True)
    return Response(serializer.data)
