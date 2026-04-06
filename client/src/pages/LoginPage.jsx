import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-600 p-4">
      
      {/* MAIN CARD */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex flex-col justify-center items-center p-8 relative">
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">WELCOME</h1>
          <p className="text-sm opacity-80 text-center max-w-xs">
            Your headline name here. Add some short description.
          </p>

          {/* Circle design */}
          <div className="absolute bottom-0 left-0 w-28 h-28 md:w-40 md:h-40 bg-blue-400 rounded-full opacity-40"></div>
          <div className="absolute bottom-6 left-16 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 rounded-full opacity-40"></div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">

          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center md:text-left">
            Sign in
          </h2>

          {/* USERNAME */}
          <div className="relative mb-4">
            <FaUser className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="User Name"
              className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative mb-4">
            <FaLock className="absolute top-4 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              className="absolute right-3 top-3 text-sm text-blue-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </span>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <label>
              <input type="checkbox" className="mr-1" />
              Remember me
            </label>
            <span className="text-blue-500 cursor-pointer text-xs md:text-sm">
              Forgot Password?
            </span>
          </div>

          {/* BUTTONS */}
          <button className="bg-blue-600 text-white py-2 rounded-lg mb-3 hover:bg-blue-700 transition">
            Sign in
          </button>

          <button className="border py-2 rounded-lg hover:bg-gray-100 transition">
            Sign in with other
          </button>

          <p className="text-sm mt-4 text-center">
            Don't have an account?{" "}
            <span className="text-blue-500 cursor-pointer">Sign up</span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;