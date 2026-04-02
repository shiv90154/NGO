import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ServicesSection from "./pages/ServicesSection";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyOTP from "./pages/VerifyOTP";
import Refund from "./pages/Refund";
import Disclaimer from "./pages/Disclamier";
import Privacy from "./pages/Privacy";
import Faq from "./pages/Faq";


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


        <Route path="/verify-otp" element={<VerifyOTP />} />


        <Route path="/profile" element={<Profile />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/disclamier" element={<Disclaimer />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<Faq />} />



      </Routes>
      <NewsRoutes />
    </BrowserRouter>
  );
}

export default App;