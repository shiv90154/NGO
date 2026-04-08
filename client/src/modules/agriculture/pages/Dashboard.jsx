import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Search, Leaf, ShoppingBag, Package, User, Microscope, Handshake } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AgricultureDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeCrops: 0,
    productsListed: 0,
    ordersReceived: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/agriculture/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const data = response.data.data;
        setStats({
          activeCrops: data.farmingStats?.activeCrops || 0,
          productsListed: data.farmingStats?.activeListings || 0,
          ordersReceived: data.farmingStats?.totalOrdersReceived || 0,
          totalRevenue: data.farmingStats?.totalRevenue || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: "/agriculture/crops", icon: Sprout, title: "Crop Management", description: "Track your crops and get advice", color: "text-green-600" },
    { path: "/agriculture/disease-detection", icon: Microscope, title: "AI Disease Detection", description: "Upload leaf images for diagnosis", color: "text-red-600" },
    { path: "/agriculture/contract-farming", icon: Handshake, title: "Contract Farming", description: "Connect with buyers", color: "text-blue-600" },
    { path: "/agriculture/products", icon: ShoppingBag, title: "Sell Products", description: "List your products for sale", color: "text-orange-600" },
    { path: "/agriculture/orders", icon: Package, title: "Orders", description: "Manage your orders", color: "text-purple-600" },
    { path: "/agriculture/profile", icon: User, title: "My Profile", description: "View and edit profile", color: "text-gray-600" }
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] flex items-center gap-2">
                🌾 Agriculture Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back, {user?.fullName || user?.name || 'Farmer'}!
              </p>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="bg-[#ff8c42] hover:bg-[#e67e22] text-white px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm"
            >
              ← Back to Services
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🌱</span>
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <div className="text-2xl font-bold text-[#1e3a5f]">{stats.activeCrops}</div>
            <div className="text-sm text-gray-500">Active Crops</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🛍️</span>
              <span className="text-xs text-gray-400">Listed</span>
            </div>
            <div className="text-2xl font-bold text-[#1e3a5f]">{stats.productsListed}</div>
            <div className="text-sm text-gray-500">Products Listed</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📦</span>
              <span className="text-xs text-gray-400">Received</span>
            </div>
            <div className="text-2xl font-bold text-[#1e3a5f]">{stats.ordersReceived}</div>
            <div className="text-sm text-gray-500">Orders Received</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💰</span>
              <span className="text-xs text-gray-400">Revenue</span>
            </div>
            <div className="text-2xl font-bold text-[#1e3a5f]">₹{stats.totalRevenue}</div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </div>
        </div>

        {/* MENU GRID */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">Quick Access</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link to={item.path} key={index} className="block">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`mb-3 ${item.color}`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e3a5f]">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="mt-4 text-sm text-[#ff8c42] flex items-center gap-1">
                    Access Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY / TIPS SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <Package size={20} className="text-[#ff8c42]" />
              Recent Orders
            </h3>
            <div className="space-y-3">
              <p className="text-gray-500 text-sm text-center py-4">No recent orders</p>
            </div>
            <button
              onClick={() => navigate('/agriculture/orders')}
              className="mt-4 w-full py-2 rounded-md bg-[#1e3a5f] text-white hover:bg-[#162d48] active:scale-95 transition"
            >
              View All Orders
            </button>
          </div>

          {/* Farming Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <Sprout size={20} className="text-[#ff8c42]" />
              Farming Tips
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm text-gray-600">
                <span className="text-[#ff8c42]">💡</span>
                <p>Check soil moisture regularly for better crop health</p>
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <span className="text-[#ff8c42]">💡</span>
                <p>Rotate crops to maintain soil fertility</p>
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <span className="text-[#ff8c42]">💡</span>
                <p>Use organic fertilizers for sustainable farming</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/agriculture/crops')}
              className="mt-4 w-full py-2 rounded-md border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white active:scale-95 transition"
            >
              View Crop Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgricultureDashboard;