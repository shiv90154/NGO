import React, { useState } from "react";
import Dashboard from './Dashboard';
import Courses from "./Courses";
import Classes from './Classes';
import Notes from './Notes';
import Profile from "./Profile";

import {
    FaHome,
    FaBook,
    FaFileAlt,
    FaUser,
} from "react-icons/fa";

/* ================= TRANSLATIONS (INSIDE SAME FILE) ================= */
const translations = {
    en: {
        welcome: "Welcome",
        dashboard: "Dashboard",
        courses: "Courses",
        classes: "Classes",
        notes: "Notes",
        profile: "Profile",
        page_not_found: "Page Not Found"
    },
    hi: {
        welcome: "स्वागत है",
        dashboard: "डैशबोर्ड",
        courses: "कोर्स",
        classes: "कक्षाएं",
        notes: "नोट्स",
        profile: "प्रोफ़ाइल",
        page_not_found: "पेज नहीं मिला"
    }
};

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
};

/* ================= MENU DATA ================= */
const data = {
    menu: [
        { key: "dashboard", label: "dashboard", icon: FaHome },
        { key: "courses", label: "courses", icon: FaBook },
        { key: "classes", label: "classes", icon: FaBook },
        { key: "notes", label: "notes", icon: FaFileAlt },
        { key: "profile", label: "profile", icon: FaUser },
    ],
};

/* ================= MAIN COMPONENT ================= */
const StudentDashboard = ({ lang = "en" }) => {
    const [activeKey, setActiveKey] = useState("dashboard");
    const [language, setLanguage] = useState(lang);

    // 🔥 Translation function
    const t = (key) => translations[language]?.[key] || key;

    const ActiveComponent = componentMap[activeKey];

    return (
        <div className="flex bg-gray-100">

            {/* SIDEBAR */}
            <div className="w-64 min-h-screen fixed bg-white shadow-lg flex flex-col">

                {/* USER INFO */}
                <div className="p-5 border-b">
                    <h2 className="text-lg font-semibold text-blue-600">
                        📘 EduLearn
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {t("welcome")}, {userData.name}
                    </p>
                </div>

                {/* LANGUAGE SWITCH */}
                <div className="p-3 flex gap-2">
                    <button
                        onClick={() => { language == "hi" ? setLanguage("en") : setLanguage("hi") }}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                        {language == "hi" ? "EN" : "हिंदी"}
                    </button>

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
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                }
                active:scale-95
              `}
                        >
                            <item.icon />
                            <span>{t(item.label)}</span>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t text-sm text-gray-500">
                    © 2026 EduLearn
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="ml-64 flex-1 p-8">
                <div className="bg-white rounded-xl shadow-md p-6 min-h-[80vh]">

                    {/* PAGE TITLE */}
                    <h1 className="text-2xl font-bold mb-4 capitalize">
                        {t(activeKey)}
                    </h1>

                    {/* COMPONENT */}
                    {ActiveComponent
                        ? <ActiveComponent />
                        : <div>{t("page_not_found")}</div>}
                </div>
            </div>

        </div>
    );
};

export default StudentDashboard;