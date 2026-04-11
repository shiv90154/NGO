import React, { useState, useEffect } from "react";
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

const api = import.meta.env.VITE_API_URL;

const CropGuide = () => {
    const [cropsData, setCropsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [seasonFilter, setSeasonFilter] = useState("All");
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const seasons = ["All", "Rabi", "Kharif", "Zaid", "Perennial"];

    useEffect(() => {
        const fetchCropGuides = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${api}/agriculture/crop-guide`);
                const result = await response.json();

                if (result.success) {
                    const transformedData = result.data.map(crop => ({
                        id: crop._id,
                        name: crop.name,
                        season: crop.season,
                        duration: crop.duration,
                        soil: crop.soil,
                        tips: crop.tips,
                        waterRequirement: crop.waterRequirement,
                        temperature: crop.temperature,
                        rainfall: crop.rainfall,
                        fertilizer: crop.fertilizer,
                        imageColor: crop.imageColor || "from-green-500 to-emerald-600"
                    }));
                    setCropsData(transformedData);
                } else {
                    setError("Failed to load crop data");
                }
            } catch (err) {
                setError("Network error. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCropGuides();
    }, []);

    const filteredCrops = cropsData.filter((crop) => {
        return (
            crop.name.toLowerCase().includes(search.toLowerCase()) &&
            (seasonFilter === "All" || crop.season === seasonFilter)
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center animate-pulse">
                    <Sprout size={50} className="text-green-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading crop guides...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 mb-3">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HERO */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-800 text-white py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Sprout size={32} />
                        <h1 className="text-3xl font-bold">Crop Guide</h1>
                    </div>
                    <p className="mt-2 text-green-100 max-w-xl">
                        Explore crops, seasons, and farming insights with a clean and modern experience.
                    </p>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
                <div className="max-w-6xl mx-auto p-3 flex flex-col md:flex-row gap-3">

                    {/* SEARCH */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search crops..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    {/* FILTER BUTTON */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden border px-3 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Filter size={14} /> Filters
                    </button>

                    {/* FILTER CHIPS */}
                    <div className={`flex flex-wrap gap-2 ${showFilters ? "flex" : "hidden md:flex"}`}>
                        {seasons.map((season) => (
                            <button
                                key={season}
                                onClick={() => setSeasonFilter(season)}
                                className={`px-3 py-1 rounded-full text-sm transition ${seasonFilter === season
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {season}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="max-w-6xl mx-auto p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredCrops.map((crop) => (
                    <div
                        key={crop.id}
                        onClick={() => setSelectedCrop(crop)}
                        className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group"
                    >
                        <div className={`h-12 bg-gradient-to-br ${crop.imageColor} relative`}>
                            <span className="absolute top-2 left-2 text-xs bg-white/80 px-2 py-0.5 rounded">
                                {crop.season}
                            </span>
                        </div>

                        <div className="p-4">
                            <h2 className="font-bold text-lg">{crop.name}</h2>

                            <div className="text-sm text-gray-500 mt-2 space-y-1">
                                <p>⏱ {crop.duration}</p>
                                <p>💧 {crop.waterRequirement}</p>
                                <p>🌡 {crop.temperature}</p>
                            </div>

                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                                {crop.tips}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedCrop && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedCrop(null)}
                >
                    <div
                        className="bg-white rounded-xl w-full max-w-md overflow-hidden animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`h-32 bg-gradient-to-br ${selectedCrop.imageColor} relative`}>
                            <button
                                className="absolute top-2 right-2 bg-white p-1 rounded-full"
                                onClick={() => setSelectedCrop(null)}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-bold">{selectedCrop.name}</h2>
                            <p className="text-sm text-gray-500 mb-3">{selectedCrop.season}</p>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <p><b>Duration:</b> {selectedCrop.duration}</p>
                                <p><b>Soil:</b> {selectedCrop.soil}</p>
                                <p><b>Water:</b> {selectedCrop.waterRequirement}</p>
                                <p><b>Temp:</b> {selectedCrop.temperature}</p>
                                <p><b>Rain:</b> {selectedCrop.rainfall}</p>
                                <p><b>Fertilizer:</b> {selectedCrop.fertilizer}</p>
                            </div>

                            <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
                                {selectedCrop.tips}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropGuide;