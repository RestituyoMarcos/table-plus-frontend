import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  errors,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [attachment, setAttachment] = useState(null);
  const [reminder, setReminder] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(
        task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ""
      );
      setStatus(task.status || "pending");
      setAttachment(null);
      setReminder(task.reminder_minutes_before || "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("pending");
      setAttachment(null);
      setReminder("");
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("due_date", dueDate);
    formData.append("status", status);
    if (attachment) {
      formData.append("attachment", attachment);
    }
    if (reminder) {
      formData.append("reminder_minutes_before", reminder);
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/50 b flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {task ? "Editar Tarea" : "Crear Nueva Tarea"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            {errors?.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label>Descripción</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              required
            ></textarea>
            {errors?.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label>Fecha de Vencimiento</label>
            <input
              type="datetime-local"
              name="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border p-2 rounded text-gray-700"
              required
            />
            {errors?.due_date && (
              <p className="text-red-500 text-xs mt-1">{errors.due_date[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label>Recordatorio (minutos antes)</label>
            <select
              name="reminder"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Sin Recordatorio</option>
              <option value="5">5 minutos</option>
              <option value="10">10 minutos</option>
              <option value="15">15 minutos</option>
              <option value="20">20 minutos</option>
              <option value="30">30 minutos</option>
            </select>
            {errors?.reminder_minutes_before && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reminder_minutes_before[0]}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label>Estado</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
            </select>
            {errors?.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label>Adjunto (PDF, JPG, PNG)</label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="w-full border p-2 rounded"
            />
            {errors?.attachment && (
              <p className="text-red-500 text-xs mt-1">
                {errors.attachment[0]}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {task ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
