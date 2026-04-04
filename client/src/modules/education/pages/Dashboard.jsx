import React, { useEffect, useState } from "react";
import axios from "axios";

const EducationDashboard = () => {
    // State
    const [dashboard, setDashboard] = useState({
        student: null,
        courses: [],
        liveSessions: [],
        resources: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const studentId = user?._id;
    const API_URL = import.meta.env.VITE_API_URL;

    // Axios instance with base config
    const api = axios.create({
        baseURL: API_URL,
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    useEffect(() => {
        if (!studentId) {
            setError("No student ID found. Please login again.");
            setLoading(false);
            return; x
        }

        const fetchData = async () => {
            try {
                // Parallel requests for better performance
                const [dashboardRes, notesRes] = await Promise.all([
                    api.get(`/student/dashboard/${studentId}`),
                    api.get(`/student/notes/${studentId}`)
                ]);

                setDashboard({
                    student: {
                        name: dashboardRes.data.data?.name || user?.name || "Student",
                        stats: dashboardRes.data.data?.stats || {
                            courses: 0,
                            completed: 0,
                            hours: 0
                        }
                    },
                    courses: dashboardRes.data.data?.courses || [],
                    liveSessions: (dashboardRes.data.data?.classes || []).map(cls => ({
                        id: cls._id,
                        title: cls.title,
                        time: cls.time,
                        attended: cls.attended
                    })),
                    resources: (notesRes.data.data || []).map(note => ({
                        id: note._id,
                        title: note.title,
                        url: note.fileUrl
                    }))
                });
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    // Sub-components
    const StatCard = ({ label, value }) => (
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
            <h3 className="text-sm text-gray-500 capitalize">{label}</h3>
            <p className="text-2xl font-bold text-[#ff6b22]">{value}</p>
        </div>
    );

    const ProgressBar = ({ progress = 0 }) => (
        <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
            <div
                className="bg-[#ff8c42] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
            />
        </div>
    );

    // Render states
    if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
    if (error) return <ErrorView error={error} />;
    if (!dashboard.student) return <NoDataView />;

    return (
        <div className="space-y-8 p-4">
            <h1 className="text-2xl font-bold text-[#1e3a5f]">
                Welcome back, {dashboard.student.name} 👋
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(dashboard.student.stats).map(([key, value]) => (
                    <StatCard key={key} label={key} value={value} />
                ))}
            </div>

            {/* Courses Section */}
            <Section
                title="Your Courses"
                items={dashboard.courses}
                renderItem={course => (
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100">
                        <h3 className="font-semibold text-lg text-[#1e3a5f]">{course.title}</h3>
                        <p className="text-gray-500 text-sm mb-3">{course.instructor || "Unknown Instructor"}</p>
                        <ProgressBar progress={course.progress} />
                        <p className="text-sm text-gray-600 mb-4">{course.progress || 0}% Complete</p>
                        <button className="px-4 py-1 rounded-md bg-[#1e3a5f] text-white hover:bg-[#162d48]">
                            Continue
                        </button>
                    </div>
                )}
            />

            {/* Live Sessions Section */}
            <Section
                title="Live Sessions"
                items={dashboard.liveSessions}
                renderItem={session => (
                    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100">
                        <h3 className="font-semibold text-[#1e3a5f]">{session.title}</h3>
                        <p className="text-gray-500 text-sm mb-3">{session.time}</p>
                        <button
                            className={`px-4 py-1 rounded-md border transition ${session.attended
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "border-[#ff6b22] text-[#ff6b22] hover:bg-[#ff6b22] hover:text-white"
                                }`}
                            disabled={session.attended}
                        >
                            {session.attended ? "Attended" : "Join Now"}
                        </button>
                    </div>
                )}
            />

            {/* Resources Section */}
            <Section
                title="Learning Resources"
                items={dashboard.resources}
                renderItem={resource => (
                    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100">
                        <h3 className="font-semibold mb-3 text-[#1e3a5f]">{resource.title}</h3>
                        <button
                            onClick={() => window.open(resource.url, "_blank")}
                            className="text-[#ff8c42] hover:text-[#ff6b22] hover:underline"
                        >
                            View Resource →
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

// Reusable components
const Section = ({ title, items, renderItem }) => (
    <div>
        <h2 className="text-xl font-semibold mb-4 text-[#1e3a5f]">{title}</h2>
        {items.length === 0 ? (
            <p className="text-gray-500">No data available</p>
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
                {items.map((item, index) => (
                    <React.Fragment key={item.id || index}>
                        {renderItem(item)}
                    </React.Fragment>
                ))}
            </div>
        )}
    </div>
);

const ErrorView = ({ error }) => (
    <div className="text-center text-red-500 py-10">
        Error: {error}
        <button
            onClick={() => window.location.reload()}
            className="block mx-auto mt-4 px-4 py-2 bg-[#1e3a5f] text-white rounded"
        >
            Retry
        </button>
    </div>
);

const NoDataView = () => (
    <div className="text-center text-red-500 py-10">No student data available</div>
);

export default EducationDashboard;