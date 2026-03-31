import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // Auto close mobile sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-300 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col transition-all duration-300">

        {/* Topbar */}
        <Topbar
          toggleSidebar={toggleSidebar}
          toggleMobile={toggleMobile}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Centered Container (🔥 PRO UI) */}
          <div className="max-w-7xl mx-auto">

            {/* Page Content */}
            <div className="bg-transparent">
              {children}
            </div>

          </div>

        </main>
      </div>

      {/* Mobile Overlay Blur */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-20 md:hidden"></div>
      )}

    </div>
  );
};

export default Layout;