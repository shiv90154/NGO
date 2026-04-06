import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white border-b"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNav("/")}
        >
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-9 h-9 rounded-md"
          />
          <span className="text-lg font-bold text-gray-800">
            SAMRADDH BHARAT
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 items-center">
          {["/", "/services", "/about", "/contact"].map((path, i) => {
            const names = ["Home", "Modules", "About", "Contact"];
            return (
              <button
                key={i}
                onClick={() => handleNav(path)}
                className={`text-gray-700 hover:text-blue-600 transition ${
                  isActive(path) ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {names[i]}
              </button>
            );
          })}

          <button
            onClick={() => handleNav("/services")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login / Register
          </button>
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
            {["/", "/services", "/about", "/contact"].map((path, i) => {
              const names = ["Home", "Modules", "About", "Contact"];
              return (
                <button
                  key={i}
                  onClick={() => handleNav(path)}
                  className={`text-left py-2 px-3 rounded ${
                    isActive(path)
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {names[i]}
                </button>
              );
            })}

            <button
              onClick={() => handleNav("/services")}
              className="bg-blue-600 text-white py-2 px-3 rounded mt-2"
            >
              Login / Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;