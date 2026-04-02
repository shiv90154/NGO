import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NewsDetails from "../pages/NewsDetails";

const NewsRoutes = () => {
    return (
        <Routes>
            <Route path="/news" element={<Dashboard />} />
            <Route path="/news/:id" element={<NewsDetails />} />
        </Routes>
    );
};

export default NewsRoutes;