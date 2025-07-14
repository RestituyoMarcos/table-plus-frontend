import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [errors, setErrors] = useState(null);
  const [tasks, setTasks] = useState([]);

  const login = async (email, password) => {
    try {
        
      const response = await api.post("/login", { email, password });
      const { user, access_token } = response.data;

      setUser(user);
      setToken(access_token);
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
        localStorage.removeItem('token');
    });
  };

  const getTasks = async (filters = {}) => {
    try {
      const response = await api.get('/mytasks', { params: filters });
      setTasks(response.data.data); 
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const createTask = async (taskData) => {
    try {
      await api.post('/task', taskData);
      await getTasks();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const formData = new FormData();
      Object.keys(taskData).forEach(key => formData.append(key, taskData[key]));
      formData.append('_method', 'PUT');

      await api.post(`/task/${taskId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await getTasks();
    } catch (error) {
      console.error("Failed to update task", error);
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

  return (
    <AuthContext.Provider value={{ user, token, errors, login, register, logout, tasks, getTasks, createTask, updateTask, deleteTask }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
