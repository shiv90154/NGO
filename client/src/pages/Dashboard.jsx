import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Dashboard = () => {
  const { user, token } = useAuth(); // assuming token is available for authenticated requests
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Example: fetch stats (replace with your actual API endpoint)
        const statsRes = await fetch('/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch role‑specific recent activity
        const activityRes = await fetch(`/api/dashboard/activity?role=${user.role}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!activityRes.ok) throw new Error('Failed to fetch activity');
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, token]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
            </div>
          ))}
        </div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>Error loading dashboard: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // Render stats cards from real data
  const renderStats = () => {
    if (!stats) return null;
    // Assume stats is an object like { totalUsers: 1234, revenue: 45678, activeSessions: 345, conversionRate: 23 }
    const statItems = [
      { title: 'Total Users', value: stats.totalUsers, change: stats.userChange },
      { title: 'Revenue', value: stats.revenue, change: stats.revenueChange },
      { title: 'Active Sessions', value: stats.activeSessions, change: stats.sessionsChange },
      { title: 'Conversion Rate', value: stats.conversionRate, change: stats.conversionChange },
    ];
    return statItems.map((stat, idx) => (
      <div key={idx} className="bg-white rounded-lg shadow p-6">
        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {typeof stat.value === 'number' && stat.title === 'Revenue' ? `$${stat.value.toLocaleString()}` : stat.value}
        </p>
        {stat.change && (
          <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {stat.change}
          </p>
        )}
      </div>
    ));
  };

  // Role‑specific recent activity widget (data from API)
  const renderRecentActivity = () => {
    if (!recentActivity) return null;

    // Assuming recentActivity is an object with items array based on role
    const role = user?.role;
    switch (role) {
      case 'super_admin':
        return (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">System Health</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>API Response Time</span>
                <span className="font-mono text-green-600">{recentActivity.apiResponseTime} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Connections</span>
                <span className="font-mono text-green-600">{recentActivity.dbConnections} active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Storage Used</span>
                <span className="font-mono">{recentActivity.storageUsed} GB / {recentActivity.storageLimit} GB</span>
              </div>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
            <div className="space-y-2">
              {recentActivity.users?.map((userItem, i) => (
                <p key={i} className="text-sm text-gray-600">
                  • {userItem.email} ({userItem.registeredAt})
                </p>
              ))}
            </div>
          </div>
        );
      case 'doctor':
        return (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
            <div className="space-y-2">
              {recentActivity.patients?.map((patient, i) => (
                <p key={i} className="text-sm text-gray-600">
                  • {patient.name} – {patient.reason} ({patient.date})
                </p>
              ))}
            </div>
          </div>
        );
      case 'user':
        return (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Your Recent Courses</h2>
            <div className="space-y-2">
              {recentActivity.courses?.map((course, i) => (
                <p key={i} className="text-sm text-gray-600">
                  • {course.title} ({course.progress}% complete)
                </p>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {renderStats()}
      </div>

      {/* Role Overview Widget */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Role Overview</h2>
        <p className="text-gray-600">
          You are logged in as <span className="font-medium">{user?.role}</span>. 
          {user?.role === 'super_admin' && ' You have full system access.'}
          {user?.role === 'admin' && ' You can manage users and content.'}
          {user?.role === 'doctor' && ' You have access to patient records and prescriptions.'}
          {user?.role === 'user' && ' You can view your courses and orders.'}
        </p>

        {/* Permissions List */}
        {user?.permissions && user.permissions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold mb-2">Your Permissions:</h3>
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Role-specific recent activity */}
      {renderRecentActivity()}
    </div>
  );
};

export default Dashboard;