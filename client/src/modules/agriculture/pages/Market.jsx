import React, { useEffect, useState } from "react";

/* ================= MOCK DATA ================= */
const MOCK_MARKET = [
    { crop: "Wheat", price: 2200, unit: "quintal", trend: "up" },
    { crop: "Rice", price: 2100, unit: "quintal", trend: "down" },
    { crop: "Maize", price: 1800, unit: "quintal", trend: "up" },
];

const Market = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const USE_API = false;

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (USE_API) {
            fetch(`${import.meta.env.VITE_API_URL}/market`)
                .then((res) => res.json())
                .then((res) => setData(res))
                .catch(() => setData(MOCK_MARKET))
                .finally(() => setLoading(false));
        } else {
            setTimeout(() => {
                setData(MOCK_MARKET);
                setLoading(false);
            }, 500);
        }
    }, []);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Market Prices
                </h1>
                <p className="text-gray-500">
                    Latest mandi rates and crop trends
                </p>
            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-gray-500">Loading market data...</p>
            )}

            {/* DATA */}
            {!loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="
                bg-white p-5 rounded-xl shadow-sm
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-300
                border border-gray-100
              "
                        >
                            {/* CROP NAME */}
                            <h3 className="text-lg font-semibold text-[#1e3a5f]">
                                {item.crop}
                            </h3>

                            {/* PRICE */}
                            <p className="text-2xl font-bold text-[#ff6b22] mt-2">
                                ₹{item.price}
                                <span className="text-sm text-gray-500 ml-1">
                                    / {item.unit}
                                </span>
                            </p>

                            {/* TREND */}
                            <p
                                className={`text-sm mt-2 font-medium ${item.trend === "up"
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }`}
                            >
                                {item.trend === "up"
                                    ? "▲ Rising"
                                    : "▼ Falling"}
                            </p>

                            {/* ACTION */}
                            <button
                                className="
                  mt-4 w-full py-2 rounded-md
                  bg-[#1e3a5f] text-white
                  hover:bg-[#162d48]
                  active:scale-95
                  transition
                "
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Market;