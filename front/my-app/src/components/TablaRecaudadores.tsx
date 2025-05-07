'use client';

import React from 'react';
import { Persona } from '@/models/persona.model';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface TablaRecaudadoresProps {
  personas: Persona[];
}

const TablaRecaudadores: React.FC<TablaRecaudadoresProps> = ({ personas }) => {
  const router = useRouter();

  const handleEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta persona?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    const res = await fetch(`http://localhost:8000/api/personas/${id}/`, {
      method: 'DELETE',
    });
    if (res.ok) {
      Swal.fire('Eliminado', 'La persona ha sido eliminada.', 'success');
      router.refresh();
    } else {
      Swal.fire('Error', 'No se pudo eliminar.', 'error');
    }
  };

  const handleEditar = (p: Persona) => {
    // Navega a la página principal con query params
    router.push(
      `/?documento=${encodeURIComponent(p.documento)}&documento_tipo=${encodeURIComponent(
        p.documento_tipo
      )}`
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Id</th>
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">NIT/Cédula</th>
            <th className="px-4 py-2 border">Razón Social</th>
            <th className="px-4 py-2 border">Tipo de empresa</th>
            <th className="px-4 py-2 border">Correo Electrónico</th>
            <th className="px-4 py-2 border">Número de Celular</th>
            <th className="px-4 py-2 border">Representante Legal</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center p-4">
                No hay resultados.
              </td>
            </tr>
          )}
          {personas.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{p.id}</td>
              <td className="px-4 py-2 border">{p.fecha ?? '-'}</td>
              <td className="px-4 py-2 border">{p.nit ?? p.documento}</td>
              <td className="px-4 py-2 border">{p.razon_social ?? '-'}</td>
              <td className="px-4 py-2 border">{p.tipo_empresa ?? '-'}</td>
              <td className="px-4 py-2 border">{p.correo_electronico}</td>
              <td className="px-4 py-2 border">{p.numero_celular}</td>
              <td className="px-4 py-2 border">
                {`${p.primer_nombre ?? ''} ${p.primer_apellido ?? ''}`.trim() || '-'}
              </td>
              <td className="px-4 py-2 border">Activo</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEditar(p)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(p.id!)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaRecaudadores;
