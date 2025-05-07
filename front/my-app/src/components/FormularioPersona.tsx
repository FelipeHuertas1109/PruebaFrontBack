import { Persona } from "@/models/persona.model";
import React, { useState, useEffect } from "react";



const initialState: Persona = {
  tipo_persona: "",
  documento_tipo: "",
  documento: "",
  razon_social: "",
  nombre_comercial: "",
  tipo_empresa: "",
  pais: "",
  departamento: "",
  municipio: "",
  direccion: "",
  correo_electronico: "",
  numero_celular: "",
  digito_verificacion: "",
  persona_diligenciadora: "",
  cargo: "",
  area: "",
};

const FormularioPersona: React.FC = () => {
  const [persona, setPersona] = useState<Persona>(initialState);
  const [encontrada, setEncontrada] = useState<boolean | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Nuevo estado para los parámetros de la URL
  const [parametrosBusqueda, setParametrosBusqueda] = useState<{documento?: string, documento_tipo?: string}>({});

  // Leer parámetros de la URL y guardarlos en el estado temporal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const documento = params.get('documento');
    const documento_tipo = params.get('documento_tipo');
    if (documento && documento_tipo) {
      setParametrosBusqueda({ documento, documento_tipo });
      setPersona(prev => ({
        ...prev,
        documento,
        documento_tipo,
        tipo_persona: documento_tipo === 'nit' ? 'juridica' : 'natural'
      }));
    }
  }, []);

  // Cuando los parámetros de búsqueda y el estado de persona estén listos, buscar automáticamente
  useEffect(() => {
    if (
      parametrosBusqueda.documento &&
      parametrosBusqueda.documento_tipo &&
      persona.documento === parametrosBusqueda.documento &&
      persona.documento_tipo === parametrosBusqueda.documento_tipo
    ) {
      buscarPersonaAuto(parametrosBusqueda.documento, parametrosBusqueda.documento_tipo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona.documento, persona.documento_tipo, parametrosBusqueda]);

  // Función para buscar automáticamente
  const buscarPersonaAuto = async (documento: string, documento_tipo: string) => {
    setIsLoading(true);
    setMensaje("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/personas/documento/${documento}/`
      );
      if (res.ok) {
        const data = await res.json();
        const personaData = Array.isArray(data) ? data[0] : data;
        if (!personaData) {
          setEncontrada(false);
          setMensaje("No existe ninguna persona registrada con este documento. Puedes crearla.");
          setPersona({
            ...initialState,
            documento_tipo,
            documento,
            tipo_persona: documento_tipo === 'nit' ? 'juridica' : 'natural'
          });
          return;
        }
        const personaActualizada = {
          ...personaData,
          documento_tipo,
          documento,
          tipo_persona: documento_tipo === 'nit' ? 'juridica' : 'natural'
        };
        setPersona(personaActualizada);
        setEncontrada(true);
        setMensaje("Se ha encontrado la persona");
      } else {
        setEncontrada(false);
        setMensaje("No existe ninguna persona registrada con este documento. Puedes crearla.");
        setPersona({
          ...initialState,
          documento_tipo,
          documento,
          tipo_persona: documento_tipo === 'nit' ? 'juridica' : 'natural'
        });
      }
    } catch (error) {
      setMensaje("Error al buscar la persona");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si se cambia el tipo de persona, actualizamos automáticamente el tipo de documento
    if (name === 'tipo_persona') {
      setPersona({
        ...persona,
        [name]: value,
        documento_tipo: value === 'juridica' ? 'nit' : value === 'natural' ? 'cedula' : '',
        documento: '' // Limpiamos el documento cuando cambia el tipo
      });
    } else {
      setPersona({ ...persona, [name]: value });
    }
  };

  const buscarPersona = async () => {
    if (!persona.documento || !persona.documento_tipo) {
      setMensaje("Por favor seleccione el tipo de documento y el número");
      return;
    }

    setIsLoading(true);
    setMensaje("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/personas/documento/${persona.documento}/`
      );
      if (res.ok) {
        const data = await res.json();
        console.log('Datos recibidos del servidor:', data);
        
        // Verificamos si data es un array y tomamos el primer elemento
        const personaData = Array.isArray(data) ? data[0] : data;
        
        if (!personaData) {
          setEncontrada(false);
          setMensaje("No existe ninguna persona registrada con este documento");
          setPersona({
            ...initialState,
            documento_tipo: persona.documento_tipo,
            documento: persona.documento,
            tipo_persona: persona.tipo_persona
          });
          return;
        }

        // Aseguramos que los datos del documento y el id se mantengan
        const personaActualizada = {
          ...personaData,
          documento_tipo: persona.documento_tipo,
          documento: persona.documento,
          tipo_persona: persona.tipo_persona
        };
        console.log('Datos encontrados con ID:', personaActualizada);
        setPersona(personaActualizada);
        setEncontrada(true);
        setMensaje("Se ha encontrado la persona");
      } else {
        setEncontrada(false);
        setMensaje("No existe ninguna persona registrada con este documento");
        setPersona({
          ...initialState,
          documento_tipo: persona.documento_tipo,
          documento: persona.documento,
          tipo_persona: persona.tipo_persona
        });
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      setMensaje("Error al buscar la persona");
    } finally {
      setIsLoading(false);
    }
  };

  const guardarPersona = async () => {
    if (!validarFormulario()) return;
    
    setIsLoading(true);
    setMensaje("");
    try {
      const res = await fetch("http://localhost:8000/api/personas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(persona),
      });
      if (res.ok) {
        const data = await res.json();
        setPersona(data);
        setEncontrada(true);
        setMensaje("Persona guardada correctamente");
      } else {
        const error = await res.json();
        setMensaje(`Error al guardar: ${error.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      setMensaje("Error al guardar la persona");
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarPersona = async () => {
    if (!validarFormulario()) return;
    if (!persona.id) {
      setMensaje("No se puede actualizar una persona que no existe");
      return;
    }

    setIsLoading(true);
    setMensaje("");
    try {
      // Creamos un objeto con solo los campos que necesitamos enviar
      const datosActualizados = {
        tipo_persona: persona.tipo_persona,
        documento_tipo: persona.documento_tipo,
        documento: persona.documento,
        razon_social: persona.razon_social || '',
        nombre_comercial: persona.nombre_comercial || '',
        tipo_empresa: persona.tipo_empresa || '',
        pais: persona.pais || '',
        departamento: persona.departamento || '',
        municipio: persona.municipio || '',
        direccion: persona.direccion || '',
        correo_electronico: persona.correo_electronico || '',
        numero_celular: persona.numero_celular || '',
        digito_verificacion: persona.digito_verificacion || '',
        persona_diligenciadora: persona.persona_diligenciadora || '',
        cargo: persona.cargo || '',
        area: persona.area || ''
      };

      console.log('ID de la persona a actualizar:', persona.id);
      console.log('Datos a actualizar:', datosActualizados);

      const res = await fetch(`http://localhost:8000/api/personas/${persona.id}/`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(datosActualizados),
      });

      console.log('Respuesta del servidor:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Datos recibidos del servidor:', data);
        
        // Aseguramos que los datos del documento se mantengan
        const personaActualizada = {
          ...data,
          documento_tipo: persona.documento_tipo,
          documento: persona.documento,
          tipo_persona: persona.tipo_persona
        };
        
        console.log('Datos finales actualizados:', personaActualizada);
        setPersona(personaActualizada);
        setMensaje("Persona actualizada correctamente");
      } else {
        const error = await res.json();
        console.error('Error del servidor:', error);
        setMensaje(`Error al actualizar: ${error.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error en la actualización:', error);
      setMensaje("Error al actualizar la persona");
    } finally {
      setIsLoading(false);
    }
  };

  const validarFormulario = (): boolean => {
    if (!persona.tipo_persona) {
      setMensaje("Debe seleccionar el tipo de persona");
      return false;
    }
    if (!persona.documento_tipo || !persona.documento) {
      setMensaje("Debe ingresar el tipo y número de documento");
      return false;
    }
    if (persona.tipo_persona === 'juridica') {
      if (!persona.razon_social) {
        setMensaje("Debe ingresar la razón social");
        return false;
      }
    }
    // Validación de confirmación de correo
    if (persona.correo_electronico !== persona.confirmar_correo_electronico) {
      setMensaje("El correo electrónico y su confirmación no coinciden");
      return false;
    }
    // Validación de confirmación de número de celular
    if (persona.numero_celular !== persona.confirmar_numero_celular) {
      setMensaje("El número de celular y su confirmación no coinciden");
      return false;
    }
    return true;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Información de usuarios recaudadores</h2>
      <form className="grid grid-cols-2 gap-4">
        {persona.tipo_persona === 'juridica' && (
          <>
            <input 
              name="razon_social" 
              placeholder="Razón Social" 
              value={persona.razon_social} 
              onChange={handleChange} 
              className="border p-2 rounded" 
              disabled={encontrada === null}
            />
            <input 
              name="nombre_comercial" 
              placeholder="Nombre Comercial" 
              value={persona.nombre_comercial} 
              onChange={handleChange} 
              className="border p-2 rounded" 
              disabled={encontrada === null}
            />
            <input 
              name="tipo_empresa" 
              placeholder="Tipo de empresa" 
              value={persona.tipo_empresa} 
              onChange={handleChange} 
              className="border p-2 rounded" 
              disabled={encontrada === null}
            />
          </>
        )}
        <input 
          name="pais" 
          placeholder="País" 
          value={persona.pais} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        <input 
          name="departamento" 
          placeholder="Departamento" 
          value={persona.departamento} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        <input 
          name="municipio" 
          placeholder="Municipio" 
          value={persona.municipio} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        {persona.tipo_persona === 'juridica' && (
          <input 
            name="digito_verificacion" 
            placeholder="Dígito de verificación" 
            value={persona.digito_verificacion} 
            onChange={handleChange} 
            className="border p-2 rounded" 
            disabled={encontrada === null}
          />
        )}
        <input 
          name="direccion" 
          placeholder="Dirección" 
          value={persona.direccion} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        <input 
          name="correo_electronico" 
          placeholder="Correo Electrónico" 
          value={persona.correo_electronico} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        <input 
          name="numero_celular" 
          placeholder="Número de Celular" 
          value={persona.numero_celular} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        <input 
          name="persona_diligenciadora" 
          placeholder="Quien diligencia el formulario" 
          value={persona.persona_diligenciadora} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        <input 
          name="cargo" 
          placeholder="Cargo" 
          value={persona.cargo} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
        <input 
          name="area" 
          placeholder="Área" 
          value={persona.area} 
          onChange={handleChange} 
          className="border p-2 rounded" 
          disabled={encontrada === null}
        />
      </form>

      <div className="mt-6 flex gap-4">
        <button 
          onClick={actualizarPersona} 
          disabled={!encontrada || isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? "Actualizando..." : "Actualizar"}
        </button>
        <button 
          onClick={guardarPersona}
          disabled={encontrada !== false || isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>
      
      {mensaje && (
        <div className={`mt-4 p-4 rounded ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default FormularioPersona; 