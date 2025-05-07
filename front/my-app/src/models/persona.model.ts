export type Persona = {
    id?: number;
    tipo_persona: string;
    documento_tipo: string;
    documento: string;
    // Campos para persona jurídica
    razon_social?: string;
    nombre_comercial?: string;
    tipo_empresa?: string;
    // Información común
    pais: string;
    departamento: string;
    municipio: string;
    direccion: string;
    correo_electronico: string;
    numero_celular: string;
    digito_verificacion?: string;
    persona_diligenciadora: string;
    cargo?: string;
    area?: string;  
    // Campo para tareas
    tareas?: any[];
    // Campo para la tabla
    fecha?: string;
    nit?: string;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    confirmar_correo_electronico?: string;
    confirmar_numero_celular?: string;
  };