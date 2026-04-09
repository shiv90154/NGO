import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    let err = {};
    if (!email) err.email = "Email is required";
    if (!password) err.password = "Password is required";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setGeneralError(res.error);
        return;
      }
      navigate("/services");
    } catch (err) {
      setGeneralError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel - Government Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              {/* Ashoka Chakra Emblem (Simplified) */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-blue-900 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-900"></div>
                </div>
              </div>
              <div>
                <p className="text-xs opacity-80">Government of India</p>
                <p className="font-bold text-lg">Samraddh Bharat</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Access your digital services – Education, Healthcare, Agriculture, Finance, and more.
            </p>
            
            <div className="border-l-4 border-saffron-500 pl-4 mt-8">
              <p className="text-sm italic text-blue-200">
                "Sabka Saath, Sabka Vikas, Sabka Vishwas"
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-blue-300">
            <p>Secure & encrypted login</p>
            <p>© Samraddh Bharat Foundation</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="md:w-1/2 p-8 bg-white">
          <div className="max-w-sm mx-auto">
            {/* Tricolor header line */}
            <div className="flex mb-6">
              <div className="h-1 w-1/3 bg-[#FF9933] rounded-l"></div>
              <div className="h-1 w-1/3 bg-white"></div>
              <div className="h-1 w-1/3 bg-[#138808] rounded-r"></div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h3>
            <p className="text-gray-500 text-sm mb-6">Enter your credentials to access your dashboard</p>

            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error.email) setError({ ...error, email: "" });
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      error.email ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {error.email && <p className="text-xs text-red-500 mt-1">{error.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error.password) setError({ ...error, password: "" });
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      error.password ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {error.password && <p className="text-xs text-red-500 mt-1">{error.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Login to Dashboard"
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <Link to="/register" className="text-blue-700 hover:text-blue-800 text-sm font-medium inline-block">
                New user? Create an account
              </Link>
              <div className="flex justify-between items-center text-xs">
                <Link to="/forgot-password" className="text-gray-500 hover:text-blue-600">
                  Forgot Password?
                </Link>
                <Link to="/" className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
                  <FaArrowLeft className="text-[10px]" /> Back to Home
                </Link>
              </div>
            </div>

            {/* Official info */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
              <p>This is a secure government system. Unauthorized access is prohibited.</p>
              <p className="mt-1">Samraddh Bharat Foundation | Digital India Initiative</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;