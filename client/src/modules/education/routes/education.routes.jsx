import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Courses from "../pages/Courses";
import Tests from "../pages/Classes";
import Notes from "../pages/Notes";
import Profile from "../pages/Profile";
import ViewCourse from "../pages/ViewCourse"; // ← import ViewCourse

export default function EducationRoutes() {
  return (
    <Routes>

      <Route path="/" element={<DynamicDashboard />}>

        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<ViewCourse />} /> {/* ← new route */}
        <Route path="tests" element={<Tests />} />
        <Route path="notes" element={<Notes />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}