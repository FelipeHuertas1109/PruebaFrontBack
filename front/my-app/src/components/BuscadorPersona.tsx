'use client';

import React from 'react';
import { Persona } from '@/models/persona.model';

interface BuscadorPersonaProps {
  persona: Persona;
  setPersona: React.Dispatch<React.SetStateAction<Persona>>;
  isLoading: boolean;
  buscarPersona: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BuscadorPersona: React.FC<BuscadorPersonaProps> = ({
  persona,
  isLoading,
  buscarPersona,
  handleChange,
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Identificación de usuarios recaudadores</h2>
      <div className="flex gap-4 mb-6">
        <select
          name="tipo_persona"
          value={persona.tipo_persona}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Tipo de persona</option>
          <option value="juridica">Jurídica</option>
          <option value="natural">Natural</option>
        </select>
        <select
          name="documento_tipo"
          value={persona.documento_tipo}
          onChange={handleChange}
          className="border p-2 rounded"
          disabled={!persona.tipo_persona}
        >
          <option value="">Tipo de documento</option>
          {persona.tipo_persona === 'juridica' && <option value="nit">NIT</option>}
          {persona.tipo_persona === 'natural' && <option value="cedula">Cédula</option>}
        </select>
        <input
          name="documento"
          placeholder="Número de documento"
          value={persona.documento}
          onChange={handleChange}
          className="border p-2 rounded"
          disabled={!persona.documento_tipo}
        />
        <button
          onClick={buscarPersona}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </>
  );
};

export default BuscadorPersona;
