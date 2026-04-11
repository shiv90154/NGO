import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { studentId } = useOutletContext();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/students/my-courses`)
            .then((res) => res.json())
            .then((data) => {
                setClasses(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching classes:", error);
                setLoading(false);
            });
    }, [studentId]);

    const formatTime = (time) => {
        return new Date(time).toLocaleString();
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Live Classes</h1>
                <p className="text-gray-500">Join your upcoming and live sessions</p>
            </div>

            {/* LOADING */}
            {loading && <div className="text-gray-500">Loading...</div>}

            {/* CLASSES */}
            <div className="grid md:grid-cols-2 gap-6">
                {classes.map((cls) => (
                    <div
                        key={cls._id}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                    >
                        <h3 className="text-lg font-semibold text-[#1e3a5f]">{cls.title}</h3>
                        <p className="text-sm text-gray-500">{cls.instructor}</p>
                        <p className="text-sm text-gray-600 mb-4">{formatTime(cls.date)}</p>
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${cls.status === "completed" ? "bg-[#ff6b22]/10 text-[#ff6b22]" : "bg-[#ff8c42]/10 text-[#ff8c42]"}`}
                        >
                            {cls.status === "completed" ? "Completed" : "Upcoming"}
                        </span>
                        <div className="mt-4 flex gap-3">
                            <button
                                className={`flex-1 py-2 rounded-md text-white ${cls.status === "completed" ? "bg-[#ff6b22] hover:bg-[#e85f1d]" : "bg-[#1e3a5f] hover:bg-[#162d48]"}`}
                            >
                                {cls.status === "completed" ? "View Details" : "Join Now"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classes;