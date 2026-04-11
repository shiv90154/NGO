import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div className="flex items-center justify-between px-6 md:px-8 py-3">
        {/* Page Title - Dynamic could be added via context, but static for demo */}
        <div>
          <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 hidden md:block">
            Track your learning progress and stay on top of your goals
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${searchFocused
              ? "bg-white shadow-md ring-2 ring-indigo-200 w-80"
              : "bg-gray-100 w-64"
              }`}
          >
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, notes..."
              className="bg-transparent outline-none text-sm w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}