import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

export default function TestDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login/user");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login/user");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login/user")}
            className="bg-orange-500 px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Test Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <pre className="bg-black/30 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={fetchProfile}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >
              Refresh Profile
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/services")}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
            >
              Services Page
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Token stored in localStorage. Protected API calls automatically include Bearer token.
        </div>
      </div>
    </div>
  );
}