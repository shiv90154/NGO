import React, { useState } from "react";
import Dashboard from './Dashboard';
import Courses from "./Courses";
import Classes from './Classes'
import Notes from './Notes'
import Profile from "./Profile";
import {
    FaHome,
    FaBook,
    FaVideo,
    FaFileAlt,
    FaCalendar,
    FaUser,
    FaBookOpen
} from "react-icons/fa";

/* ================= COMPONENT MAP ================= */
const componentMap = {
    dashboard: () => <Dashboard />,
    courses: () => <Courses />,
    classes: () => <Classes />,
    notes: () => <Notes />,
    profile: () => <Profile />,
};

/* ================= USER DATA ================= */
const userData = {
    name: "ABC",
    role: "student",
}

const data = {
    menu: [
        { key: "dashboard", label: "Dashboard", icon: FaHome },
        { key: "courses", label: "Courses", icon: FaBook },
        { key: "classes", label: "Classes", icon: FaBook },
        { key: "notes", label: "Notes", icon: FaFileAlt },
        { key: "profile", label: "Profile", icon: FaUser },
    ],
};

/* ================= MAIN COMPONENT ================= */
const DynamicDashboard = () => {
    const [activeKey, setActiveKey] = useState("dashboard");

    const ActiveComponent = componentMap[activeKey];

    return (
        <div className="flex bg-gray-100">

            {/* SIDEBAR (DESKTOP ONLY) */}
            <div className="hidden md:flex w-64 min-h-screen fixed bg-white shadow-lg flex-col border-r border-gray-200">

                {/* USER INFO */}
                <div className="p-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-[#1e3a5f] flex gap-2">
                        <FaBookOpen className="w-5 h-5 inline self-center " /> EduLearn
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome, {userData.name}
                    </p>
                </div>

                {/* MENU */}
                <div className="flex-1 p-3 space-y-2">
                    {data.menu.map((item) => (
                        <div
                            key={item.key}
                            onClick={() => setActiveKey(item.key)}
                            className={`
                                flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
                                transition-all duration-200
                                ${activeKey === item.key
                                    ? "bg-[#1e3a5f] text-white shadow-md"
                                    : "text-gray-700 hover:bg-[#ff8c42]/10 hover:text-[#ff6b22]"
                                }
                                active:scale-95
                            `}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-200 text-sm text-gray-500 bg-gray-50">
                    © 2026 EduLearn
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="md:ml-64 flex-1 p-4 md:p-8 bg-gray-100 pb-20">

                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 min-h-[80vh] border border-gray-200">

                    {/* TITLE */}
                    <h1 className="text-xl md:text-2xl font-bold mb-4 capitalize text-[#1e3a5f]">
                        {activeKey.replace("-", " ")}
                    </h1>

                    {/* COMPONENT */}
                    {ActiveComponent ? (
                        <ActiveComponent />
                    ) : (
                        <div className="text-gray-500">Page Not Found</div>
                    )}
                </div>
            </div>

            {/* MOBILE BOTTOM NAVBAR */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex justify-around items-center py-2 md:hidden z-50">
                {data.menu.map((item) => (
                    <div
                        key={item.key}
                        onClick={() => setActiveKey(item.key)}
                        className={`
                            flex flex-col items-center text-xs cursor-pointer transition-all duration-200
                            ${activeKey === item.key
                                ? "text-[#1e3a5f]"
                                : "text-gray-500"
                            }
                        `}
                    >
                        <item.icon className="text-lg mb-1" />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default DynamicDashboard;