import React, { useEffect, useState } from "react";

/* ================= MOCK DATA ================= */
const mockClasses = [
    {
        id: 1,
        title: "Mathematics",
        instructor: "Dr. Rajesh Kumar",
        time: "2026-04-02T18:00:00",
        status: "live",
    },
    {
        id: 2,
        title: "Social Science ",
        instructor: "Prof. Priya Sharma",
        time: "2026-04-03T17:00:00",
        status: "upcoming",
    },
];

const LiveClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const USE_API = false;

    const getGoogleCalendarLink = (cls) => {
        const start =
            new Date(cls.time)
                .toISOString()
                .replace(/[-:]/g, "")
                .split(".")[0] + "Z";

        const end =
            new Date(new Date(cls.time).getTime() + 60 * 60 * 1000)
                .toISOString()
                .replace(/[-:]/g, "")
                .split(".")[0] + "Z";

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            cls.title
        )}&dates=${start}/${end}`;
    };

    useEffect(() => {
        if (USE_API) {
            fetch(`${import.meta.env.VITE_API_URL}/api/class_data`)
                .then((res) => res.json())
                .then((data) => {
                    setClasses(data);
                    setLoading(false);
                });
        } else {
            setTimeout(() => {
                setClasses(mockClasses);
                setLoading(false);
            }, 500);
        }
    }, []);

    const formatTime = (time) => {
        return new Date(time).toLocaleString();
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Live Classes
                </h1>
                <p className="text-gray-500">
                    Join your upcoming and live sessions
                </p>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-gray-500">Loading...</div>
            )}

            {/* CLASSES */}
            <div className="grid md:grid-cols-2 gap-6">
                {classes.map((cls) => (
                    <div
                        key={cls.id}
                        className="
                            bg-white p-6 rounded-xl shadow-sm
                            hover:shadow-md hover:-translate-y-1
                            transition-all duration-300
                            border border-gray-100
                        "
                    >
                        {/* TITLE */}
                        <h3 className="text-lg font-semibold text-[#1e3a5f]">
                            {cls.title}
                        </h3>

                        {/* INSTRUCTOR */}
                        <p className="text-sm text-gray-500">
                            {cls.instructor}
                        </p>

                        {/* TIME */}
                        <p className="text-sm text-gray-600 mb-4">
                            {formatTime(cls.time)}
                        </p>

                        {/* STATUS */}
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${cls.status === "live"
                                ? "bg-[#ff6b22]/10 text-[#ff6b22]"
                                : "bg-[#ff8c42]/10 text-[#ff8c42]"
                                }`}
                        >
                            {cls.status === "live" ? "Live Now" : "Upcoming"}
                        </span>

                        {/* BUTTONS */}
                        <div className="mt-4 flex gap-3">

                            <button
                                className={`
                                    flex-1 py-2 rounded-md text-white
                                    ${cls.status === "live"
                                        ? "bg-[#ff6b22] hover:bg-[#e85f1d]"
                                        : "bg-[#1e3a5f] hover:bg-[#162d48]"
                                    }
                                    active:scale-95 transition
                                `}
                            >
                                {cls.status === "live"
                                    ? "Join Now"
                                    : "View Details"}
                            </button>

                            {cls.status !== "live" && (
                                <a
                                    href={getGoogleCalendarLink(cls)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        flex-1 py-2 text-center rounded-md
                                        border border-[#1e3a5f] text-[#1e3a5f]
                                        hover:bg-[#1e3a5f] hover:text-white
                                        active:scale-95 transition
                                    "
                                >
                                    Set Reminder
                                </a>
                            )}

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default LiveClasses;