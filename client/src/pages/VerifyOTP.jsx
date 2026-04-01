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

  // Auto‑focus OTP input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Redirect if no email (e.g., direct access)
  useEffect(() => {
    if (!email) {
      navigate("/login/user");
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/auth/verify-otp", { email, otp });
      navigate("/login/user");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");
    setError("");
    try {
      await api.post("/auth/resend-otp", { email });
      setResendMessage("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.jpg" alt="Logo" className="w-14 h-14 mb-3" />
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Verify OTP
          </h2>
          <p className="text-sm text-white/60 mt-1 text-center">
            We've sent a 6-digit code to <span className="text-orange-400">{email}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-6 text-center text-sm animate-pulse">
            {error}
          </div>
        )}

        {/* Success Message for Resend */}
        {resendMessage && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-300 p-3 rounded-lg mb-6 text-center text-sm">
            {resendMessage}
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition"
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend Option */}
        <div className="mt-6 text-center text-sm text-white/60">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-orange-400 hover:text-orange-300 font-medium transition disabled:opacity-50"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        {/* Back to Login */}
        <div className="mt-4 text-center text-sm text-white/60">
          <button
            onClick={() => navigate("/login/user")}
            className="text-white/70 hover:text-white transition"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}