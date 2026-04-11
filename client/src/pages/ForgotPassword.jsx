import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const api = import.meta.env.VITE_API_URL
// ─── Step indicators shown in the left panel ───────────────────────────────
const STEPS = [
    { label: "Verify email" },
    { label: "Enter OTP" },
    { label: "New password" },
];

const ForgotPassword = () => {
    const navigate = useNavigate();

    // ── Global state ────────────────────────────────────────────────────────
    const [step, setStep] = useState(1); // 1 | 2 | 3
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    // ── Step 1 – Email ───────────────────────────────────────────────────────
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // ── Step 2 – OTP ────────────────────────────────────────────────────────
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [resendTimer, setResendTimer] = useState(0);
    const otpRefs = useRef([]);

    // ── Step 3 – New password ────────────────────────────────────────────────
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});

    // ── Countdown timer for OTP resend ──────────────────────────────────────
    useEffect(() => {
        if (resendTimer <= 0) return;
        const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
        return () => clearInterval(id);
    }, [resendTimer]);

    const formatTimer = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    // ════════════════════════════════════════════════════════════════════════
    // Step 1 — Send OTP
    // ════════════════════════════════════════════════════════════════════════
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setGeneralError("");
        setEmailError("");

        if (!email) return setEmailError("Email is required");
        if (!/\S+@\S+\.\S+/.test(email)) return setEmailError("Enter a valid email address");

        setLoading(true);
        try {
            await axios.post(`${api}/users/forgot-password`, { email });
            setResendTimer(150); // 2 min 30 sec
            setStep(2);
        } catch (err) {
            setGeneralError(err.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    // Step 2 — OTP input helpers
    // ════════════════════════════════════════════════════════════════════════
    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // digits only
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        setOtpError("");
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            otpRefs.current[5]?.focus();
        }
        e.preventDefault();
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setGeneralError("");
        const code = otp.join("");
        if (code.length < 6) return setOtpError("Please enter all 6 digits");

        setLoading(true);
        try {
            await axios.post(`${api}/users/verify-reset-otp`, { email, otp: code });
            setStep(3);
        } catch (err) {
            setOtpError(err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setGeneralError("");
        setOtpError("");
        setLoading(true);
        try {
            await axios.post(`${api}/users/forgot-password`, { email });
            setOtp(["", "", "", "", "", ""]);
            setResendTimer(150);
            otpRefs.current[0]?.focus();
        } catch (err) {
            setGeneralError(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    // Step 3 — Reset Password
    // ════════════════════════════════════════════════════════════════════════
    const validatePasswords = () => {
        const errs = {};
        if (!password) errs.password = "Password is required";
        else if (password.length < 6) errs.password = "Password must be at least 6 characters";
        if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
        else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
        setPasswordErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setGeneralError("");
        if (!validatePasswords()) return;

        setLoading(true);
        try {
            await axios.post(`${api}/users/reset-password`, {
                email,
                otp: otp.join(""),
                newPassword: password,
            });
            setStep(4); // success screen
        } catch (err) {
            setGeneralError(err.response?.data?.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    // Left panel
    // ════════════════════════════════════════════════════════════════════════
    const LeftPanel = () => (
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 p-8 text-white flex flex-col justify-between">
            <div>
                {/* Branding */}
                <div className="flex items-center gap-3 mb-8">
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

                <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-8">
                    Securely recover your account in 3 easy steps.
                </p>

                {/* Step list */}
                <div className="space-y-4">
                    {STEPS.map((s, i) => {
                        const num = i + 1;
                        const done = step > num;
                        const current = step === num;
                        return (
                            <div
                                key={num}
                                className={`flex items-center gap-3 text-sm transition-opacity ${current ? "opacity-100" : done ? "opacity-80" : "opacity-40"
                                    }`}
                            >
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${done
                                        ? "bg-green-400 text-white"
                                        : current
                                            ? "bg-white text-blue-900"
                                            : "bg-white/20 text-white"
                                        }`}
                                >
                                    {done ? "✓" : num}
                                </div>
                                <span>{s.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="border-l-4 border-orange-400 pl-4 mt-10">
                    <p className="text-sm italic text-blue-200">
                        "Sabka Saath, Sabka Vikas, Sabka Vishwas"
                    </p>
                </div>
            </div>

            <div className="text-xs text-blue-300">
                <p>Secure &amp; encrypted process</p>
                <p>© Samraddh Bharat Foundation</p>
            </div>
        </div>
    );

    // ════════════════════════════════════════════════════════════════════════
    // Right panel header (shared)
    // ════════════════════════════════════════════════════════════════════════
    const RightHeader = ({ title, subtitle }) => (
        <>
            {/* Tricolor bar */}
            <div className="flex mb-6">
                <div className="h-1 w-1/3 bg-[#FF9933] rounded-l"></div>
                <div className="h-1 w-1/3 bg-white"></div>
                <div className="h-1 w-1/3 bg-[#138808] rounded-r"></div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mb-5">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${step > i + 1
                            ? "bg-green-500"
                            : step === i + 1
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>

            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                Step {step} of 3
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{title}</h3>
            <p className="text-gray-500 text-sm mb-6">{subtitle}</p>
        </>
    );

    // ════════════════════════════════════════════════════════════════════════
    // Render
    // ════════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                <LeftPanel />

                {/* ── Right Panel ──────────────────────────────────────────────── */}
                <div className="md:w-1/2 p-8 bg-white">
                    <div className="max-w-sm mx-auto">

                        {/* ── Success screen ─────────────────────────────────────── */}
                        {step === 4 && (
                            <div className="flex flex-col items-center text-center py-8">
                                <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Password Reset!</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Your password has been updated successfully. You can now sign in with your new credentials.
                                </p>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md"
                                >
                                    Go to Login
                                </button>
                            </div>
                        )}

                        {/* ── Step 1 – Email ─────────────────────────────────────── */}
                        {step === 1 && (
                            <>
                                <RightHeader
                                    title="Forgot Password?"
                                    subtitle="Enter your registered email and we'll send a verification code"
                                />

                                {generalError && (
                                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                                        {generalError}
                                    </div>
                                )}

                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Registered Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                                                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${emailError ? "border-red-400" : "border-gray-300"
                                                    }`}
                                            />
                                            <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Sending OTP...</span>
                                            </div>
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 flex justify-between text-xs text-gray-500">
                                    <Link to="/login" className="hover:text-blue-600 flex items-center gap-1">
                                        <FaArrowLeft className="text-[10px]" /> Back to Login
                                    </Link>
                                    <Link to="/register" className="hover:text-blue-600">New user? Register</Link>
                                </div>
                            </>
                        )}

                        {/* ── Step 2 – OTP ───────────────────────────────────────── */}
                        {step === 2 && (
                            <>
                                <RightHeader
                                    title="Verify your email"
                                    subtitle={
                                        <>
                                            A 6-digit OTP was sent to{" "}
                                            <span className="font-semibold text-gray-700">{email}</span>
                                        </>
                                    }
                                />

                                {(generalError || otpError) && (
                                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                                        {generalError || otpError}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            One-Time Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2" onPaste={handleOtpPaste}>
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => (otpRefs.current[i] = el)}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                    className={`w-full aspect-square text-center text-lg font-bold rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${otpError ? "border-red-400" : "border-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resend timer */}
                                    <p className="text-xs text-gray-500">
                                        {resendTimer > 0 ? (
                                            <>
                                                Resend OTP in{" "}
                                                <span className="font-semibold text-gray-700">{formatTimer(resendTimer)}</span>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                className="text-blue-700 hover:text-blue-800 font-medium"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.join("").length < 6}
                                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Verifying...</span>
                                            </div>
                                        ) : (
                                            "Verify OTP"
                                        )}
                                    </button>
                                </form>

                                <p className="mt-5 text-xs text-center text-gray-500">
                                    Wrong email?{" "}
                                    <button
                                        onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setGeneralError(""); }}
                                        className="text-blue-700 hover:text-blue-800 font-medium"
                                    >
                                        Go back
                                    </button>
                                </p>
                            </>
                        )}

                        {/* ── Step 3 – New Password ──────────────────────────────── */}
                        {step === 3 && (
                            <>
                                <RightHeader
                                    title="Set new password"
                                    subtitle="Choose a strong password (min. 6 characters)"
                                />

                                {generalError && (
                                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                                        {generalError}
                                    </div>
                                )}

                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    {/* New password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setPasswordErrors((p) => ({ ...p, password: "" })); }}
                                                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${passwordErrors.password ? "border-red-400" : "border-gray-300"
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
                                        {passwordErrors.password && (
                                            <p className="text-xs text-red-500 mt-1">{passwordErrors.password}</p>
                                        )}
                                    </div>

                                    {/* Confirm password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors((p) => ({ ...p, confirmPassword: "" })); }}
                                                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${passwordErrors.confirmPassword ? "border-red-400" : "border-gray-300"
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {passwordErrors.confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Resetting...</span>
                                            </div>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Footer */}
                        {step !== 4 && (
                            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                                <p>This is a secure government system. Unauthorized access is prohibited.</p>
                                <p className="mt-1">Samraddh Bharat Foundation | Digital India Initiative</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;