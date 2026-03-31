import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    fatherName: "",
    motherName: "",
    state: "",
    district: "",
    village: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        ...form,
        role: role?.toUpperCase()
      });

      navigate("/verify-otp", { state: { email: form.email } });

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-3xl">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          {role} Register
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" onChange={handleChange} className="input" />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} className="input" />

          <input name="fatherName" placeholder="Father Name" onChange={handleChange} className="input" />
          <input name="motherName" placeholder="Mother Name" onChange={handleChange} className="input" />

          <input name="state" placeholder="State" onChange={handleChange} className="input" />
          <input name="district" placeholder="District" onChange={handleChange} className="input" />
          <input name="village" placeholder="Village" onChange={handleChange} className="input md:col-span-2" />
        </div>

        <button className="mt-6 w-full bg-black text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}