import React from "react";

const DashboardLayout = ({ children, menu, activeKey, setActiveKey, user }) => {
    return (
        <div className="flex bg-gray-100 min-h-screen">

            {/* SIDEBAR */}
            <div className="w-64 fixed top-0 left-0 h-screen bg-white shadow-lg flex flex-col z-50">

                {/* USER INFO */}
                <div className="p-5 border-b">
                    <h2 className="text-lg font-semibold text-blue-600">
                        📘 EduLearn
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome, {user.name}
                    </p>
                </div>

                {/* MENU */}
                <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                    {menu.map((item) => (
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
            <div className="flex-1 ml-64 p-8">
                <div className="bg-white rounded-xl shadow-md p-6 min-h-[80vh]">
                    {children}
                </div>
            </div>

        </div>
    );
};

export default DashboardLayout;