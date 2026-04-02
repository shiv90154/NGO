import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NewsDetails from "../pages/NewsDetails";

const NewsRoutes = () => {
    return (
        <Routes>

            <Route index element={<Dashboard />} />
         
            <Route path=":id" element={<NewsDetails />} />
        </Routes>
    );
};

export default NewsRoutes;