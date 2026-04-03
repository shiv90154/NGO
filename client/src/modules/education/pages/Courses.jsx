import React from "react";

/* ================= DYNAMIC DATA (API READY) ================= */
const coursesData = [
    {
        id: 1,
        title: "Class 6 Mathematics",
        instructor: "Dr. Rajesh Kumar",
        progress: 75,
    },
    {
        id: 2,
        title: "Science Class 6",
        instructor: "Prof. Priya Sharma",
        progress: 40,
    },
];

/* ================= COMPONENT ================= */
const Courses = () => {
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Your Courses
                </h1>
                <p className="text-gray-500">
                    Track and continue your enrolled courses
                </p>
            </div>

            {/* CONDITIONAL RENDER */}
            {coursesData.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center border border-gray-100">

                    <div className="text-5xl mb-4">📚</div>

                    <h2 className="text-xl font-semibold text-[#1e3a5f] mb-2">
                        No Courses Taken Yet
                    </h2>

                    <p className="text-gray-500 mb-4">
                        You haven't enrolled in any courses. Start learning today!
                    </p>

                    <button
                        className="
                            px-6 py-2 rounded-lg 
                            bg-[#ff6b22] text-white
                            hover:bg-[#e85f1d] 
                            active:scale-95
                            transition-all duration-200
                        "
                    >
                        Explore Courses
                    </button>
                </div>
            ) : (
                /* COURSES GRID */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coursesData.map((course) => (
                        <div
                            key={course.id}
                            className="
                                bg-white p-6 rounded-xl shadow-sm
                                hover:shadow-lg hover:-translate-y-1
                                transition-all duration-300
                                border border-gray-100
                            "
                        >
                            {/* TITLE */}
                            <h3 className="text-lg font-semibold text-[#1e3a5f]">
                                {course.title}
                            </h3>

                            {/* INSTRUCTOR */}
                            <p className="text-sm text-gray-500 mb-3">
                                {course.instructor}
                            </p>

                            {/* PROGRESS BAR */}
                            <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                                <div
                                    className="
                                        bg-[#ff8c42] h-2 rounded-full
                                        transition-all duration-500
                                    "
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {course.progress}% Completed
                            </p>

                            {/* ACTION */}
                            <button
                                className="
                                    w-full py-2 rounded-md
                                    bg-[#1e3a5f] text-white
                                    hover:bg-[#162d48]
                                    active:scale-95
                                    transition-all duration-200
                                "
                            >
                                Continue Learning
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Courses;