import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";

// Reusable input component
const Input = ({ label, name, type = "text", placeholder, value, onChange, required = false, error, ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-white/80 mb-1">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
        error ? "border-red-500" : "border-white/20"
      } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition`}
      required={required}
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, name, options, value, onChange, required = false, error, multiple = false }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-white/80 mb-1">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
    )}
    <select
      name={name}
      value={multiple ? value : value || ""}
      onChange={onChange}
      multiple={multiple}
      className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
        error ? "border-red-500" : "border-white/20"
      } text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition ${
        multiple ? "h-32" : ""
      }`}
      required={required}
    >
      {!multiple && <option value="">Select</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-gray-800">
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const FileInput = ({ label, name, onChange, error }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    onChange(e);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          className={`flex-1 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition ${
            error ? "border-red-500" : ""
          }`}
        />
        {fileName && <span className="text-xs text-white/70 truncate max-w-[150px]">{fileName}</span>}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

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

  // Allowed roles from backend schema
  const VALID_ROLES = [
    'SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_MANAGER',
    'BLOCK_OFFICER', 'VILLAGE_OFFICER', 'DOCTOR', 'TEACHER', 'AGENT', 'USER'
  ];

  // Validation logic
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
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleModulesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, modules: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all required fields
    const requiredFields = ["fullName", "email", "phone", "password"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      const errorMsg = validateField(field, form[field]);
      if (errorMsg) newErrors[field] = errorMsg;
    });
    if (Object.keys(newErrors).length > 0) {
      setTouched(newErrors);
      setError("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // Append form fields (skip empty gender)
      Object.keys(form).forEach((key) => {
        const val = form[key];
        if (key === "modules") {
          form.modules.forEach((m) => data.append("modules", m));
        } else if (key === "gender" && val === "") {
          // skip empty gender
          return;
        } else if (key !== "role") {
          data.append(key, val);
        }
      });

      // Append files
      Object.keys(files).forEach((key) => {
        if (files[key]) data.append(key, files[key]);
      });

      // Role mapping: use param if it's a valid role, otherwise default to USER
      let mappedRole = role?.toUpperCase() || "USER";
      if (!VALID_ROLES.includes(mappedRole)) {
        mappedRole = "USER";
      }
      data.append("role", mappedRole);

      await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Gender options
  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" }
  ];

  // Module options
  const moduleOptions = [
    { value: "EDUCATION", label: "Education" },
    { value: "AGRICULTURE", label: "Agriculture" },
    { value: "FINANCE", label: "Finance" },
    { value: "HEALTHCARE", label: "Healthcare" },
    { value: "NEWS", label: "News" },
    { value: "IT", label: "IT" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/logo.jpg" alt="Logo" className="w-16 h-16 mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Registration` : "User Registration"}
            </h2>
            <p className="text-white/70 mt-2">Create your account to get started</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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
                error={touched.fullName}
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
                error={touched.email}
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
                error={touched.phone}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.password}
              />
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
                <Select
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
                <FileInput label="Profile Photo" name="profileImage" onChange={handleFile} />
                <FileInput label="Aadhaar Image" name="aadhaarImage" onChange={handleFile} />
                <FileInput label="PAN Image" name="panImage" onChange={handleFile} />
              </div>

              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4 mt-6">
                Interests (Select multiple)
              </h3>
              <Select
                label="Modules of Interest"
                name="modules"
                options={moduleOptions}
                value={form.modules}
                onChange={handleModulesChange}
                multiple
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
              <p className="text-white/60 text-xs mt-1">
                Hold Ctrl (Cmd on Mac) to select multiple options.
              </p>
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
          <p className="text-center text-white/70 text-sm mt-6">
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