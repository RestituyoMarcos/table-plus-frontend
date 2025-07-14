import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [errors, setErrors] = useState(null);

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

  return (
    <AuthContext.Provider value={{ user, token, errors, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
