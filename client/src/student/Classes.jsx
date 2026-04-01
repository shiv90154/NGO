import React, { useEffect, useState } from "react";
/* ================= MOCK DATA ================= */
const mockClasses = [
    {
        id: 1,
        title: "Advanced Mathematics",
        instructor: "Dr. Rajesh Kumar",
        time: "2026-04-02T18:00:00",
        status: "live",
    },
    {
        id: 2,
        title: "Physics Chapter 5",
        instructor: "Prof. Priya Sharma",
        time: "2026-04-03T17:00:00",
        status: "upcoming",
    },
];

const LiveClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const USE_API = false;

    /* ================= GOOGLE CALENDAR LINK ================= */
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

    /* ================= LOAD DATA ================= */
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

    /* ================= FORMAT TIME ================= */
    const formatTime = (time) => {
        return new Date(time).toLocaleString();
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Live Classes
                </h1>
                <p className="text-gray-500">
                    Join your upcoming and live sessions
                </p>
            </div>

            {/* LOADING */}
            {loading && <div className="text-gray-500">Loading...</div>}

            {/* CLASSES */}
            <div className="grid md:grid-cols-2 gap-6">
                {classes.map((cls) => (
                    <div
                        key={cls.id}
                        className="
              bg-white p-6 rounded-xl shadow-sm
              hover:shadow-lg hover:-translate-y-1
              transition-all duration-300
            "
                    >
                        {/* TITLE */}
                        <h3 className="text-lg font-semibold">{cls.title}</h3>

                        {/* INSTRUCTOR */}
                        <p className="text-sm text-gray-500">{cls.instructor}</p>

                        {/* TIME */}
                        <p className="text-sm text-gray-600 mb-4">
                            {formatTime(cls.time)}
                        </p>

                        {/* STATUS */}
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${cls.status === "live"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                                }`}
                        >
                            {cls.status === "live" ? "Live Now" : "Upcoming"}
                        </span>

                        {/* BUTTONS */}
                        <div className="mt-4 flex gap-3">

                            {/* JOIN BUTTON */}
                            <button
                                className={`
                  flex-1 py-2 rounded-md text-white
                  ${cls.status === "live"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }
                  active:scale-95 transition
                `}
                            >
                                {cls.status === "live" ? "Join Now" : "View Details"}
                            </button>

                            {/* REMINDER BUTTON (REAL) */}
                            {cls.status !== "live" && (
                                <a
                                    href={getGoogleCalendarLink(cls)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                    flex-1 py-2 text-center rounded-md
                    border border-blue-600 text-blue-600
                    hover:bg-blue-50
                    active:scale-95
                    transition
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