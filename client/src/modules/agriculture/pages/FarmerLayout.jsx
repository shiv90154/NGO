import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    Home,
    Sprout,
    CloudSun,
    IndianRupee,
    FileText,
    User
} from "lucide-react";

/* ================= MENU ================= */
const menu = [
    { key: "", label: "Home", icon: Home, path: "/agriculture" },
    { key: "crops", label: "Crops", icon: Sprout, path: "/agriculture/crops" },
    { key: "market", label: "Market", icon: IndianRupee, path: "/agriculture/market" },
    { key: "schemes", label: "Schemes", icon: FileText, path: "/agriculture/schemes" },
    { key: "profile", label: "Profile", icon: User, path: "/agriculture/profile" },
];

/* ================= MOCK DATA ================= */
const farmerData = {
    name: "Ramesh Kumar",
};

/* ================= MAIN ================= */
const FarmerLayout = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">

            {/* ================= SIDEBAR ================= */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">

                <div className="p-5 border-b">
                    <h2 className="text-xl font-bold text-[#1e3a5f] tracking-wide">
                        🌾 AgriConnect
                    </h2>
                    <p className="text-sm text-gray-500">
                        Welcome, {farmerData.name}
                    </p>
                </div>

                <div className="flex-1 p-3 space-y-2">
                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/agriculture"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-lg transition
                                ${isActive
                                    ? "bg-[#1e3a5f] text-white"
                                    : "text-gray-700 hover:bg-[#ff8c42]/10 hover:text-[#ff6b22]"
                                }`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">

                {/* THIS WILL LOAD DIFFERENT PAGES */}
                <Outlet />

            </div>

            {/* ================= MOBILE NAVBAR ================= */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow md:hidden flex justify-around py-2">

                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/agriculture"}
                        className={({ isActive }) =>
                            `flex flex-col items-center text-xs transition
                            ${isActive
                                ? "text-[#ff6b22]"
                                : "text-gray-500"
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] mt-1">{item.label}</span>
                    </NavLink>
                ))}

            </div>

        </div>
    );
};

export default FarmerLayout;