import { Search, Plus, BookOpen, Clock, Users, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // ← import Link

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      id: 1,
      title: "Frontend Development",
      instructor: "Sarah Chen",
      progress: 75,
      duration: "8 weeks",
      students: 234,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Data Science Basics",
      instructor: "Michael Brown",
      progress: 45,
      duration: "10 weeks",
      students: 189,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    },
    {
      id: 3,
      title: "UX/UI Design",
      instructor: "Emily Davis",
      progress: 90,
      duration: "6 weeks",
      students: 312,
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=200&fit=crop",
    },
    {
      id: 4,
      title: "Advanced TypeScript",
      instructor: "Alex Johnson",
      progress: 30,
      duration: "4 weeks",
      students: 98,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
    },
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500 mt-1">Continue where you left off</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-sm">
          <Plus size={18} />
          <span>Browse All Courses</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search your courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition"
        />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-800">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{course.instructor}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-indigo-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{course.students} students</span>
                </div>
              </div>

              {/* Link to ViewCourse */}
              <Link
                to={`/education/courses/${course.id}`}
                className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition flex items-center justify-center gap-1"
              >
                Continue <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-2">No courses found</p>
        </div>
      )}
    </div>
  );
}