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
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }
        const res = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Auth load error:", err);
        localStorage.clear();
        setUser(null);
      }

      setLoading(false);
    };
    verifyUser();
  }, []);
  // ======================
  // REGISTER
  // ======================
  const register = async (formData, role) => {
    try {
      const res = await api.post("/auth/register", {
        ...formData,
        role: role?.toUpperCase() || "user",
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
    };
  };

  // ======================
  // LOGIN
  // ======================
  const login = async (email, password, role) => {
    try {
      const res = await api.post("/users/login", {
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
    setUser,
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