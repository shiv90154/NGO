import React, { useState } from "react";
import {
    Sprout,
    Search,
    Filter,
    Calendar,
    Droplets,
    Sun,
    Thermometer,
    CloudRain,
    X,
    ChevronDown,
    Info
} from "lucide-react";

/* ================= EXTENDED MOCK DATA ================= */
const cropsData = [
    {
        id: 1,
        name: "Wheat",
        season: "Rabi",
        duration: "120-150 days",
        soil: "Loamy soil",
        tips: "Requires cool climate and moderate irrigation. Best sown in November-December.",
        waterRequirement: "Moderate (450-650 mm)",
        temperature: "10°C - 25°C",
        rainfall: "75-100 cm",
        fertilizer: "NPK - 120:60:40 kg/ha",
        imageColor: "from-amber-500 to-yellow-500"
    },
    {
        id: 2,
        name: "Rice",
        season: "Kharif",
        duration: "90-120 days",
        soil: "Clayey soil",
        tips: "Needs high water supply and warm temperature. Ideal for areas with heavy rainfall.",
        waterRequirement: "High (1000-1500 mm)",
        temperature: "20°C - 35°C",
        rainfall: "100-200 cm",
        fertilizer: "NPK - 100:50:50 kg/ha",
        imageColor: "from-emerald-500 to-green-600"
    },
    {
        id: 3,
        name: "Maize",
        season: "Kharif",
        duration: "80-100 days",
        soil: "Well-drained soil",
        tips: "Requires good sunlight and moderate rainfall. Grows best in temperatures of 21-27°C.",
        waterRequirement: "Moderate (500-800 mm)",
        temperature: "18°C - 27°C",
        rainfall: "50-100 cm",
        fertilizer: "NPK - 180:60:40 kg/ha",
        imageColor: "from-yellow-600 to-orange-500"
    },
    {
        id: 4,
        name: "Mustard",
        season: "Rabi",
        duration: "110-140 days",
        soil: "Sandy loam",
        tips: "Needs dry climate and low humidity. Best suited for temperate regions.",
        waterRequirement: "Low (300-400 mm)",
        temperature: "10°C - 25°C",
        rainfall: "40-50 cm",
        fertilizer: "NPK - 80:40:20 kg/ha",
        imageColor: "from-yellow-400 to-green-500"
    },
    {
        id: 5,
        name: "Cotton",
        season: "Kharif",
        duration: "180-210 days",
        soil: "Black soil",
        tips: "Requires warm climate and frost-free conditions. Best grown in areas with 6-7 months of frost-free weather.",
        waterRequirement: "Moderate (500-700 mm)",
        temperature: "20°C - 30°C",
        rainfall: "50-100 cm",
        fertilizer: "NPK - 100:40:40 kg/ha",
        imageColor: "from-blue-400 to-indigo-500"
    },
    {
        id: 6,
        name: "Sugarcane",
        season: "Perennial",
        duration: "300-365 days",
        soil: "Deep loamy soil",
        tips: "Requires tropical climate with high humidity. Needs well-drained fertile soil.",
        waterRequirement: "High (1500-2500 mm)",
        temperature: "20°C - 35°C",
        rainfall: "100-150 cm",
        fertilizer: "NPK - 250:100:100 kg/ha",
        imageColor: "from-green-600 to-emerald-700"
    },
    {
        id: 7,
        name: "Potato",
        season: "Rabi",
        duration: "80-120 days",
        soil: "Sandy loam",
        tips: "Requires cool climate and well-drained soil. Avoid water logging conditions.",
        waterRequirement: "Moderate (350-550 mm)",
        temperature: "15°C - 20°C",
        rainfall: "50-75 cm",
        fertilizer: "NPK - 150:100:120 kg/ha",
        imageColor: "from-amber-600 to-yellow-600"
    },
    {
        id: 8,
        name: "Tomato",
        season: "Zaid",
        duration: "70-90 days",
        soil: "Well-drained loam",
        tips: "Requires warm climate with moderate humidity. Stake plants for better yield.",
        waterRequirement: "Moderate (400-600 mm)",
        temperature: "18°C - 27°C",
        rainfall: "40-60 cm",
        fertilizer: "NPK - 120:80:60 kg/ha",
        imageColor: "from-red-500 to-rose-600"
    },
    {
        id: 9,
        name: "Onion",
        season: "Rabi",
        duration: "100-120 days",
        soil: "Sandy loam",
        tips: "Requires cool climate during growth and warm during maturity. Needs full sunlight.",
        waterRequirement: "Low (350-500 mm)",
        temperature: "13°C - 25°C",
        rainfall: "65-75 cm",
        fertilizer: "NPK - 80:50:50 kg/ha",
        imageColor: "from-orange-400 to-red-500"
    },
    {
        id: 10,
        name: "Chickpea",
        season: "Rabi",
        duration: "90-110 days",
        soil: "Loamy soil",
        tips: "Requires cool climate and well-drained soil. Drought tolerant crop.",
        waterRequirement: "Low (300-400 mm)",
        temperature: "15°C - 25°C",
        rainfall: "60-90 cm",
        fertilizer: "NPK - 20:40:20 kg/ha",
        imageColor: "from-green-500 to-teal-600"
    },
    {
        id: 11,
        name: "Bajra",
        season: "Kharif",
        duration: "70-90 days",
        soil: "Sandy soil",
        tips: "Requires high temperature and low rainfall. Suitable for arid and semi-arid regions.",
        waterRequirement: "Low (250-350 mm)",
        temperature: "25°C - 35°C",
        rainfall: "40-50 cm",
        fertilizer: "NPK - 80:40:40 kg/ha",
        imageColor: "from-yellow-500 to-amber-600"
    },
    {
        id: 12,
        name: "Jowar",
        season: "Kharif",
        duration: "100-120 days",
        soil: "Black soil",
        tips: "Requires warm climate and moderate rainfall. Drought resistant crop.",
        waterRequirement: "Low (300-400 mm)",
        temperature: "25°C - 32°C",
        rainfall: "40-50 cm",
        fertilizer: "NPK - 100:50:50 kg/ha",
        imageColor: "from-green-700 to-lime-600"
    }
];

