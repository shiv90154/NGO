import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";

export default function LoginForm() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        ...form,
        role: role?.toUpperCase()
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">

        <h2 className="text-xl font-bold text-center mb-4">
          {role} Login
        </h2>

        <input
          placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}
          className="input mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})}
          className="input mb-4"
        />

        <button onClick={handleLogin} className="w-full bg-black text-white py-2 rounded">
          Login
        </button>

      </div>
    </div>
  );
}