import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ServicesSection from "./pages/ServicesSection";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyOTP from "./pages/VerifyOTP";
import DynamicDashboard from "./student/Student";
import NewsRoutes from "./modules/news/routes/news.routes";
import ScrollToTop from "./components/ScrollToTop";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesSection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login/:role" element={<LoginForm />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/student" element={<DynamicDashboard />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <NewsRoutes />
    </BrowserRouter>
  );
}

export default App;