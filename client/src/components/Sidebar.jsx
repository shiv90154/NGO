import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  CogIcon,
  FolderIcon,
  HeartIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UserCircleIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ collapsed = false, mobileOpen = false, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: "Main",
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: HomeIcon, roles: ['super_admin','admin','doctor','user'] },
        { path: '/analytics', label: 'Analytics', icon: ChartBarIcon, roles: ['super_admin','admin'] },
      ]
    },

    {
      title: "Management",
      items: [
        { path: '/users', label: 'Users', icon: UsersIcon, roles: ['super_admin','admin'] },
        { path: '/roles', label: 'Roles', icon: ShieldCheckIcon, roles: ['super_admin'] },
        { path: '/content', label: 'Content', icon: FolderIcon, roles: ['admin'] },
      ]
    },

    {
      title: "Operations",
      items: [
        { path: '/patients', label: 'Patients', icon: HeartIcon, roles: ['doctor'] },
        { path: '/prescriptions', label: 'Prescriptions', icon: DocumentTextIcon, roles: ['doctor'] },
      ]
    },

    {
      title: "Learning",
      items: [
        { path: '/courses', label: 'Courses', icon: AcademicCapIcon, roles: ['user'] },
        { path: '/my-learning', label: 'My Learning', icon: AcademicCapIcon, roles: ['user'] },
      ]
    },

    {
      title: "Finance",
      items: [
        { path: '/orders', label: 'Orders', icon: ShoppingCartIcon, roles: ['user'] },
        { path: '/wallet', label: 'Wallet', icon: CreditCardIcon, roles: ['user'] },
      ]
    },

    {
      title: "Communication",
      items: [
        { path: '/notifications', label: 'Notifications', icon: BellIcon, roles: ['super_admin','admin','doctor','user'], badge: 3 },
        { path: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon, roles: ['super_admin','admin','doctor','user'] },
      ]
    },

    {
      title: "System",
      items: [
        { path: '/reports', label: 'Reports', icon: ChartBarIcon, roles: ['super_admin','admin','doctor'] },
        { path: '/settings', label: 'Settings', icon: CogIcon, roles: ['super_admin'] },
      ]
    },

    {
      title: "Support",
      items: [
        { path: '/profile', label: 'Profile', icon: UserCircleIcon, roles: ['super_admin','admin','doctor','user'] },
        { path: '/help', label: 'Help', icon: QuestionMarkCircleIcon, roles: ['super_admin','admin','doctor','user'] },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden md:flex flex-col bg-white border-r transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} h-screen`}>

        {/* Logo */}
        <div className="p-4 border-b">
          <span className="text-indigo-600 font-bold text-lg">
            {collapsed ? 'RB' : 'RBAC Panel'}
          </span>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {menuSections.map((section, idx) => {
            const items = section.items.filter(i => i.roles.includes(user?.role));
            if (!items.length) return null;

            return (
              <div key={idx}>
                {!collapsed && (
                  <p className="text-xs text-gray-400 uppercase mb-2 px-2">
                    {section.title}
                  </p>
                )}

                {items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                  >
                    <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />

                    {!collapsed && (
                      <>
                        <span className="text-sm">{item.label}</span>

                        {item.badge && (
                          <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="border-t my-2"></div>
              </div>
            );
          })}
        </div>

        {/* User */}
        <div className="border-t p-3">
          {!collapsed && (
            <div className="mb-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 w-full p-2 rounded hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile */}
      <div className={`fixed inset-0 z-30 md:hidden ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-40" onClick={() => setMobileOpen(false)} />

        <aside className="absolute left-0 top-0 w-64 h-full bg-white shadow-lg flex flex-col">
          <div className="p-4 flex justify-between border-b">
            <span className="font-bold text-indigo-600">RBAC Panel</span>
            <button onClick={() => setMobileOpen(false)}>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {menuSections.map(section =>
              section.items
                .filter(i => i.roles.includes(user?.role))
                .map(item => (
                  <NavLink key={item.path} to={item.path} onClick={handleLinkClick} className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </NavLink>
                ))
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;