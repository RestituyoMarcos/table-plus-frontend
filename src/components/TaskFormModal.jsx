import React, { useState, useEffect } from 'react';

export default function TaskFormModal({ isOpen, onClose, onSubmit, task }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending',
  });

  useEffect(() => {
    if (task) {
        const formattedDate = task.due_date 
        ? new Date(task.due_date).toISOString().slice(0, 16) 
        : '';
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: formattedDate,
        status: task.status || 'pending',
      });
    } else {
      setFormData({ title: '', description: '', due_date: '', status: 'pending' });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/50 b flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{task ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Título</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div className="mb-4">
            <label>Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" required></textarea>
          </div>
          <div className="mb-4">
            <label>Fecha de Vencimiento</label>
            <input type="datetime-local" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full border p-2 rounded text-gray-700" required />
          </div>
          <div className="mb-4">
            <label>Estado</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{task ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}