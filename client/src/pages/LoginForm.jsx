import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";

// Reusable input component (optional, but keeps consistency)
const Input = ({ type, placeholder, value, onChange, error, showToggle, toggleShow, showPassword }) => (
  <div className="mb-4">
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
          error ? "border-red-500" : "border-white/20"
        } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition`}
      />
      {showToggle && (
        <span
          onClick={toggleShow}
          className="absolute right-3 top-2 cursor-pointer text-sm text-white/70 hover:text-white"
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      )}
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default function LoginForm() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({});

  // Simple validation
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const newErrors = {};
    ["email", "password"].forEach((field) => {
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setTouched(newErrors);
      setError("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: role?.toUpperCase(), // send role if present
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.jpg" alt="Logo" className="w-14 h-14 mb-3" />
          <h2 className="text-2xl font-bold tracking-wide">
            {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login` : "User Login"}
          </h2>
          <p className="text-sm text-white/70 mt-1">Welcome back 👋</p>
        </div>

        {/* Global Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email}
          />

          {/* Password Field with Show/Hide */}
          <Input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password}
            showToggle
            toggleShow={() => setShowPass(!showPass)}
            showPassword={showPass}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Extra Links */}
          <div className="mt-6 text-center text-sm text-white/70">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate(`/register/${role || "user"}`)}
              className="text-orange-400 hover:text-orange-300 font-medium transition"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}