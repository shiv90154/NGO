import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../config/api";

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

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    if (!email) navigate("/login/user");
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) return setError("Enter 6-digit OTP");
    setLoading(true);
    setError("");
    try {
      await api.post("/users/verify-otp", { email, otp });
      // ✅ Redirect to services page after successful verification
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-14 h-14 mb-3" />
          <h2 className="text-2xl font-bold text-white">Verify OTP</h2>
          <p className="text-sm text-white/60 mt-1 text-center">
            Code sent to <span className="text-orange-400">{email}</span>
          </p>
        </div>
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-6 text-center">{error}</div>}
        {resendMessage && <div className="bg-green-500/20 border border-green-500/50 text-green-300 p-3 rounded-lg mb-6 text-center">{resendMessage}</div>}
        <input
          ref={inputRef}
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          onKeyPress={(e) => e.key === "Enter" && handleVerify()}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button onClick={handleVerify} disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <div className="mt-4 text-center text-sm text-white/60">
          Didn't receive code?{" "}
          <button onClick={handleResend} disabled={resendLoading}
            className="text-orange-400 hover:text-orange-300 font-medium disabled:opacity-50">
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>
        <div className="mt-2 text-center">
          <button onClick={() => navigate("/login/user")} className="text-white/70 hover:text-white text-sm">
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}