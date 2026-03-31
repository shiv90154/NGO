import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // INIT
  // ======================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Auth load error:", err);
    }
    setLoading(false);
  }, []);

  // ======================
  // REGISTER
  // ======================
  const register = async (formData, role) => {
    try {
      const res = await api.post("/auth/register", {
        ...formData,
        role: role?.toUpperCase() || "USER",
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // ======================
  // LOGIN
  // ======================
  const login = async (email, password, role) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        role: role?.toUpperCase(),
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};