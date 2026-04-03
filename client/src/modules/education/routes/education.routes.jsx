import { Routes, Route } from "react-router-dom";

import DynamicDashboard from "../pages/Student";
import Dashboard from "../pages/Dashboard";
import Courses from "../pages/Courses";
import Classes from "../pages/Classes";
import Notes from "../pages/Notes";
import Profile from "../pages/Profile";

const EducationRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<DynamicDashboard />}>

        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="classes" element={<Classes />} />
        <Route path="notes" element={<Notes />} />
        <Route path="profile" element={<Profile />} />

      </Route>

    </Routes>
  );
};

export default EducationRoutes;