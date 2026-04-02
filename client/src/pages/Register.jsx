import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";

// Reusable input component with icon option
const Input = ({ label, name, type = "text", placeholder, value, onChange, onBlur, required = false, error, icon, ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-white/80 mb-1">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-white/50 text-sm">{icon}</span>
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
        } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition ${
          icon ? "pl-8" : ""
        }`}
        required={required}
        {...props}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1 transition-all">{error}</p>}
  </div>
);

// Radio group component for gender
const RadioGroup = ({ label, name, options, value, onChange, error }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>}
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-white/80">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

// Checkbox group for modules
const CheckboxGroup = ({ label, name, options, selectedValues, onChange, error }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-white/80">
          <input
            type="checkbox"
            value={opt.value}
            checked={selectedValues.includes(opt.value)}
            onChange={(e) => {
              const newValues = e.target.checked
                ? [...selectedValues, opt.value]
                : selectedValues.filter((v) => v !== opt.value);
              onChange({ target: { name, value: newValues } });
            }}
            className="text-orange-500 focus:ring-orange-500 rounded"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

// Enhanced file input with custom button and validation
const FileInput = ({ label, name, onChange, error, accept = "image/*", maxSize = 5 * 1024 * 1024 }) => {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Client-side validation
      if (!file.type.startsWith("image/")) {
        setFileError("Only image files are allowed");
        setFileName("");
        onChange({ target: { name, value: null } });
        return;
      }
      if (file.size > maxSize) {
        setFileError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        setFileName("");
        onChange({ target: { name, value: null } });
        return;
      }
      setFileError("");
      setFileName(file.name);
      onChange({ target: { name, value: file } });
    } else {
      setFileName("");
      setFileError("");
      onChange({ target: { name, value: null } });
    }
    // Reset input value so the same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClear = () => {
    setFileName("");
    setFileError("");
    onChange({ target: { name, value: null } });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
          Choose File
          <input
            type="file"
            name={name}
            ref={inputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
        </label>
        {fileName && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/70 truncate max-w-[200px]">{fileName}</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {(fileError || error) && <p className="text-red-400 text-xs mt-1">{fileError || error}</p>}
    </div>
  );
};

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    aadhaarNumber: "",
    panNumber: "",
    state: "",
    district: "",
    block: "",
    village: "",
    pincode: "",
    fullAddress: "",
    modules: []
  });

  const [files, setFiles] = useState({
    profileImage: null,
    aadhaarImage: null,
    panImage: null
  });

  const VALID_ROLES = [
    'SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_MANAGER',
    'BLOCK_OFFICER', 'VILLAGE_OFFICER', 'DOCTOR', 'TEACHER', 'AGENT', 'USER'
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return !value ? "Full name is required" : "";
      case "email":
        if (!value) return "Email is required";
        return !/^\S+@\S+\.\S+$/.test(value) ? "Invalid email address" : "";
      case "phone":
        if (!value) return "Phone number is required";
        return !/^\d{10}$/.test(value) ? "Phone must be 10 digits" : "";
      case "password":
        if (!value) return "Password is required";
        return value.length < 6 ? "Password must be at least 6 characters" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleFile = (e) => {
    const { name, value } = e.target;
    setFiles(prev => ({ ...prev, [name]: value }));
    // Clear any previous file-related error (if we had any)
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleModulesChange = (e) => {
    setForm(prev => ({ ...prev, modules: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Validate all required fields
    const requiredFields = ["fullName", "email", "phone", "password"];
    const newErrors = {};
    requiredFields.forEach(field => {
      const errorMsg = validateField(field, form[field]);
      if (errorMsg) newErrors[field] = errorMsg;
    });
    // Also ensure no file errors (optional)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all required fields as touched
      const newTouched = {};
      requiredFields.forEach(field => { newTouched[field] = true; });
      setTouched(prev => ({ ...prev, ...newTouched }));
      setServerError("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // Append all form fields
      Object.keys(form).forEach(key => {
        const val = form[key];
        if (key === "modules") {
          form.modules.forEach(m => data.append("modules", m));
        } else if (key === "gender" && val === "") {
          // skip empty gender
          return;
        } else if (key !== "role") {
          data.append(key, val);
        }
      });

      // Append files
      Object.keys(files).forEach(key => {
        if (files[key]) data.append(key, files[key]);
      });

      let mappedRole = role?.toUpperCase() || "USER";
      if (!VALID_ROLES.includes(mappedRole)) {
        mappedRole = "USER";
      }
      data.append("role", mappedRole);

      const response = await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Backend now returns { success: true, message, email } or similar
      if (response.data.success) {
        navigate("/verify-otp", { state: { email: form.email } });
      } else {
        setServerError(response.data.message || "Registration failed.");
      }
    } catch (err) {
      // Handle error from backend
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" }
  ];

  const moduleOptions = [
    { value: "EDUCATION", label: "Education" },
    { value: "AGRICULTURE", label: "Agriculture" },
    { value: "FINANCE", label: "Finance" },
    { value: "HEALTHCARE", label: "Healthcare" },
    { value: "NEWS", label: "News" },
    { value: "IT", label: "IT" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/logo.jpg" alt="Logo" className="w-16 h-16 mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Registration` : "User Registration"}
            </h2>
            <p className="text-white/60 mt-2">Create your account to get started</p>
          </div>

          {/* Server error message */}
          {serverError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-6 text-center">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Personal Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4">
                Personal Details
              </h3>
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.fullName ? errors.fullName : undefined}
                icon="👤"
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.email ? errors.email : undefined}
                icon="📧"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.phone ? errors.phone : undefined}
                icon="📞"
              />
              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={touched.password ? errors.password : undefined}
                  icon="🔒"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[42px] text-white/50 hover:text-white/80"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Father's Name"
                  name="fatherName"
                  placeholder="Father's name"
                  value={form.fatherName}
                  onChange={handleChange}
                />
                <Input
                  label="Mother's Name"
                  name="motherName"
                  placeholder="Mother's name"
                  value={form.motherName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                />
                <RadioGroup
                  label="Gender"
                  name="gender"
                  options={genderOptions}
                  value={form.gender}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address & Documents */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4">
                Address Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="State"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                />
                <Input
                  label="District"
                  name="district"
                  placeholder="District"
                  value={form.district}
                  onChange={handleChange}
                />
                <Input
                  label="Block"
                  name="block"
                  placeholder="Block"
                  value={form.block}
                  onChange={handleChange}
                />
                <Input
                  label="Village / City"
                  name="village"
                  placeholder="Village or city"
                  value={form.village}
                  onChange={handleChange}
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  placeholder="Postal code"
                  value={form.pincode}
                  onChange={handleChange}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Full Address"
                    name="fullAddress"
                    placeholder="House number, street, landmark"
                    value={form.fullAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4 mt-6">
                Identity Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Aadhaar Number"
                  name="aadhaarNumber"
                  placeholder="12-digit Aadhaar"
                  value={form.aadhaarNumber}
                  onChange={handleChange}
                />
                <Input
                  label="PAN Number"
                  name="panNumber"
                  placeholder="PAN (e.g., ABCDE1234F)"
                  value={form.panNumber}
                  onChange={handleChange}
                />
              </div>

              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4 mt-6">
                Upload Documents
              </h3>
              <div className="space-y-3">
                <FileInput
                  label="Profile Photo"
                  name="profileImage"
                  onChange={handleFile}
                  error={errors.profileImage}
                />
                <FileInput
                  label="Aadhaar Image"
                  name="aadhaarImage"
                  onChange={handleFile}
                  error={errors.aadhaarImage}
                />
                <FileInput
                  label="PAN Image"
                  name="panImage"
                  onChange={handleFile}
                  error={errors.panImage}
                />
              </div>

              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4 mt-6">
                Interests
              </h3>
              <CheckboxGroup
                label="Select your areas of interest"
                name="modules"
                options={moduleOptions}
                selectedValues={form.modules}
                onChange={handleModulesChange}
              />
              {form.modules.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.modules.map((mod) => {
                    const label = moduleOptions.find((opt) => opt.value === mod)?.label || mod;
                    return (
                      <span
                        key={mod}
                        className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md text-xs"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          {/* Already have an account? – Role-aware link */}
          <p className="text-center text-white/60 text-sm mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate(`/login/${role || "user"}`)}
              className="text-orange-400 hover:text-orange-300 font-medium transition"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}