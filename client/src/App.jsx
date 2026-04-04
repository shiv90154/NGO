import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ServicesSection from "./pages/ServicesSection";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyOTP from "./pages/VerifyOTP";
import TestDashboard from "./pages/TestDashboard";
import ScrollToTop from "./components/ScrollToTop";
import Refund from "./pages/Refund";
import Disclaimer from "./pages/Disclamier";
import Privacy from "./pages/Privacy";
import Faq from "./pages/Faq";

// Import module dashboards
import EducationDashboard from "./modules/education/pages/Dashboard";
import AgricultureDashboard from "./modules/agriculture/pages/Dashboard";
import HealthcareDashboard from "./modules/healthcare/pages/Dashboard";
import NewsDashboard from "./modules/news/pages/Dashboard";
import ITDashboard from "./modules/it/pages/Dashboard";

// Import Finance routes (includes dashboard + all sub‑pages)
import FinanceRoutes from "./modules/finance/routes/finance.routes";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesSection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login/:role" element={<LoginForm />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test-dashboard" element={<TestDashboard />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/disclamier" element={<Disclaimer />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<Faq />} />

        {/* Module dashboard routes (standalone) */}
        <Route path="/education/dashboard" element={<EducationDashboard />} />
        <Route path="/agriculture/dashboard" element={<AgricultureDashboard />} />
        <Route path="/healthcare/dashboard" element={<HealthcareDashboard />} />
        <Route path="/news/dashboard" element={<NewsDashboard />} />
        <Route path="/it/dashboard" element={<ITDashboard />} />

        {/* Finance module routes (includes /finance/dashboard, /finance/wallet, etc.) */}
        {FinanceRoutes()}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;