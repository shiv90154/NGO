import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { studentId } = useOutletContext();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/students/courses/${studentId}`)
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setLoading(false);
            });
    }, [studentId]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">Courses Library</h1>
                <p className="text-gray-500">Explore and continue your learning journey</p>
            </div>

            {/* EMPTY STATE */}
            {courses.length === 0 && !loading && (
                <div className="bg-white p-10 rounded-xl shadow text-center border border-gray-200">
                    <div className="text-5xl mb-4">📚</div>
                    <h2 className="text-xl font-semibold text-[#1e3a5f] mb-2">No Courses Available</h2>
                    <p className="text-gray-500 mb-4">Courses will appear here once added.</p>
                </div>
            )}

            {/* COURSES GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course._id}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <span className="text-xs px-2 py-1 rounded-full bg-[#ff8c42]/10 text-[#ff8c42]">
                            {course.category}
                        </span>
                        <h3 className="text-lg font-semibold text-[#1e3a5f] mt-2">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                            <div
                                className="bg-[#ff6b22] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{course.progress}% Completed</p>
                        <div className="flex gap-3">
                            <button className="flex-1 py-2 rounded-md text-white bg-[#1e3a5f] hover:bg-[#162d48]">
                                Continue
                            </button>
                            <button className="flex-1 py-2 rounded-md border border-[#ff8c42] text-[#ff8c42] hover:bg-[#ff8c42] hover:text-white">
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;