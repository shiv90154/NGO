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
        color: "from-[#ff8c42] to-[#ff6b22]",
        icon: FaGraduationCap,
        link: "#",
    },
    {
        title: "Finance",
        desc: "Manage money, banking, and secure transactions",
        color: "from-[#ff9a55] to-[#ff7a2f]",
        icon: FaMoneyBillWave,
        link: "#",
    },
    {
        title: "Healthcare",
        desc: "Find doctors, medical records, and services",
        color: "from-[#ff7f3a] to-[#ff6b22]",
        icon: FaHeartbeat,
        link: "#",
    },
    {
        title: "News & Social Media",
        desc: "Stay updated, connect, and share globally",
        color: "from-[#ff8c42] to-[#ff7a2f]",
        icon: FaNewspaper,
        link: "#",
    },
    {
        title: "Agriculture",
        desc: "Farming insights, weather updates, crop guidance",
        color: "from-[#ff7f3a] to-[#ff6b22]",
        icon: FaLeaf,
        link: "#",
    },
    {
        title: "IT",
        desc: "Tech solutions, tools, and digital services",
        color: "from-[#ff6b22] to-[#e65a1a]",
        icon: FaLaptopCode,
        link: "#",
    },
];

const ServicesSection = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f2b3d] via-[#1e4a76] to-[#2a6b9e]">

            {/* HERO SECTION */}
            <div className="text-center py-16 px-4">
                <h1 className="text-5xl font-bold text-white mb-4">
                    One Platform. Multiple Services.
                </h1>
                <p className="text-gray-50 max-w-xl mx-auto mb-6">
                    Access essential services across education, finance, healthcare and more — all in one place.
                </p>


            </div>

            {/* SERVICES */}
            <div className="p-8">
                <h2 className="text-4xl font-bold text-center mb-10 text-gray-50">
                    Select a Service
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="
                bg-white rounded-2xl shadow-md overflow-hidden
                hover:shadow-xl transition-all duration-300 hover:-translate-y-2
                flex flex-col justify-between
                border border-orange-100
              "
                        >
                            <div className={`p-5 bg-linear-to-br ${service.color} text-white`}>
                                <service.icon className="w-12 h-12" />
                            </div>

                            <div className="p-5 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{service.desc}</p>
                                </div>

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
                      hover:shadow-md hover:shadow-orange-200
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
                      bg-[#ff6b22] text-white rounded-md
                      overflow-hidden
                      transition-all duration-300
                      hover:rounded-none
                      active:scale-95
                      hover:shadow-md hover:shadow-orange-300
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

            {/* STATS SECTION */}
            <div className="bg-white py-12 mt-12 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-6 max-w-5xl mx-auto">
                    <div>
                        <h3 className="text-3xl font-bold text-[#ff6b22]">50K+</h3>
                        <p className="text-gray-600">Users</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-[#ff6b22]">100+</h3>
                        <p className="text-gray-600">Services</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-[#ff6b22]">24/7</h3>
                        <p className="text-gray-600">Support</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-[#ff6b22]">99%</h3>
                        <p className="text-gray-600">Satisfaction</p>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="text-center py-6 text-gray-50">
                © 2026 • All rights reserved
            </footer>

        </div>
    );
};

export default ServicesSection;