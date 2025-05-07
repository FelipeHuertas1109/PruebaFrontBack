'use client';

import React, { useState, useEffect } from "react";
import { Persona } from "@/models/persona.model";
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';
import ModalDireccion from '@/components/ModalDireccion';
import {
  HomeIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

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
  confirmar_correo_electronico: "",
  numero_celular: "",
  confirmar_numero_celular: "",
  digito_verificacion: "",
  persona_diligenciadora: "",
  cargo: "",
  area: "",
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [persona, setPersona] = useState<Persona>(initialState);
  const [encontrada, setEncontrada] = useState<boolean | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalDireccionOpen, setModalDireccionOpen] = useState(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/independent?status=true&fields=name")
      .then(res => res.json())
      .then((data: any[]) => {
        setCountries(data.map(c => c.name.common).sort());
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const doc = searchParams.get('documento');
    const docType = searchParams.get('documento_tipo');
    if (doc && docType) {
      const tipo = docType === 'cedula' ? 'natural' : 'juridica';
      setPersona(p => ({
        ...p,
        tipo_persona: tipo,
        documento_tipo: docType,
        documento: doc
      }));
      buscarPersona(doc, docType);
    }
  }, [searchParams]);

  const fetchStates = async (country: string) => {
    setStates([]); setCities([]);
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country })
      });
      const json = await res.json();
      setStates(json.data.states.map((s: any) => s.name).sort());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCities = async (country: string, state: string) => {
    setCities([]);
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state })
      });
      const json = await res.json();
      setCities((json.data as string[]).sort());
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tipo_persona') {
      setPersona({
        ...initialState,
        tipo_persona: value,
        documento_tipo: value === 'juridica' ? 'nit' : 'cedula'
      });
      setEncontrada(null);
    } else if (name === 'pais') {
      setPersona(p => ({ ...p, pais: value, departamento: "", municipio: "" }));
      fetchStates(value);
    } else if (name === 'departamento') {
      setPersona(p => ({ ...p, departamento: value, municipio: "" }));
      fetchCities(persona.pais, value);
    } else if (name === 'primer_nombre' || name === 'primer_apellido') {
      const n1 = name === 'primer_nombre' ? value : persona.primer_nombre || '';
      const n2 = name === 'primer_apellido' ? value : persona.primer_apellido || '';
      setPersona(p => ({ ...p, [name]: value, persona_diligenciadora: `${n1} ${n2}`.trim() }));
    } else {
      setPersona(p => ({ ...p, [name]: value }));
    }
  };

  const buscarPersona = async (docParam?: string, docTypeParam?: string) => {
    const doc = docParam ?? persona.documento;
    const docType = docTypeParam ?? persona.documento_tipo;
    if (!doc || !docType) {
      await Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Seleccione tipo y número de documento' });
      return;
    }
  
    setIsLoading(true);
    setMensaje("");
  
    try {
      const res = await fetch(`http://localhost:8000/api/personas/documento/${doc}/`);
      const data = res.ok ? await res.json() : null;
      const pd = Array.isArray(data) ? data[0] : data;
  
      if (!res.ok || !pd) {
        setEncontrada(false);
  
        const mensajeTipo =
          docType === 'nit'
            ? 'No existe ninguna persona registrada con ese NIT'
            : docType === 'cedula'
              ? 'No existe ninguna persona registrada con esa cédula'
              : 'No se encontró la persona';
  
        await Swal.fire({
          icon: 'error',
          title: 'No encontrado',
          text: mensajeTipo
        });
  
        setPersona({ ...initialState, documento: doc, documento_tipo: docType, tipo_persona: persona.tipo_persona });
      } else {
        setPersona({ ...initialState, ...pd, documento: doc, documento_tipo: docType, tipo_persona: persona.tipo_persona });
        setEncontrada(true);
        setMensaje("Se ha encontrado la persona");
      }
    } catch (e) {
      console.error(e);
      setMensaje("Error al buscar la persona");
    } finally {
      setIsLoading(false);
    }
  };
  

  const guardarPersona = async () => {
    if (!validarFormulario()) return;
    setIsLoading(true); setMensaje("");
    try {
      const res = await fetch("http://localhost:8000/api/personas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(persona)
      });
      if (res.ok) {
        const data = await res.json();
        setPersona(data);
        setEncontrada(true);
        setMensaje("Persona guardada correctamente");
      } else {
        const err = await res.json();
        setMensaje(`Error al guardar: ${err.detail || 'Desconocido'}`);
      }
    } catch {
      setMensaje("Error al guardar la persona");
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarPersona = async () => {
    if (!validarFormulario() || !persona.id) {
      setMensaje("No se puede actualizar"); 
      return;
    }
    setIsLoading(true); setMensaje("");
    try {
      const res = await fetch(`http://localhost:8000/api/personas/${persona.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(persona)
      });
      if (res.ok) {
        const data = await res.json();
        setPersona({ ...initialState, ...data });
        setMensaje("Persona actualizada correctamente");
      } else {
        const err = await res.json();
        setMensaje(`Error al actualizar: ${err.detail || 'Desconocido'}`);
      }
    } catch {
      setMensaje("Error al actualizar la persona");
    } finally {
      setIsLoading(false);
    }
  };

  const validarFormulario = () => {
    if (!persona.tipo_persona || !persona.documento || !persona.documento_tipo) {
      setMensaje("Complete los campos obligatorios"); 
      return false;
    }
    if (persona.correo_electronico !== persona.confirmar_correo_electronico) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Los correos no coinciden' });
      return false;
    }
    if (persona.numero_celular !== persona.confirmar_numero_celular) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Los celulares no coinciden' });
      return false;
    }
    return true;
  };

  const baseCls = "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400";
  const disabledCls = " disabled:bg-gray-100";

  return (
    <div className="flex h-screen bg-amber-50">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-100 border-r border-amber-200 p-4 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full shadow mb-2 flex items-center justify-center">
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
          </div>
          <span className="font-semibold">Usuario Interno</span>
        </div>
        <nav className="flex-1">
          <button className="w-full text-left px-3 py-2 mb-2 bg-white rounded hover:bg-amber-200 transition">
            Perfil
          </button>
          <button className="w-full text-left px-3 py-2 mb-2 bg-white rounded hover:bg-amber-200 transition">
            Cerrar Sesión
          </button>
          <div className="mt-4">
            <button className="w-full text-left px-3 py-2 mb-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded">
              Gestor de Recaudo
            </button>
            <div className="pl-6">
              <button className="w-full text-left px-3 py-1 text-sm text-orange-700 font-medium">
                Identificación de usuarios
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-12 bg-amber-100 flex items-center justify-end px-4 space-x-4 border-b border-amber-200">
        <HomeIcon
          className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={() => router.push('/table')}
        />
          <BellIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
          <UserCircleIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
        </header>

        {/* Content */}
        <main className="p-6 overflow-auto">
          {/* Identificación */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold text-orange-600 mb-4">
              Identificación de usuarios recaudadores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                name="tipo_persona"
                value={persona.tipo_persona}
                onChange={handleChange}
                className={baseCls}
              >
                <option value="">Tipo de persona *</option>
                <option value="juridica">Jurídica</option>
                <option value="natural">Natural</option>
              </select>
              <select
                name="documento_tipo"
                value={persona.documento_tipo}
                onChange={handleChange}
                disabled={!persona.tipo_persona}
                className={baseCls + disabledCls}
              >
                <option value="">Tipo de documento *</option>
                {persona.tipo_persona === 'juridica' && <option value="nit">NIT</option>}
                {persona.tipo_persona === 'natural' && <option value="cedula">Cédula</option>}
              </select>
              <input
                name="documento"
                placeholder="Número de documento *"
                value={persona.documento}
                onChange={handleChange}
                disabled={!persona.documento_tipo}
                className={baseCls + disabledCls}
              />
              <button
                onClick={() => buscarPersona()}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-full hover:from-orange-500 hover:to-orange-700 transition disabled:from-gray-400 disabled:to-gray-400"
              >
                {isLoading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-orange-600 mb-4">
              Información de usuarios recaudadores
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {persona.tipo_persona === 'juridica' && (
                <>
                  <input
                    name="razon_social"
                    placeholder="Razón Social"
                    value={persona.razon_social}
                    onChange={handleChange}
                    disabled={encontrada === null}
                    className={baseCls + disabledCls}
                  />
                  <input
                    name="nombre_comercial"
                    placeholder="Nombre Comercial"
                    value={persona.nombre_comercial}
                    onChange={handleChange}
                    disabled={encontrada === null}
                    className={baseCls + disabledCls}
                  />
                  <select
                    name="tipo_empresa"
                    value={persona.tipo_empresa}
                    onChange={handleChange}
                    disabled={encontrada === null}
                    className={baseCls + disabledCls}
                  >
                    <option value="">Tipo de empresa *</option>
                    <option value="Comercializador">Comercializador</option>
                    <option value="Transformador">Transformador</option>
                    <option value="Exportador">Exportador</option>
                  </select>
                </>
              )}

              <select
                name="pais"
                value={persona.pais}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              >
                <option value="">País *</option>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>

              {/* Departamento/Estado */}
<select
  name="departamento"
  value={persona.departamento}
  onChange={handleChange}
  disabled={!persona.pais || encontrada === null}
  className={`${baseCls}${disabledCls}`}
>
  <option value="">Departamento/Estado *</option>

  {/* Si viene un departamento en la DB y no está en la lista, lo metemos primero */}
  {persona.departamento && !states.includes(persona.departamento) && (
    <option value={persona.departamento}>
      {persona.departamento}
    </option>
  )}

  {states.map(s => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>


{/* Municipio */}
<select
  name="municipio"
  value={persona.municipio}
  onChange={handleChange}
  disabled={!persona.departamento || encontrada === null}
  className={`${baseCls}${disabledCls}`}
>
  <option value="">Municipio *</option>

  {/* Fallback: si DB trae municipio que no está en cities */}
  {persona.municipio && !cities.includes(persona.municipio) && (
    <option value={persona.municipio}>
      {persona.municipio}
    </option>
  )}

  {cities.map(c => (
    <option key={c} value={c}>
      {c}
    </option>
  ))}
</select>

              <div className="col-span-1 md:col-span-2 flex gap-2">
                <input
                  name="direccion"
                  placeholder="Dirección *"
                  value={persona.direccion}
                  onChange={handleChange}
                  disabled={encontrada === null}
                  className={baseCls + " flex-1" + disabledCls}
                />
                <button
                  type="button"
                  onClick={() => setModalDireccionOpen(true)}
                  disabled={encontrada === null}
                  className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-500 hover:to-orange-700 transition disabled:from-gray-400 disabled:to-gray-400"
                >
                  Generar dirección
                </button>
              </div>

              {persona.tipo_persona === 'juridica' && (
  <input
    name="digito_verificacion"
    placeholder="Dígito de verificación"
    value={persona.digito_verificacion}
    onChange={handleChange}
    disabled={encontrada === null}
    className={baseCls + disabledCls}
  />
)}
              <input
                name="correo_electronico"
                placeholder="Correo Electrónico *"
                value={persona.correo_electronico}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
              <input
                name="confirmar_correo_electronico"
                placeholder="Confirmar Correo Electrónico *"
                value={persona.confirmar_correo_electronico || ''}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
              <input
                name="numero_celular"
                placeholder="Número de Celular *"
                value={persona.numero_celular}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
              <input
                name="confirmar_numero_celular"
                placeholder="Confirmar Número de Celular *"
                value={persona.confirmar_numero_celular || ''}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
              <input
                name="primer_nombre"
                placeholder="Primer Nombre"
                value={persona.primer_nombre || ''}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
              <input
                name="primer_apellido"
                placeholder="Primer Apellido"
                value={persona.primer_apellido || ''}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
              <input
                name="persona_diligenciadora"
                placeholder="Quien diligencia el formulario"
                value={persona.persona_diligenciadora}
                disabled
                className={baseCls + disabledCls}
              />
              <input
                name="cargo"
                placeholder="Cargo"
                value={persona.cargo}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
              <input
                name="area"
                placeholder="Área"
                value={persona.area}
                onChange={handleChange}
                disabled={encontrada === null}
                className={baseCls + disabledCls}
              />
            </form>

            <div className="mt-6 flex gap-4">
              <button
                onClick={actualizarPersona}
                disabled={!encontrada || isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition"
              >
                {isLoading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                onClick={guardarPersona}
                disabled={encontrada || isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </button>
            </div>

            {mensaje && (
              <div className={`mt-4 p-4 rounded ${
                mensaje.includes('Error')
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {mensaje}
              </div>
            )}
          </div>
        </main>
      </div>

      <ModalDireccion
        isOpen={modalDireccionOpen}
        onClose={() => setModalDireccionOpen(false)}
        onSave={(direccion) => setPersona(p => ({ ...p, direccion }))}
        initialValues={{ direccion: persona.direccion }}
      />
    </div>
  );
}
