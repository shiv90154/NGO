import { Routes, Route } from "react-router-dom";
import FarmerLayout from "../pages/FarmerLayout"
import CropGuide from "../pages/CropGuide"
import DashboardHome from "../pages/DashboardHome";
import Market from "../pages/Market";
import Schemes from "../pages/Schemes";
import Profile from "../pages/Profile";
/* ================= ROUTES ================= */
const AgricultureRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FarmerLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="crops" element={<CropGuide />} />
                <Route path="market" element={<Market />} />
                <Route path="schemes" element={<Schemes />} />
                <Route path="profile" element={<Profile />} />
            </Route>

        </Routes>
    );
};

export default AgricultureRoutes;