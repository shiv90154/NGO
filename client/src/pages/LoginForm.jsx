import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
    captchaInput: "",
  });
  const [errors, setErrors] = useState({});

  // Generate random captcha
  const generateCaptcha = useCallback(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);

  // Initialize captcha on mount
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, [generateCaptcha]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setForm(prev => ({ ...prev, captchaInput: "" }));
    setErrors(prev => ({ ...prev, captchaInput: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (generalError) setGeneralError("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    if (!form.captchaInput) {
      newErrors.captchaInput = "Captcha is required";
    } else if (form.captchaInput.toUpperCase() !== captcha) {
      newErrors.captchaInput = "Invalid captcha";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login API call
  const loginUser = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, { 
        username, 
        password 
      });
      
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Set default axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed. Please try again." 
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const res = await loginUser(form.username, form.password);
      
      if (!res.success) {
        setGeneralError(res.error);
        refreshCaptcha();
        return;
      }
      
      // Redirect based on user role
      if (res.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/services");
      }
    } catch (err) {
      setGeneralError("Something went wrong. Please try again.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "candidate", label: "Candidate" },
    { id: "admin", label: "Admin" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to your account
          </p>
        </div>

        {/* General Error */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {generalError}
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-amber-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 pr-11 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-700 transition"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Captcha Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Captcha <span className="text-red-500">*</span>
            </label>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2.5 rounded-lg text-center">
                <span className="text-lg font-mono font-bold tracking-wider text-amber-800">
                  {captcha}
                </span>
              </div>
              
              <button
                type="button"
                onClick={refreshCaptcha}
                className="p-2.5 text-gray-600 hover:text-amber-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
                title="Refresh captcha"
              >
                <FaSyncAlt size={18} />
              </button>
            </div>

            <input
              type="text"
              name="captchaInput"
              placeholder="Enter the code above"
              value={form.captchaInput}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition ${
                errors.captchaInput ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.captchaInput && (
              <p className="text-red-500 text-xs mt-1">{errors.captchaInput}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-amber-700 hover:text-amber-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-2.5 rounded-lg font-medium hover:from-amber-800 hover:to-amber-900 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-700 font-medium hover:text-amber-800 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;