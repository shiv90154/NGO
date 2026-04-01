import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNav = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1e3a5f]/95 backdrop-blur-md shadow-xl"
          : "bg-[#1e3a5f]"
      } text-white`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* 🔥 LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNav("/")}
        >
          <img
            src="/logo.jpg"
            alt="logo"
            className="w-10 h-10 object-contain rounded-md shadow"
          />
          <span className="text-lg font-bold tracking-wide">
            SAMRADDH BHARAT
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 items-center">

          <button
            onClick={() => handleNav("/")}
            className={`hover:text-orange-400 ${
              isActive("/") ? "text-orange-400" : ""
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav("/services")}
            className={`hover:text-orange-400 ${
              isActive("/services") ? "text-orange-400" : ""
            }`}
          >
            Modules
          </button>

          <button
            onClick={() => handleNav("/about")}
            className={`hover:text-orange-400 ${
              isActive("/about") ? "text-orange-400" : ""
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNav("/contact")}
            className={`hover:text-orange-400 ${
              isActive("/contact") ? "text-orange-400" : ""
            }`}
          >
            Contact
          </button>

          {/* 🔥 LOGIN BUTTON FIXED */}
          <button
            onClick={() => handleNav("/services")}
            className="bg-orange-500 px-5 py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            Login / Register
          </button>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-2xl"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#1e3a5f] md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-4">

              <button
                onClick={() => handleNav("/")}
                className={`text-left py-2 px-3 rounded-lg ${
                  isActive("/") ? "bg-orange-500/20 text-orange-400" : "hover:bg-white/10"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNav("/services")}
                className={`text-left py-2 px-3 rounded-lg ${
                  isActive("/services") ? "bg-orange-500/20 text-orange-400" : "hover:bg-white/10"
                }`}
              >
                Modules
              </button>

              <button
                onClick={() => handleNav("/about")}
                className={`text-left py-2 px-3 rounded-lg ${
                  isActive("/about") ? "bg-orange-500/20 text-orange-400" : "hover:bg-white/10"
                }`}
              >
                About
              </button>

              <button
                onClick={() => handleNav("/contact")}
                className={`text-left py-2 px-3 rounded-lg ${
                  isActive("/contact") ? "bg-orange-500/20 text-orange-400" : "hover:bg-white/10"
                }`}
              >
                Contact
              </button>

              <button
                onClick={() => handleNav("/services")}
                className="bg-orange-500 text-white py-2 px-3 rounded-lg font-semibold mt-2"
              >
                Login / Register
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;