import React from "react";
import { Hand } from "lucide-react";
/* ================= MOCK USER DATA ================= */
const studentData = {
    name: "ABC",
    stats: {
        courses: 4,
        completed: 2,
        hours: 120,
    },

    courses: [
        {
            id: 1,
            title: "Class 6 Mathematics",
            progress: 85,
            instructor: "Dr. Rajesh Kumar",
        },
        {
            id: 2,
            title: "Science Class 6",
            progress: 60,
            instructor: "Prof. Priya Sharma",
        },
    ],

    liveSessions: [
        {
            id: 1,
            title: " Mathematics",
            time: "Today, 6:00 PM",
        },
        {
            id: 2,
            title: "Science Chapter 7",
            time: "Tomorrow, 5:00 PM",
        },
    ],

    resources: [
        { title: "Video Lectures", action: "Browse lectures", link: "/classes" },
        { title: "Study Notes", action: "View notes", link: "/notes" },
    ],

};

const EducationDashboard = () => {
    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Welcome back, {studentData.name} 👋
                </h1>
                <p className="text-gray-500">Track your learning progress</p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(studentData.stats).map(([key, value]) => (
                    <div
                        key={key}
                        className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                    >
                        <h3 className="text-sm text-gray-500 capitalize">
                            {key}
                        </h3>
                        <p className="text-2xl font-bold text-[#ff6b22]">
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            {/* COURSES */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-[#1e3a5f]">
                    Your Courses
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {studentData.courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100"
                        >
                            <h3 className="font-semibold text-lg text-[#1e3a5f]">
                                {course.title}
                            </h3>

                            <p className="text-gray-500 text-sm mb-3">
                                {course.instructor}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                                <div
                                    className="bg-[#ff8c42] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {course.progress}% Complete
                            </p>

                            <button className="px-4 py-1 rounded-md bg-[#1e3a5f] text-white hover:bg-[#162d48] active:scale-95 transition">
                                Continue
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* LIVE SESSIONS */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-[#1e3a5f]">
                    Live Sessions
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {studentData.liveSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100"
                        >
                            <h3 className="font-semibold text-[#1e3a5f]">
                                {session.title}
                            </h3>

                            <p className="text-gray-500 text-sm mb-3">
                                {session.time}
                            </p>

                            <button className="px-4 py-1 rounded-md border border-[#ff6b22] text-[#ff6b22] hover:bg-[#ff6b22] hover:text-white active:scale-95 transition">
                                Join Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RESOURCES */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-[#1e3a5f]">
                    Learning Resources
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {studentData.resources.map((res, i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100"
                        >
                            <h3 className="font-semibold mb-3 text-[#1e3a5f]">
                                {res.title}
                            </h3>

                            <button className="text-[#ff8c42] hover:text-[#ff6b22] hover:underline active:scale-95 transition">
                                {res.action} →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default EducationDashboard;