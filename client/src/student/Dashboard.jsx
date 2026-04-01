import React from "react";

/* ================= MOCK USER DATA (API READY) ================= */
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
            title: "Class 10 Mathematics",
            progress: 85,
            instructor: "Dr. Rajesh Kumar",
        },
        {
            id: 2,
            title: "Physics Class 12",
            progress: 60,
            instructor: "Prof. Priya Sharma",
        },
    ],

    liveSessions: [
        {
            id: 1,
            title: "Advanced Mathematics",
            time: "Today, 6:00 PM",
        },
        {
            id: 2,
            title: "Physics Chapter 5",
            time: "Tomorrow, 5:00 PM",
        },
    ],

    resources: [
        { title: "Video Lectures", action: "Browse lectures" },
        { title: "Study Notes", action: "View notes" },
        { title: "PYQs", action: "Practice now" },
    ],
};

/* ================= COMPONENT ================= */
const StudentDashboard = () => {
    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {studentData.name} 👋
                </h1>
                <p className="text-gray-500">Track your learning progress</p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(studentData.stats).map(([key, value]) => (
                    <div
                        key={key}
                        className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        <h3 className="text-sm text-gray-500 capitalize">{key}</h3>
                        <p className="text-2xl font-bold text-blue-600">{value}</p>
                    </div>
                ))}
            </div>

            {/* COURSES */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Courses</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {studentData.courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition"
                        >
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-gray-500 text-sm mb-3">
                                {course.instructor}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {course.progress}% Complete
                            </p>

                            <button className="px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition">
                                Continue
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* LIVE SESSIONS */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Live Sessions</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {studentData.liveSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition"
                        >
                            <h3 className="font-semibold">{session.title}</h3>
                            <p className="text-gray-500 text-sm mb-3">
                                {session.time}
                            </p>

                            <button className="px-4 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95 transition">
                                Join Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RESOURCES */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Learning Resources
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {studentData.resources.map((res, i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition"
                        >
                            <h3 className="font-semibold mb-3">{res.title}</h3>

                            <button className="text-blue-600 hover:underline active:scale-95 transition">
                                {res.action} →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default StudentDashboard;