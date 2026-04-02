import React from 'react';
import { useNavigate } from 'react-router-dom';

const EducationDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📚 Education Dashboard</h1>
          <button
            onClick={() => navigate('/services')}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg"
          >
            Back to Services
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.fullName || 'Student'}!</h2>
          <p className="mb-4">Here you can access your courses, live classes, test series, and certificates.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">📖 My Courses</h3>
              <p className="text-sm text-gray-300">View enrolled courses and progress</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">🎥 Live Classes</h3>
              <p className="text-sm text-gray-300">Join upcoming live sessions</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold">📝 Test Series</h3>
              <p className="text-sm text-gray-300">Practice tests and results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDashboard;