import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../contexts/AuthContext";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const email = location.state?.email;
  const { setUser } = useAuth();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) return setError("Enter 6-digit OTP");
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/users/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");
    setError("");
    try {
      await api.post("/users/resend-otp", { email });
      setResendMessage("New OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <span className="text-3xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
            <p className="text-gray-500 text-center mt-2">
              Code sent to <span className="text-blue-600 font-medium">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {/* Success Message */}
          {resendMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-center">
              {resendMessage}
            </div>
          )}

          {/* OTP Input */}
          <input
            ref={inputRef}
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyPress={(e) => e.key === "Enter" && handleVerify()}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 shadow-md"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend OTP */}
          <div className="mt-4 text-center text-gray-500">
            Didn't receive code?{" "}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 transition"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-2 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-400 hover:text-gray-600 text-sm transition flex items-center justify-center gap-1"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2026 Samraddh Bharat Portal. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}