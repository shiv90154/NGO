import React, { useEffect, useState } from "react";
import api from "../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async (id) => {
    try {
      await api.post(`/courses/enroll/${id}`);
      alert("Enrolled Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <p className="mt-2 font-bold">₹{course.price}</p>

            <button
              onClick={() => handleEnroll(course._id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Enroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;