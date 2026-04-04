import React from "react";
import { Sprout, CloudSun, IndianRupee, Calendar } from "lucide-react";

/* ================= MOCK DATA ================= */
const farmerData = {
    name: "Ramesh Kumar",
    land: "5 Acres",
    crops: ["Wheat", "Rice"],
    earnings: "₹1,25,000",
};


const marketPrices = [
    { crop: "Wheat", price: "₹2200 / quintal" },
    { crop: "Rice", price: "₹2100 / quintal" },
];

const tasks = [
    "Irrigation scheduled tomorrow",
    "Fertilizer application due",
    "Check weather before sowing",
];

/* ================= COMPONENT ================= */
const DashboardHome = () => {
    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
                    Welcome back, {farmerData.name} 👋
                </h1>
                <p className="text-gray-500">
                    Here’s what’s happening on your farm today
                </p>
            </div>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
                    <p className="text-sm text-gray-500">Total Land</p>
                    <h2 className="text-xl font-bold text-[#ff6b22]">
                        {farmerData.land}
                    </h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
                    <p className="text-sm text-gray-500">Active Crops</p>
                    <h2 className="text-xl font-bold text-[#ff6b22]">
                        {farmerData.crops.join(", ")}
                    </h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <h2 className="text-xl font-bold text-[#ff6b22]">
                        {farmerData.earnings}
                    </h2>
                </div>

            </div>

            {/* ================= MAIN GRID ================= */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* MARKET */}
                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                    <div className="flex items-center gap-2 mb-3">
                        <IndianRupee className="text-[#ff8c42]" />
                        <h2 className="font-semibold text-[#1e3a5f]">
                            Market Prices
                        </h2>
                    </div>

                    <ul className="space-y-2 text-gray-600">
                        {marketPrices.map((item, i) => (
                            <li key={i}>
                                🌾 {item.crop}: {item.price}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* TASKS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="text-[#ff8c42]" />
                        <h2 className="font-semibold text-[#1e3a5f]">
                            Upcoming Tasks
                        </h2>
                    </div>

                    <ul className="space-y-2 text-gray-600 text-sm">
                        {tasks.map((task, i) => (
                            <li key={i}>• {task}</li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-4">
                    <Sprout className="text-[#ff8c42]" />
                    <h2 className="font-semibold text-[#1e3a5f]">
                        Quick Actions
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <button className="py-2 rounded-lg bg-[#1e3a5f] text-white hover:bg-[#162d48] transition active:scale-95">
                        View Crop Guide
                    </button>


                    <button className="py-2 rounded-lg border border-[#ff6b22] text-[#ff6b22] hover:bg-[#ff6b22] hover:text-white transition active:scale-95">
                        View Market
                    </button>

                </div>
            </div>

        </div>
    );
};

export default DashboardHome;