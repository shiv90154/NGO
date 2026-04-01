import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../config/api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });

      alert("Verified Successfully");
      navigate("/login/user");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm text-center">

        <h2 className="text-xl font-bold mb-4">
          Verify OTP
        </h2>

        <input
          placeholder="Enter OTP"
          onChange={(e)=>setOtp(e.target.value)}
          className="input mb-4 text-center text-lg tracking-widest"
        />

        <button onClick={handleVerify} className="w-full bg-black text-white py-2 rounded">
          Verify
        </button>

      </div>
    </div>
  );
}