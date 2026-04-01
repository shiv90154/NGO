import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";

// 🔹 Reusable Input
const Input = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  showToggle,
  toggleShow,
  showPassword,
  icon,
}) => (
  <div className="mb-4">
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-2.5 text-white/50 text-sm">
          {icon}
        </div>
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
          error ? "border-red-500" : "border-white/20"
        } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          icon ? "pl-8" : ""
        } ${showToggle ? "pr-16" : ""}`}
      />

      {showToggle && (
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-2 text-white/70 text-sm"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
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

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});

  // 🔹 Validation
  const validate = () => {
    let errors = {};

    if (!form.email) errors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Invalid email";

    if (!form.password) errors.password = "Password required";

    setFieldError(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: role?.toUpperCase(),
      });

      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 MODULE BASED REDIRECT
      if (user.modules?.includes("EDUCATION")) {
        navigate("/education/dashboard");
      } else if (user.modules?.includes("AGRICULTURE")) {
        navigate("/agriculture/dashboard");
      } else if (user.modules?.includes("FINANCE")) {
        navigate("/finance/dashboard");
      } else if (user.modules?.includes("HEALTHCARE")) {
        navigate("/healthcare/dashboard");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] p-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="w-14 mb-2" />
          <h2 className="text-xl font-bold">
            {role ? role.toUpperCase() : "USER"} Login
          </h2>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <Input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            error={fieldError.email}
            icon="📧"
          />

          {/* PASSWORD */}
          <Input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            error={fieldError.password}
            showToggle
            toggleShow={() => setShowPass(!showPass)}
            showPassword={showPass}
            icon="🔒"
          />

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-2 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate(`/register/${role || "user"}`)}
            className="text-orange-400 cursor-pointer"
          >
            Register
          </span>
        </div>

      </div>
    </div>
  );
}