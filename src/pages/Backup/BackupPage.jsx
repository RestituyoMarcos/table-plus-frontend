import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function BackupPage() {
  const { createBackup, restoreBackup } = useAuth();
  const [restoreFile, setRestoreFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleRestoreSubmit = async (e) => {
    e.preventDefault();
    if (!restoreFile) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }
    const success = await restoreBackup(restoreFile);
    if (success) {
      setMessage('¡Tareas restauradas con éxito!');
      setRestoreFile(null);
    } else {
      setMessage('Error al restaurar el backup.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/" className="text-indigo-600 hover:text-indigo-900">&larr; Volver al Dashboard</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Backup y Restauración</h1>
        
        {message && <p className="mb-4 p-3 rounded-md bg-green-100 text-green-800">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Crear Backup</h2>
            <p className="text-gray-600 mb-4">Descarga un archivo XML con todas tus tareas.</p>
            <button
              onClick={createBackup}
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Descargar Backup
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Restaurar desde Backup</h2>
            <p className="text-gray-600 mb-4">Sube un archivo XML para restaurar tus tareas. Las tareas existentes se actualizarán.</p>
            <form onSubmit={handleRestoreSubmit}>
              <input
                type="file"
                accept=".xml"
                onChange={(e) => setRestoreFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Restaurar Tareas
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}