from django.db import models

class Persona(models.Model):
    # Tipo de persona (jurídica o natural)
    TIPOS_PERSONA = [
        ('natural', 'Natural'),
        ('juridica', 'Jurídica')
    ]
    tipo_persona = models.CharField(max_length=10, choices=TIPOS_PERSONA, blank=True, null=True)

    # Documento de identificación, dependiendo del tipo de persona
    documento_tipo = models.CharField(max_length=20, choices=[('cedula', 'Cédula'), ('nit', 'NIT')], blank=True, null=True)
    documento = models.CharField(max_length=20, unique=True, blank=True, null=True)

    # Nombres y apellidos
    primer_nombre = models.CharField(max_length=100, blank=True, null=True)
    segundo_nombre = models.CharField(max_length=100, blank=True, null=True)
    primer_apellido = models.CharField(max_length=100, blank=True, null=True)
    segundo_apellido = models.CharField(max_length=100, blank=True, null=True)
    

    # Información adicional para personas jurídicas
    razon_social = models.CharField(max_length=255, blank=True, null=True)
    nombre_comercial = models.CharField(max_length=255, blank=True, null=True)
    tipo_empresa = models.CharField(max_length=255, blank=True, null=True)

    # Información común para todas las personas
    pais = models.CharField(max_length=100, blank=True, null=True)
    departamento = models.CharField(max_length=100, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    correo_electronico = models.EmailField(blank=True, null=True)
    numero_celular = models.CharField(max_length=15, blank=True, null=True)
    digito_verificacion = models.CharField(max_length=2, blank=True, null=True)
    fecha = models.DateField(auto_now_add=True, blank=True, null=True)  

    # Quien diligencia el formulario
    persona_diligenciadora = models.CharField(max_length=255, blank=True, null=True)
    cargo = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f'{self.primer_nombre} {self.primer_apellido} ({self.documento})'

# El modelo Tarea permanece igual
class Tarea(models.Model):
    persona = models.ForeignKey(Persona, related_name='tareas', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_limite = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.titulo
