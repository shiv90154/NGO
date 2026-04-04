import React, { useState } from "react";
import { Sprout, Search } from "lucide-react";

/* ================= MOCK DATA ================= */
const cropsData = [
    {
        id: 1,
        name: "Wheat",
        season: "Rabi",
        duration: "120-150 days",
        soil: "Loamy soil",
        tips: "Requires cool climate and moderate irrigation.",
    },
    {
        id: 2,
        name: "Rice",
        season: "Kharif",
        duration: "90-120 days",
        soil: "Clayey soil",
        tips: "Needs high water supply and warm temperature.",
    },
    {
        id: 3,
        name: "Maize",
        season: "Kharif",
        duration: "80-100 days",
        soil: "Well-drained soil",
        tips: "Requires good sunlight and moderate rainfall.",
    },
    {
        id: 4,
        name: "Mustard",
        season: "Rabi",
        duration: "110-140 days",
        soil: "Sandy loam",
        tips: "Needs dry climate and low humidity.",
    },
];

/* ================= COMPONENT ================= */
const CropGuide = () => {
    const [search, setSearch] = useState("");
    const [seasonFilter, setSeasonFilter] = useState("All");

    const filteredCrops = cropsData.filter((crop) => {
        return (
            crop.name.toLowerCase().includes(search.toLowerCase()) &&
            (seasonFilter === "All" || crop.season === seasonFilter)
        );
    });

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
                    Crop Guide 🌾
                </h1>
                <p className="text-gray-500">
                    Learn about crops, seasons, and best farming practices
                </p>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">

                {/* SEARCH */}
                <div className="flex items-center bg-white border rounded-lg px-3 py-2 w-full md:w-1/2 shadow-sm">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search crops..."
                        className="w-full outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* FILTER */}
                <select
                    className="bg-white border rounded-lg px-3 py-2 shadow-sm"
                    value={seasonFilter}
                    onChange={(e) => setSeasonFilter(e.target.value)}
                >
                    <option value="All">All Seasons</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Zaid">Zaid</option>
                </select>
            </div>

            {/* CROPS GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredCrops.length === 0 ? (
                    <p className="text-gray-500">No crops found.</p>
                ) : (
                    filteredCrops.map((crop) => (
                        <div
                            key={crop.id}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100
              hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* ICON */}
                            <div className="mb-3 text-[#ff8c42]">
                                <Sprout size={28} />
                            </div>

                            {/* NAME */}
                            <h2 className="text-lg font-semibold text-[#1e3a5f]">
                                {crop.name}
                            </h2>

                            {/* DETAILS */}
                            <div className="text-sm text-gray-600 mt-2 space-y-1">
                                <p><span className="font-medium">Season:</span> {crop.season}</p>
                                <p><span className="font-medium">Duration:</span> {crop.duration}</p>
                                <p><span className="font-medium">Soil:</span> {crop.soil}</p>
                            </div>

                            {/* TIPS */}
                            <p className="mt-3 text-sm text-gray-500">
                                {crop.tips}
                            </p>

                            {/* ACTION */}
                            <button
                                className="mt-4 w-full py-2 rounded-md
                bg-[#1e3a5f] text-white
                hover:bg-[#162d48]
                active:scale-95 transition"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}

            </div>

        </div>
    );
};

export default CropGuide;