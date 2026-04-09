import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Optimized toast configuration (defined once outside component)
const toastConfig = {
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
  },
};

// Navigation items (constant)
const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

// Memoized NavLink component to prevent unnecessary re-renders
const NavLink = React.memo(({ path, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`text-gray-700 hover:text-blue-600 transition ${
      isActive ? "text-blue-600 font-semibold" : ""
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    {label}
  </button>
));

NavLink.displayName = "NavLink";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  // Optimized scroll handler with passive event listener
  useEffect(() => {
    const handleScroll = () => {
      // Throttle using requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open (better UX)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Memoized navigation handler
  const handleNav = useCallback((path) => {
    navigate(path);
    setMobileMenuOpen(false);
  }, [navigate]);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logged out successfully 👋", toastConfig);
    navigate("/");
    setMobileMenuOpen(false);
  }, [logout, navigate]);

  // Memoized auth handlers
  const handleLogin = useCallback(() => {
    navigate("/login");
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleRegister = useCallback(() => {
    navigate("/register");
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    navigate("/services");
    setMobileMenuOpen(false);
  }, [navigate]);

  // Memoized active path check
  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Memoized desktop navigation links
  const desktopNavLinks = useMemo(() => (
    <nav className="hidden md:flex gap-6 items-center">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          path={item.path}
          label={item.label}
          isActive={isActive(item.path)}
          onClick={() => handleNav(item.path)}
        />
      ))}
    </nav>
  ), [isActive, handleNav]);

  // Memoized auth buttons (desktop)
  const desktopAuthButtons = useMemo(() => {
    if (isAuthenticated) {
      return (
        <div className="flex gap-3">
          <button
            onClick={handleDashboard}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition min-w-[100px] focus:ring-2 focus:ring-green-500 focus:outline-none"
            aria-label="Dashboard"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition min-w-[100px] focus:ring-2 focus:ring-red-500 focus:outline-none"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      );
    }
    return (
      <div className="flex gap-3">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition min-w-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Login"
        >
          Login
        </button>
        <button
          onClick={handleRegister}
          className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition min-w-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Register"
        >
          Register
        </button>
      </div>
    );
  }, [isAuthenticated, handleDashboard, handleLogout, handleLogin, handleRegister]);

  // Memoized mobile menu content
  const mobileMenuContent = useMemo(() => {
    if (!mobileMenuOpen) return null;

    return (
      <div className="bg-white md:hidden shadow-md border-t animate-slideDown">
        <div className="flex flex-col gap-2 p-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`text-left py-2 px-3 rounded ${
                isActive(item.path)
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAuthenticated ? (
            <>
              <button
                onClick={handleDashboard}
                className="bg-green-600 text-white py-2 px-3 rounded mt-2 focus:ring-2 focus:ring-green-500"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-3 rounded focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white py-2 px-3 rounded mt-2 focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="border-2 border-blue-600 text-blue-600 py-2 px-3 rounded hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    );
  }, [mobileMenuOpen, isAuthenticated, handleNav, isActive, handleDashboard, handleLogout, handleLogin, handleRegister]);

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
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white border-b"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNav("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNav("/")}
            aria-label="Home"
          >
            <img src="/logo.jpg" alt="Samraddh Bharat Foundation Logo" className="w-9 h-9 rounded-md" />
            <span className="text-lg font-bold text-gray-800">
              SAMRADDH BHARAT
            </span>
          </div>

          {/* Desktop Navigation */}
          {desktopNavLinks}
          {desktopAuthButtons}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuContent}
      </header>
    </>
  );
};

// Add a CSS animation for mobile menu (optional - add to your global CSS)
const style = document.createElement("style");
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slideDown {
    animation: slideDown 0.2s ease-out;
  }
`;
if (!document.querySelector("#header-animation-style")) {
  style.id = "header-animation-style";
  document.head.appendChild(style);
}

export default React.memo(Header);