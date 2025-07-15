import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TaskFormModal from "../components/TaskFormModal";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function Dashboard() {
  const { user, logout, tasks, getTasks, createTask, updateTask, deleteTask,
    errors, clearErrors } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getTasks({ title: titleFilter, status: statusFilter });
  }, [titleFilter, statusFilter]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    getTasks({ title: titleFilter, status: statusFilter });
  };

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    clearErrors();
  };

  const handleFormSubmit = async (formData) => {
    let success;
    if (editingTask) {
      success = await updateTask(editingTask.id, formData);
    } else {
      success = await createTask(formData);
    }
    if (success) {
      handleCloseModal();
    }
  };

  const handlePageChange = (pageNumber) => {
    getTasks({ ...{ page: pageNumber, title: titleFilter, status: statusFilter } });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 text-xl font-bold text-indigo-600">
              Table Plus
            </div>
            <div className="flex items-center">
              <Link to="/" className="text-gray-800 hover:text-gray-600 mr-4">
                Dashboard
              </Link>
              <Link to="/backup" className="text-gray-800 hover:text-gray-600 mr-4">
                Backup
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-800 mr-4">
                Hola, {user ? user.name : "Invitado"}
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard de Tareas
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            + Nueva Tarea
          </button>
        </div>
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <form onSubmit={handleFilterSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="title-filter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Buscar por título
                </label>
                <input
                  type="text"
                  id="title-filter"
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  placeholder="Ej: Revisar informe"
                />
              </div>
              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Filtrar por estado
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 sm:mt-5 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Filtrar
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {tasks.data && tasks.data.length > 0 ? (
                tasks.data.map((task) => (
                  <li key={task.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <p className="font-medium text-indigo-600 truncate text-left">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {task.description}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Vence:{" "}
                          {new Intl.DateTimeFormat("es-DO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(task.due_date))}
                        </p>
                        {task.attachment_path && (
                          <p className="mt-2 flex items-center text-sm text-white sm:mt-0 sm:ml-6">
                            <a
                              href={`http://127.0.0.1:8000/storage/${task.attachment_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white! hover:border-white bg-indigo-600 rounded-xl px-2 py-1"
                            >
                              Ver Adjunto
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 space-x-2">
                          <button
                            onClick={() => handleOpenModal(task)}
                            className="text-indigo-600 hover:text-indigo-900 bg-gray-500 hover:bg-gray-100 px-2 py-1 rounded"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No tienes tareas pendientes. ¡Crea una nueva!
                </li>
              )}
            </ul>
          </div>
        </div>
        {tasks.data && tasks.data.length > 0 && (
          <Pagination links={tasks.links} onPageChange={handlePageChange} />
        )}
      </main>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        task={editingTask}
        errors={errors}
      />
    </div>
  );
}
