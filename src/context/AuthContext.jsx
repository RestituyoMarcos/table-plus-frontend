import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [errors, setErrors] = useState(null);
  const [tasks, setTasks] = useState({ data: [], links: [], meta: {} });

  const clearErrors = () => {
    setErrors(null);
  };

  const login = async (email, password) => {
    try {
        
      const response = await api.post("/login", { email, password });
      const { user, access_token } = response.data;

      setUser(user);
      setToken(access_token);

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem("token", access_token);
      setErrors(null);
    } catch (error) {
      setErrors(error.response.data.message || "Error al iniciar sesión.");
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      const { user, access_token } = response.data;

      setUser(user);
      setToken(access_token);

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem("token", access_token);
      setErrors(null);
    } catch (error) {
      setErrors(error.response.data.message || "Error al registrar.");
    }
  };

  const logout = () => {
    api.post('/logout').then(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    });
  };

  const getTasks = async (filters = {}) => {
    try {
      const response = await api.get('/mytasks', { params: filters });
      setTasks(response.data); 
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const createTask = async (taskData) => {
    try {
      await api.post('/task', taskData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await getTasks();
      setErrors(null);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error al crear la tarea:", error);
      }
      return false;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      taskData.append('_method', 'PUT');

      await api.post(`/task/${taskId}`, taskData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await getTasks();
      setErrors(null);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error al actualizar la tarea: ", error);
      }
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await api.delete(`/task/${taskId}`);
        await getTasks();
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    }
  };

  const createBackup = async () => {
    try {
      const response = await api.get('/backup/create', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = 'backup-tasks-' + new Date().toISOString().slice(0, 10) + '.xml';
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Failed to create backup", error);
    }
  };

  const restoreBackup = async (file) => {
    const formData = new FormData();
    formData.append('backup_file', file);
    
    try {
      await api.post('/backup/restore', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await getTasks();
      return true;
    } catch (error) {
      console.error("Failed to restore backup", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, errors, clearErrors, login, register, logout, tasks, getTasks, createTask, updateTask, deleteTask, createBackup, restoreBackup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
