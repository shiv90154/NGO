import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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
      console.log(err.response);
      setGeneralError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center bg-gray-50">
      {/* Floating soft background glow */}

      {/* CARD - Glassmorphism */}
      <div className="relative w-full max-w-sm bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6">

        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-2xl">🔐</span>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">Login to continue your journey</p>
        </div>

        {/* General Error */}
        {generalError && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2.5 rounded-lg">
            {generalError}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Email */}
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <div className="relative mt-1">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error.email) setError({ ...error, email: "" });
                }}
                className={`w-full p-3 rounded-lg border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition pl-10 ${error.email ? "border-red-400" : "border-gray-200"
                  }`}
              />
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>
            {error.email && <p className="text-xs text-red-500 mt-1">{error.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-500">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error.password) setError({ ...error, password: "" });
                }}
                className={`w-full p-3 rounded-lg border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition pl-10 pr-10 ${error.password ? "border-red-400" : "border-gray-200"
                  }`}
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            {error.password && <p className="text-xs text-red-500 mt-1">{error.password}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-[1.01] transition disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-5 text-sm">
          <Link to="/register" className="text-indigo-600 hover:underline">
            Create new account
          </Link>

          <div className="mt-2">
            <Link to="/forgot-password" className="text-gray-500 text-xs hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-2">
            <Link to="/" className="text-gray-500 text-xs hover:underline">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Login;