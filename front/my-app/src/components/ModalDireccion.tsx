import React, { useState } from 'react';

interface ModalDireccionProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (direccion: string) => void;
  initialValues?: {
    direccion?: string;
  };
}

const tiposVia = [
  '',
  'Calle',
  'Carrera',
  'Transversal',
  'Avenida',
];

const ModalDireccion: React.FC<ModalDireccionProps> = ({ isOpen, onClose, onSave, initialValues }) => {
  const [tipoVia, setTipoVia] = useState('');
  const [num1, setNum1] = useState('');
  const [letra1, setLetra1] = useState('');
  const [num2, setNum2] = useState('');
  const [letra2, setLetra2] = useState('');
  const [num3, setNum3] = useState('');
  const [letra3, setLetra3] = useState('');
  const [complemento, setComplemento] = useState('');

  React.useEffect(() => {
    // Si hay un valor inicial, intentar parsear (opcional)
    if (initialValues?.direccion) {
      // No parseamos, dejamos vacío para que el usuario lo llene
    }
  }, [initialValues]);

  const handleSave = () => {
    // Formato: [Tipo de vía] [número][letra] # [número][letra] - [número][letra] [complemento]
    let direccion = '';
    if (tipoVia) direccion += tipoVia + ' ';
    if (num1) direccion += num1;
    if (letra1) direccion += letra1;
    if (num2 || letra2) direccion += ' # ';
    if (num2) direccion += num2;
    if (letra2) direccion += letra2;
    if (num3 || letra3) direccion += ' - ';
    if (num3) direccion += num3;
    if (letra3) direccion += letra3;
    if (complemento) direccion += ' ' + complemento;
    onSave(direccion.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Generar dirección</h2>
        <div className="mb-2 flex flex-wrap gap-2 items-center">
          <select
            value={tipoVia}
            onChange={e => setTipoVia(e.target.value)}
            className="border p-2 rounded mb-2"
          >
            {tiposVia.map((tipo, idx) => (
              <option key={idx} value={tipo}>{tipo || 'Tipo de vía'}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Número"
            value={num1}
            onChange={e => setNum1(e.target.value)}
            className="border p-2 rounded w-20 mb-2"
          />
          <input
            type="text"
            placeholder="Letra"
            value={letra1}
            onChange={e => setLetra1(e.target.value)}
            className="border p-2 rounded w-16 mb-2"
          />
          <span className="font-bold">#</span>
          <input
            type="text"
            placeholder="Número"
            value={num2}
            onChange={e => setNum2(e.target.value)}
            className="border p-2 rounded w-20 mb-2"
          />
          <input
            type="text"
            placeholder="Letra"
            value={letra2}
            onChange={e => setLetra2(e.target.value)}
            className="border p-2 rounded w-16 mb-2"
          />
          <span className="font-bold">-</span>
          <input
            type="text"
            placeholder="Número"
            value={num3}
            onChange={e => setNum3(e.target.value)}
            className="border p-2 rounded w-20 mb-2"
          />
          <input
            type="text"
            placeholder="Letra"
            value={letra3}
            onChange={e => setLetra3(e.target.value)}
            className="border p-2 rounded w-16 mb-2"
          />
        </div>
        <input
          type="text"
          placeholder="Complemento (opcional)"
          value={complemento}
          onChange={e => setComplemento(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Guardar dirección
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDireccion; 