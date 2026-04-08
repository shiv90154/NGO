import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
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
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetchLoading(true);
    setError("");
    try {
      const res = await api.get("/users/profile");
      const userData = res.data.user;
      setUser(userData);
      // Populate form with user data
      setForm({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        fatherName: userData.fatherName || "",
        motherName: userData.motherName || "",
        dob: userData.dob ? userData.dob.split("T")[0] : "",
        gender: userData.gender || "",
        aadhaarNumber: userData.aadhaarNumber || "",
        panNumber: userData.panNumber || "",
        state: userData.state || "",
        district: userData.district || "",
        block: userData.block || "",
        village: userData.village || "",
        pincode: userData.pincode || "",
        fullAddress: userData.fullAddress || "",
      });
    } catch (err) {
      console.error("Fetch profile error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/ogin/uselr");
      } else {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put("/users/profile", form);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
      setEdit(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    setForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      fatherName: user?.fatherName || "",
      motherName: user?.motherName || "",
      dob: user?.dob ? user.dob.split("T")[0] : "",
      gender: user?.gender || "",
      aadhaarNumber: user?.aadhaarNumber || "",
      panNumber: user?.panNumber || "",
      state: user?.state || "",
      district: user?.district || "",
      block: user?.block || "",
      village: user?.village || "",
      pincode: user?.pincode || "",
      fullAddress: user?.fullAddress || "",
    });
    setEdit(false);
    setError("");
    setSuccess("");
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">Unable to load profile</p>
          <button
            onClick={() => navigate("/login/user")}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-500">Full Name *</label>
            {edit ? (
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="font-medium">{user.fullName}</p>
            )}
          </div>

          {/* Email (not editable) */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            {edit ? (
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            ) : (
              <p className="font-medium">{user.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="font-medium text-gray-700">{user.role}</p>
          </div>

          {/* Father's Name */}
          <div>
            <label className="text-sm text-gray-500">Father's Name</label>
            {edit ? (
              <input
                type="text"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            ) : (
              <p className="font-medium">{user.fatherName || "-"}</p>
            )}
          </div>

          {/* Mother's Name */}
          <div>
            <label className="text-sm text-gray-500">Mother's Name</label>
            {edit ? (
              <input
                type="text"
                name="motherName"
                value={form.motherName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            ) : (
              <p className="font-medium">{user.motherName || "-"}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm text-gray-500">Date of Birth</label>
            {edit ? (
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            ) : (
              <p className="font-medium">{user.dob ? new Date(user.dob).toLocaleDateString() : "-"}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-500">Gender</label>
            {edit ? (
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            ) : (
              <p className="font-medium">{user.gender || "-"}</p>
            )}
          </div>

          {/* Aadhaar */}
          <div>
            <label className="text-sm text-gray-500">Aadhaar Number</label>
            {edit ? (
              <input
                type="text"
                name="aadhaarNumber"
                value={form.aadhaarNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            ) : (
              <p className="font-medium">{user.aadhaarNumber || "-"}</p>
            )}
          </div>

          {/* PAN */}
          <div>
            <label className="text-sm text-gray-500">PAN Number</label>
            {edit ? (
              <input
                type="text"
                name="panNumber"
                value={form.panNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            ) : (
              <p className="font-medium">{user.panNumber || "-"}</p>
            )}
          </div>

          {/* Address Fields */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">State</label>
                {edit ? (
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                ) : (
                  <p>{user.state || "-"}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-500">District</label>
                {edit ? (
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                ) : (
                  <p>{user.district || "-"}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-500">Block</label>
                {edit ? (
                  <input
                    type="text"
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                ) : (
                  <p>{user.block || "-"}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-500">Village/City</label>
                {edit ? (
                  <input
                    type="text"
                    name="village"
                    value={form.village}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                ) : (
                  <p>{user.village || "-"}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-500">Pincode</label>
                {edit ? (
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                ) : (
                  <p>{user.pincode || "-"}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Full Address</label>
                {edit ? (
                  <textarea
                    name="fullAddress"
                    value={form.fullAddress}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                ) : (
                  <p>{user.fullAddress || "-"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {edit && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;