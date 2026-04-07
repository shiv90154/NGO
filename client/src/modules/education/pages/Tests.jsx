import { Search, Calendar, Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Tests() {
  const [filter, setFilter] = useState("all"); // all, upcoming, completed

  const tests = [
    { id: 1, title: "React Fundamentals Quiz", subject: "Frontend", due: "2024-03-25", time: "2:00 PM", duration: "45 min", status: "upcoming", score: null },
    { id: 2, title: "Data Structures Final", subject: "Computer Science", due: "2024-03-28", time: "10:00 AM", duration: "90 min", status: "upcoming", score: null },
    { id: 3, title: "UX Design Principles", subject: "Design", due: "2024-03-20", time: "3:30 PM", duration: "60 min", status: "completed", score: 88 },
    { id: 4, title: "TypeScript Basics", subject: "Programming", due: "2024-03-18", time: "11:00 AM", duration: "30 min", status: "completed", score: 92 },
  ];

  const filteredTests = tests.filter(test => filter === "all" ? true : test.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tests & Assessments</h1>
        <p className="text-gray-500 mt-1">Track your upcoming and completed tests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {["all", "upcoming", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition ${
              filter === tab
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{test.title}</h3>
                  {test.status === "completed" ? (
                    <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Completed</span>
                  ) : (
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Upcoming</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{test.subject}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(test.due).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{test.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{test.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {test.status === "completed" ? (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="text-xl font-bold text-emerald-600">{test.score}%</p>
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
                    Start Test
                  </button>
                )}
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-2">No tests found</p>
        </div>
      )}
    </div>
  );
}