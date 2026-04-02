import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NewsDetails from "../pages/NewsDetails";

const NewsRoutes = () => {
    return (<>
        {/* <Header /> */}
        <Routes>

            <Route path="/news" element={<Dashboard />} />
            <Route path="/news/:id" element={<NewsDetails />} />
              {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        </>
    );
};

export default NewsRoutes;