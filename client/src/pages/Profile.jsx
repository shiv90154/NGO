import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await api.put("/auth/profile", form);

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      setEdit(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name });
    setEdit(false);
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* 🔙 Header */}
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
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-1 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* 📦 Card */}
      <div className="bg-white shadow-lg rounded-lg p-6">

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500">Name</label>
            {edit ? (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="font-medium">{user?.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>

          {/* Role (LOCKED) */}
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="font-medium text-gray-700">
              {user?.role} 🔒
            </p>
          </div>

        </div>

        {/* Permissions */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Permissions</h2>

          <div className="flex flex-wrap gap-2">
            {user?.permissions?.map((perm) => (
              <span
                key={perm}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {edit && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
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