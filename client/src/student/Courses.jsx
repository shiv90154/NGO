import React from "react";

/* ================= DYNAMIC DATA (API READY) ================= */
const coursesData = [
    // Example data (empty array will trigger "No Courses" UI)
    {
        id: 1,
        title: "Class 10 Mathematics",
        instructor: "Dr. Rajesh Kumar",
        progress: 75,
    },
    {
        id: 2,
        title: "Physics Class 12",
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
                <h1 className="text-2xl font-bold text-gray-800">
                    Your Courses
                </h1>
                <p className="text-gray-500">
                    Track and continue your enrolled courses
                </p>
            </div>

            {/* CONDITIONAL RENDER */}
            {coursesData.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">

                    <div className="text-5xl mb-4">📚</div>

                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        No Courses Taken Yet
                    </h2>

                    <p className="text-gray-500 mb-4">
                        You haven't enrolled in any courses. Start learning today!
                    </p>

                    <button
                        className="
              px-6 py-2 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 active:scale-95
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
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
              "
                        >
                            {/* TITLE */}
                            <h3 className="text-lg font-semibold text-gray-800">
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
                    bg-blue-600 h-2 rounded-full
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
                  bg-blue-600 text-white
                  hover:bg-blue-700
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