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
} from "react-icons/fa";

/* ================= COMPONENT MAP ================= */
const componentMap = {
    dashboard: () => <Dashboard />,
    courses: () => <Courses />,
    classes: () => <Classes />,
    notes: () => <Notes />,
    profile: () => <Profile />,
};

/* ================= USER DATA (API READY) ================= */
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
        <div className="flex  bg-gray-100">

            {/* SIDEBAR */}
            <div className="w-64 min-h-screen fixed bg-white shadow-lg flex flex-col">

                {/* USER INFO */}
                <div className="p-5 border-b">
                    <h2 className="text-lg font-semibold text-blue-600">
                        📘 EduLearn
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome, {userData.name}
                    </p>
                </div>

                {/* MENU (DYNAMIC) */}
                <div className="flex-1 p-3 space-y-2">
                    {data.menu.map((item) => (
                        <div
                            key={item.key}
                            onClick={() => setActiveKey(item.key)}
                            className={`
                flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${activeKey === item.key
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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
                <div className="p-4 border-t text-sm text-gray-500">
                    © 2026 EduLearn
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className=" ml-64 flex-1 p-8">
                <div className="bg-white rounded-xl shadow-md p-6 min-h-[80vh]">

                    {/* Dynamic Page Title */}
                    <h1 className="text-2xl font-bold mb-4 capitalize">
                        {activeKey.replace("-", " ")}
                    </h1>

                    {/* Dynamic Component */}
                    {ActiveComponent ? <ActiveComponent /> : <div>Page Not Found</div>}

                </div>
            </div>

        </div>
    );
};

export default DynamicDashboard;
