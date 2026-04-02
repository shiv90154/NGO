import React from 'react';
import { useNavigate } from 'react-router-dom';

const ITDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">💻 IT Services Dashboard</h1>
          <button
            onClick={() => navigate('/services')}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg"
          >
            Back to Services
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.fullName || 'User'}!</h2>
          <p className="mb-4">Client management, GST billing, project tracking, and team management.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">👥 Clients</h3>
              <p className="text-sm text-gray-300">Manage client profiles and projects</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">📄 GST Billing</h3>
              <p className="text-sm text-gray-300">Generate invoices and track payments</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">📊 Project Tracking</h3>
              <p className="text-sm text-gray-300">Monitor project progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITDashboard;