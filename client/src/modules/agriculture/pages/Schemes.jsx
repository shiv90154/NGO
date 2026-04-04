import React, { useEffect, useState } from "react";

/* ================= MOCK DATA ================= */
const MOCK_SCHEMES = [
    {
        id: 1,
        title: "PM-KISAN Samman Nidhi",
        description: "Provides ₹6000/year income support to farmers.",
        eligibility: "All small and marginal farmers",
        link: "#",
    },
    {
        id: 2,
        title: "Pradhan Mantri Fasal Bima Yojana",
        description: "Crop insurance scheme for financial protection.",
        eligibility: "Farmers growing notified crops",
        link: "#",
    },
    {
        id: 3,
        title: "Soil Health Card Scheme",
        description: "Provides soil health reports for better farming.",
        eligibility: "All farmers",
        link: "#",
    },
];

const Schemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const USE_API = false;

    /* ================= FETCH ================= */
    useEffect(() => {
        if (USE_API) {
            fetch(`${import.meta.env.VITE_API_URL}/schemes`)
                .then((res) => res.json())
                .then((data) => setSchemes(data))
                .catch(() => setSchemes(MOCK_SCHEMES))
                .finally(() => setLoading(false));
        } else {
            setTimeout(() => {
                setSchemes(MOCK_SCHEMES);
                setLoading(false);
            }, 500);
        }
    }, []);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Government Schemes
                </h1>
                <p className="text-gray-500">
                    Explore schemes and benefits available for farmers
                </p>
            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-gray-500">Loading schemes...</p>
            )}

            {/* SCHEMES */}
            {!loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schemes.map((scheme) => (
                        <div
                            key={scheme.id}
                            className="
                bg-white p-5 rounded-xl shadow-sm
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-300
                border border-gray-100
              "
                        >
                            {/* TITLE */}
                            <h3 className="text-lg font-semibold text-[#1e3a5f]">
                                {scheme.title}
                            </h3>

                            {/* DESCRIPTION */}
                            <p className="text-sm text-gray-600 mt-2">
                                {scheme.description}
                            </p>

                            {/* ELIGIBILITY */}
                            <p className="text-xs text-gray-500 mt-2">
                                Eligibility: {scheme.eligibility}
                            </p>

                            {/* ACTION */}
                            <a
                                href={scheme.link}
                                target="_blank"
                                rel="noreferrer"
                                className="
                  mt-4 inline-block w-full text-center py-2 rounded-md
                  border border-[#ff6b22] text-[#ff6b22]
                  hover:bg-[#ff6b22] hover:text-white
                  active:scale-95
                  transition
                "
                            >
                                View Details
                            </a>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Schemes;