/* ================= STATISTICS COMPONENT ================= */
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${color}`}>
                <Icon size={16} className="text-white" />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

/* ================= MAIN COMPONENT ================= */
const CropGuide = () => {
    const [search, setSearch] = useState("");
    const [seasonFilter, setSeasonFilter] = useState("All");
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const seasons = ["All", "Rabi", "Kharif", "Zaid", "Perennial"];

    const filteredCrops = cropsData.filter((crop) => {
        return (
            crop.name.toLowerCase().includes(search.toLowerCase()) &&
            (seasonFilter === "All" || crop.season === seasonFilter)
        );
    });

    const stats = {
        total: cropsData.length,
        seasons: [...new Set(cropsData.map(c => c.season))].length,
        rabi: cropsData.filter(c => c.season === "Rabi").length,
        kharif: cropsData.filter(c => c.season === "Kharif").length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* HERO SECTION - Reduced padding */}
            <div className="relative bg-gradient-to-r from-green-700 to-emerald-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sprout size={28} className="text-green-300" />
                        <h1 className="text-2xl md:text-3xl font-bold">Crop Guide</h1>
                    </div>
                    <p className="text-green-100 text-sm md:text-base max-w-2xl">
                        Your comprehensive guide to crop cultivation, seasonal requirements,
                        and best farming practices.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* STATISTICS SECTION - Reduced size */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <StatCard
                        icon={Sprout}
                        label="Total Crops"
                        value={stats.total}
                        color="bg-green-600"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Seasons"
                        value={stats.seasons}
                        color="bg-blue-600"
                    />
                    <StatCard
                        icon={Sun}
                        label="Rabi"
                        value={stats.rabi}
                        color="bg-orange-600"
                    />
                    <StatCard
                        icon={CloudRain}
                        label="Kharif"
                        value={stats.kharif}
                        color="bg-cyan-600"
                    />
                </div>

                {/* SEARCH AND FILTERS - Compact */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* SEARCH */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search crops..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* FILTER BUTTON (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Filter size={14} />
                            <span>Filters</span>
                            <ChevronDown size={14} className={`transform transition ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* SEASON FILTERS - Compact chips */}
                        <div className={`flex gap-1.5 flex-wrap ${showFilters ? 'flex' : 'hidden md:flex'}`}>
                            {seasons.map((season) => (
                                <button
                                    key={season}
                                    onClick={() => setSeasonFilter(season)}
                                    className={`px-2.5 py-1 rounded-lg text-l font-medium transition-all duration-200 ${seasonFilter === season
                                        ? "bg-green-600 text-white shadow-sm shadow-green-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {season}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CROPS GRID - Smaller cards */}
                {filteredCrops.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <Sprout size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No crops found matching your criteria.</p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setSeasonFilter("All");
                            }}
                            className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredCrops.map((crop) => (
                            <div
                                key={crop.id}
                                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                                onClick={() => setSelectedCrop(crop)}
                            >
                                {/* CARD HEADER - Smaller height */}
                                <div className={`h-20 bg-gradient-to-br ${crop.imageColor} relative overflow-hidden`}>
                                    <Sprout size={28} className="absolute bottom-2 right-2 text-white opacity-80" />
                                    <div className="absolute top-2 left-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${crop.season === 'Rabi' ? 'bg-orange-500' :
                                            crop.season === 'Kharif' ? 'bg-cyan-500' :
                                                crop.season === 'Zaid' ? 'bg-purple-500' : 'bg-emerald-500'
                                            } text-white`}>
                                            {crop.season}
                                        </span>
                                    </div>
                                </div>

                                {/* CARD CONTENT - Compact */}
                                <div className="p-3">
                                    <h2 className="text-base font-bold text-gray-800 mb-1.5">
                                        {crop.name}
                                    </h2>

                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Calendar size={11} />
                                            <span>{crop.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Droplets size={11} />
                                            <span className="truncate">{crop.waterRequirement}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Thermometer size={11} />
                                            <span>{crop.temperature}</span>
                                        </div>
                                    </div>

                                    <p className="mt-2 text-[11px] text-gray-500 line-clamp-2">
                                        {crop.tips}
                                    </p>

                                    <button
                                        className="mt-3 w-full py-1.5 rounded-md text-xs bg-gray-100 text-gray-700 font-medium
                    hover:bg-green-600 hover:text-white transition-all duration-200
                    active:scale-95"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL FOR CROP DETAILS - Adjusted size */}
            {selectedCrop && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3"
                    onClick={() => setSelectedCrop(null)}
                >
                    <div
                        className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`h-28 bg-gradient-to-br ${selectedCrop.imageColor} relative`}>
                            <button
                                onClick={() => setSelectedCrop(null)}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100 transition"
                            >
                                <X size={16} />
                            </button>
                            <Sprout size={40} className="absolute bottom-2 left-3 text-white opacity-80" />
                        </div>

                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-bold text-gray-800">{selectedCrop.name}</h2>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${selectedCrop.season === 'Rabi' ? 'bg-orange-500' :
                                    selectedCrop.season === 'Kharif' ? 'bg-cyan-500' :
                                        selectedCrop.season === 'Zaid' ? 'bg-purple-500' : 'bg-emerald-500'
                                    }`}>
                                    {selectedCrop.season}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Info size={13} className="text-green-600" />
                                        <h3 className="font-semibold text-xs text-gray-700">Growth</h3>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <p><span className="font-medium">Duration:</span> {selectedCrop.duration}</p>
                                        <p><span className="font-medium">Soil:</span> {selectedCrop.soil}</p>
                                        <p><span className="font-medium">Water:</span> {selectedCrop.waterRequirement}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Sun size={13} className="text-yellow-600" />
                                        <h3 className="font-semibold text-xs text-gray-700">Climate</h3>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <p><span className="font-medium">Temp:</span> {selectedCrop.temperature}</p>
                                        <p><span className="font-medium">Rain:</span> {selectedCrop.rainfall}</p>
                                        <p><span className="font-medium">Fertilizer:</span> {selectedCrop.fertilizer}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Sprout size={13} className="text-green-600" />
                                    <h3 className="font-semibold text-xs text-green-800">Growing Tips</h3>
                                </div>
                                <p className="text-gray-700 text-xs">{selectedCrop.tips}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropGuide;