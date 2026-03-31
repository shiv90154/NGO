import React from "react";
import {
    FaGraduationCap,
    FaMoneyBillWave,
    FaHeartbeat,
    FaNewspaper,
    FaLeaf,
    FaLaptopCode,
} from "react-icons/fa";

const services = [
    {
        title: "Education",
        desc: "Access courses, learning tools, and resources",
        color: "from-indigo-400 to-indigo-600",
        icon: FaGraduationCap,
    },
    {
        title: "Finance",
        desc: "Manage money, banking, and secure transactions",
        color: "from-emerald-400 to-emerald-600",
        icon: FaMoneyBillWave,
    },
    {
        title: "Healthcare",
        desc: "Find doctors, medical records, and services",
        color: "from-rose-400 to-rose-600",
        icon: FaHeartbeat,
    },
    {
        title: "News & Social Media",
        desc: "Stay updated, connect, and share globally",
        color: "from-sky-400 to-sky-600",
        icon: FaNewspaper,
    },
    {
        title: "Agriculture",
        desc: "Farming insights, weather updates, crop guidance",
        color: "from-lime-400 to-lime-600",
        icon: FaLeaf,
    },
    {
        title: "IT",
        desc: "Tech solutions, tools, and digital services",
        color: "from-slate-500 to-slate-700",
        icon: FaLaptopCode,
    },
];

const ServicesSection = () => {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
                Select a Service
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
                {services.map((service, idx) => (
                    <div
                        key={idx}
                        className="
              bg-white rounded-2xl shadow-lg overflow-hidden
              hover:shadow-2xl transition-all duration-300 hover:-translate-y-2
              flex flex-col justify-between
            "
                    >
                        {/* Gradient Header */}
                        <div
                            className={`p-5 bg-gradient-to-br ${service.color} text-white`}
                        >
                            <service.icon className="w-12 h-12" />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col justify-between flex-1">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-3">{service.desc}</p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-auto">
                                {/* Login */}
                                <a
                                    href={service.link}
                                    className="
                    relative flex items-center
                    px-5 py-1.5 text-sm font-medium
                    bg-white text-gray-900 rounded-md
                    border border-gray-200
                    overflow-hidden
                    transition-all duration-300
                    hover:rounded-none
                    active:scale-95
                    cursor-pointer
                    hover:[&>.arrow]:opacity-100
                    hover:[&>.arrow]:translate-x-0
                    hover:[&>.text]:translate-x-3
                  "
                                >
                                    <span className="arrow absolute left-2 opacity-0 -translate-x-2 transition-all duration-300">
                                        →
                                    </span>
                                    <span className="text transition-all duration-300">
                                        Login
                                    </span>
                                </a>

                                {/* Register */}
                                <a
                                    href={service.link}
                                    className="
                    relative flex items-center
                    px-5 py-1.5 text-sm font-medium
                    bg-gray-900 text-white rounded-md
                    overflow-hidden
                    cursor-pointer
                    transition-all duration-300
                    hover:rounded-none
                    active:scale-95
                    hover:[&>.arrow]:opacity-100
                    hover:[&>.arrow]:translate-x-0
                    hover:[&>.text]:translate-x-3
                  "
                                >
                                    <span className="arrow absolute left-2 opacity-0 -translate-x-2 transition-all duration-300">
                                        →
                                    </span>
                                    <span className="text transition-all duration-300">
                                        Register
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesSection;