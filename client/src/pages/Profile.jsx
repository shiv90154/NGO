import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../config/api"; // 🔥 FIXED

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await api.put("/auth/profile", form);

      const updatedUser = res.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setEdit(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ fullName: user?.fullName });
    setEdit(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

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

      {/* CARD */}
      <div className="bg-white shadow-lg rounded-lg p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FULL NAME */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            {edit ? (
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="font-medium">{user?.fullName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="font-medium text-gray-700">
              {user?.role} 🔒
            </p>
          </div>

        </div>

        {/* PERMISSIONS (SAFE) */}
        {user?.permissions?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Permissions</h2>

            <div className="flex flex-wrap gap-2">
              {user.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SAVE */}
        {edit && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-green-500 hover:bg-green-600"
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