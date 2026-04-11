import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileText,
  User,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
    } ${collapsed ? "justify-center px-2" : ""}`;

  return (
    <div
      className={`relative bg-slate-900 text-white flex flex-col shadow-2xl shadow-slate-900/20 z-10 transition-all duration-300 ${collapsed ? "w-20" : "w-72"
        }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-slate-800 rounded-full p-1.5 border border-slate-700 hover:bg-indigo-600 transition-colors z-20"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Area */}
      <div className={`flex items-center gap-3 px-6 py-6 border-b border-slate-800 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="p-2 bg-indigo-600 rounded-xl">
          <GraduationCap size={24} />
        </div>
        {!collapsed && (
          <div className="text-xl font-bold tracking-tight whitespace-nowrap">
            Edu<span className="text-indigo-400">Flow</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5">
        <NavLink to="/education" className={navLinkClass} title={collapsed ? "Dashboard" : ""}>
          <LayoutDashboard size={20} />
          {!collapsed && <span className="font-medium">Dashboard</span>}
        </NavLink>

        <NavLink to="/education/courses" className={navLinkClass} title={collapsed ? "Courses" : ""}>
          <BookOpen size={20} />
          {!collapsed && <span className="font-medium">Courses</span>}
        </NavLink>

        <NavLink to="/education/tests" className={navLinkClass} title={collapsed ? "Tests" : ""}>
          <ClipboardList size={20} />
          {!collapsed && <span className="font-medium">Tests</span>}
        </NavLink>

        <NavLink to="/education/notes" className={navLinkClass} title={collapsed ? "Notes" : ""}>
          <FileText size={20} />
          {!collapsed && <span className="font-medium">Notes</span>}
        </NavLink>

        <NavLink to="/education/profile" className={navLinkClass} title={collapsed ? "Profile" : ""}>
          <User size={20} />
          {!collapsed && <span className="font-medium">Profile</span>}
        </NavLink>
      </nav>

      {/* User & Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-1.5">


        <button
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Settings" : ""}
        >
          <Settings size={20} />
          {!collapsed && <span className="font-medium">Settings</span>}
        </button>

        <button
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}