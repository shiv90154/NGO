import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAuthenticated = user !== null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      icon: "🚀",
      style: {
        borderRadius: "12px",
        fontWeight: "500",
        padding: "12px 16px",
      },
      progressStyle: {
        background: "#fff",
      }
    });
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleRegister = () => {
    navigate("/register");
    setMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white border-b"
          }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNav("/")}
          >
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-md" />
            <span className="text-lg font-bold text-gray-800">
              SAMRADDH BHARAT
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-6 items-center">
            {/* Navigation Links - Removed Modules */}
            {["/", "/about", "/contact"].map((path, i) => {
              const names = ["Home", "About", "Contact"];
              return (
                <button
                  key={i}
                  onClick={() => handleNav(path)}
                  className={`text-gray-700 hover:text-blue-600 transition ${isActive(path) ? "text-blue-600 font-semibold" : ""
                    }`}
                >
                  {names[i]}
                </button>
              );
            })}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              // Show Logout and Dashboard buttons when logged in
              <div className="flex gap-3">
                <button
                  onClick={handleDashboard}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition min-w-[100px]"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition min-w-[100px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Show Login and Register buttons when logged out
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition min-w-[100px]"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition min-w-[100px]"
                >
                  Register
                </button>
              </div>
            )}
          </nav>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl text-gray-800"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="bg-white md:hidden shadow-md border-t">
            <div className="flex flex-col gap-2 p-4">
              {/* Mobile Navigation Links - Removed Modules */}
              {["/", "/about", "/contact"].map((path, i) => {
                const names = ["Home", "About", "Contact"];
                return (
                  <button
                    key={i}
                    onClick={() => handleNav(path)}
                    className={`text-left py-2 px-3 rounded ${isActive(path)
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {names[i]}
                  </button>
                );
              })}

              {/* Mobile Auth Options */}
              {isAuthenticated ? (
                // Show Logout and Dashboard buttons when logged in
                <>
                  <button
                    onClick={handleDashboard}
                    className="bg-green-600 text-white py-2 px-3 rounded mt-2"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white py-2 px-3 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Show Login and Register buttons when logged out
                <>
                  <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white py-2 px-3 rounded mt-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegister}
                    className="border-2 border-blue-600 text-blue-600 py-2 px-3 rounded hover:bg-blue-50"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;