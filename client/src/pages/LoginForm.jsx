import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  const validate = () => {
    let err = {};
    if (!email) err.email = "Email is required";
    if (!password) err.password = "Password is required";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      }));

      navigate('/dashboard');

    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Welcome <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Back</span>
          </h1>
          <p className="text-gray-500 text-lg">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            User Login
          </h2>

          {/* General Error */}
          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                <FaEnvelope className="inline mr-2 text-blue-500" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error.email) setError({ ...error, email: '' });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pl-11 ${error.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="you@example.com"
                />
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                <FaLock className="inline mr-2 text-blue-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error.password) setError({ ...error, password: '' });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pl-11 pr-11 ${error.password ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Enter your password"
                />
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 transition">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 shadow-md"
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:text-blue-600 font-medium underline transition">
              Create Account
            </a>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a href="/" className="text-gray-400 hover:text-gray-500 text-sm flex items-center justify-center gap-2 transition">
              <FaArrowLeft /> Back to Home
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2026 Government Portal. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;