import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  Award,
} from "lucide-react";

// Helper component – defined before usage
function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}

export default function Dashboard() {
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, text: "Completed 'React Fundamentals' quiz", time: "2 hours ago", icon: CheckCircle },
    { id: 2, text: "Submitted essay for 'UX Design Principles'", time: "Yesterday", icon: FileText },
    { id: 3, text: "Started new course: 'Advanced TypeScript'", time: "2 days ago", icon: BookOpen },
  ];

  const upcomingTasks = [
    { id: 1, task: "Midterm Exam - Mathematics", due: "Tomorrow, 10:00 AM", priority: "high" },
    { id: 2, task: "Group Project Submission", due: "Oct 25, 11:59 PM", priority: "medium" },
    { id: 3, task: "Code Review Assignment", due: "Oct 28, 6:00 PM", priority: "low" },
  ];

  const coursesProgress = [
    { name: "Frontend Development", progress: 75, color: "bg-indigo-600" },
    { name: "Data Science Basics", progress: 45, color: "bg-emerald-500" },
    { name: "UX/UI Design", progress: 90, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value="12"
          change="+2 this month"
          icon={BookOpen}
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Completed"
          value="8"
          change="66% completion rate"
          icon={CheckCircle}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Pending Tests"
          value="3"
          change="2 this week"
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Study Streak"
          value="15"
          change="days 🔥"
          icon={TrendingUp}
          color="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Course Progress</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-5">
              {coursesProgress.map((course) => (
                <div key={course.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{course.name}</span>
                    <span className="text-gray-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${course.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-1.5 bg-gray-50 rounded-lg">
                    <activity.icon size={16} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Upcoming Tasks */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Tasks</h2>
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border-b border-gray-50 pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{task.task}</p>
                      <p className="text-xs text-gray-400 mt-1">{task.due}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        task.priority === "high"
                          ? "bg-red-50 text-red-600"
                          : task.priority === "medium"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
              View All Tasks
            </button>
          </div>

          {/* Achievements Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Award size={24} />
              <h3 className="font-semibold">Next Milestone</h3>
            </div>
            <p className="text-2xl font-bold mb-1">Complete 10 courses</p>
            <p className="text-indigo-100 text-sm mb-4">2 more to go!</p>
            <div className="w-full bg-indigo-400/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}