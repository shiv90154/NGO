import React from 'react';
import { useNavigate } from 'react-router-dom';

const HealthcareDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 to-pink-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🩺 Healthcare Dashboard</h1>
          <button
            onClick={() => navigate('/services')}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg"
          >
            Back to Services
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.fullName || 'Patient'}!</h2>
          <p className="mb-4">Find doctors, book appointments, access health records, and AI diagnostics.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">👨‍⚕️ Find Doctors</h3>
              <p className="text-sm text-gray-300">Search by specialization</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">📅 My Appointments</h3>
              <p className="text-sm text-gray-300">View and manage bookings</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">🤖 AI Symptom Checker</h3>
              <p className="text-sm text-gray-300">Preliminary health analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;