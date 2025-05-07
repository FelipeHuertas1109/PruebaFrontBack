'use client';

import React, { useState, useEffect } from 'react';
import { Persona } from '@/models/persona.model';
import BuscadorPersona from '@/components/BuscadorPersona';
import TablaRecaudadores from '@/components/TablaRecaudadores';
import {
  HomeIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const initialPersona: Persona = {
  tipo_persona: '',
  documento_tipo: '',
  documento: '',
  pais: '',
  departamento: '',
  municipio: '',
  direccion: '',
  correo_electronico: '',
  numero_celular: '',
  persona_diligenciadora: '',
  confirmar_correo_electronico: '',
  confirmar_numero_celular: '',
};

export default function TablePage() {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // carga inicial de todos los recaudadores
  useEffect(() => {
    cargarTodos();
  }, []);

  const cargarTodos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/personas/');
      if (!res.ok) throw new Error();
      const data: Persona[] = await res.json();
      setPersonas(data);
    } catch {
      setPersonas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarPersona = async () => {
    if (!persona.documento || !persona.documento_tipo) {
      alert('Debe ingresar tipo y número de documento');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/personas/documento/${persona.documento}/`
      );
      if (!res.ok) {
        setPersonas([]);
      } else {
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [data];
        setPersonas(lista);
      }
    } catch {
      setPersonas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersona((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex h-screen bg-amber-50">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-100 border-r border-amber-200 p-4 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full shadow-md mb-2 flex items-center justify-center">
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

      {/* Main content */}
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

        {/* Page body */}
        <main className="p-6 overflow-auto">
          {/* Buscador */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold text-orange-600 mb-4">
              Identificación de usuarios recaudadores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                name="tipo_persona"
                value={persona.tipo_persona}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <button
                onClick={() => buscarPersona()}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-full hover:from-orange-500 hover:to-orange-700 transition disabled:from-gray-400 disabled:to-gray-400"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-orange-600">
              Registro de recaudadores pre-identificados
            </h1>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              + Pre-registrar
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <TablaRecaudadores personas={personas} />
          </div>
        </main>
      </div>
    </div>
  );
}
