import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Topbar = ({ toggleSidebar, toggleMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const goToNotifications = () => {
    navigate('/notifications');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMobile} className="md:hidden p-2 hover:bg-gray-100 rounded">
            <Bars3Icon className="h-6 w-6" />
          </button>

          <button onClick={toggleSidebar} className="hidden md:block p-2 hover:bg-gray-100 rounded">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* CENTER - SEARCH */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-lg w-1/3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* 🔔 Notifications */}
          <div className="relative cursor-pointer" onClick={goToNotifications}>
            <BellIcon className="h-6 w-6 text-gray-500 hover:text-indigo-600" />

            {/* Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
              3
            </span>
          </div>

          {/* 👤 Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>

              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-md z-20 border">

                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={goToProfile}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  👤 My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
                >
                  🚪 Logout
                </button>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Topbar;