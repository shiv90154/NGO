import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } }
  });

  // Data arrays
  const coreModules = [
    { icon: "🎓", title: "Education", desc: "Online courses, live classes, test series, certificates, and teacher earnings dashboard.", path: "/services/education" },
    { icon: "🏥", title: "Healthcare", desc: "Doctor search, video consultation, health records, prescription & AI disease detection.", path: "/services/healthcare" },
    { icon: "🌾", title: "Agriculture", desc: "Farmer registration, crop management, product selling, AI crop disease detection.", path: "/services/agriculture" },
    { icon: "💰", title: "Finance", desc: "Digital wallet, money transfer, AEPS, bill payments, loans & EMI system.", path: "/services/finance" },
    { icon: "📺", title: "News & Media", desc: "News posting, video editing, live streaming, ads & monetization platform.", path: "/services/media" },
    { icon: "💼", title: "CRM & IT", desc: "Client management, GST billing, project tracking, and team management tools.", path: "/services/crm" },
    { icon: "🏪", title: "Village Store", desc: "Ayurvedic products, agricultural goods, digital services, product exchange system.", path: "/services/store" },
    { icon: "🤝", title: "Franchise & MLM", desc: "Multi-level income distribution, weekly payouts, team hierarchy earnings.", path: "/services/franchise" }
  ];

  const subscriptionPlans = [
    { name: "Education Plan", price: "₹300 - ₹600", features: ["Full course access", "Live classes", "Test series", "Certificates"], cta: "/subscribe/education" },
    { name: "Health Plan", price: "₹200 - ₹2200", features: ["Doctor consultations", "Health records", "AI diagnostics", "Medicine delivery"], cta: "/subscribe/health" },
    { name: "Agriculture Plan", price: "₹1200+", features: ["Crop advisory", "Market linkage", "AI disease detection", "Contract farming"], cta: "/subscribe/agriculture" }
  ];

  const initiatives = [
    { title: "Digital Literacy Mission", desc: "Empowering rural India with digital skills and computer education.", tag: "Education", cta: "/initiatives/digital-literacy" },
    { title: "Ayushman Telehealth", desc: "Affordable healthcare consultations via video and AI support.", tag: "Healthcare", cta: "/initiatives/ayushman" },
    { title: "Smart Kisan Samriddhi", desc: "Real-time crop advisories and direct market access for farmers.", tag: "Agriculture", cta: "/initiatives/smart-kisan" },
    { title: "Jan Dhan Fintech", desc: "Banking, AEPS, and micro-loans for every village citizen.", tag: "Finance", cta: "/initiatives/jan-dhan" },
    { title: "Gramin Media Network", desc: "Local news, live events, and monetization for content creators.", tag: "Media", cta: "/initiatives/gramin-media" },
    { title: "e-Panchayat ERP", desc: "GST billing, project tracking, and digital governance for local bodies.", tag: "CRM & IT", cta: "/initiatives/panchayat-erp" }
  ];

  const testimonials = [
    { name: "Ramesh Kumar", role: "Farmer, Uttar Pradesh", text: "Samraddh Bharat's agriculture module helped me get real-time weather alerts and sell my produce directly. My income has increased by 30%!", rating: 5, avatar: "👨‍🌾" },
    { name: "Priya Sharma", role: "Student, Bihar", text: "The education plan is a game-changer! I access live classes and study materials for free. The digital literacy mission empowered my entire village.", rating: 5, avatar: "👩‍🎓" },
    { name: "Dr. Anil Mehta", role: "Doctor, Rajasthan", text: "Ayushman Telehealth allows me to consult patients in remote areas. The platform is intuitive and reliable.", rating: 4, avatar: "👨‍⚕️" }
  ];

  // Statistics with dynamic counters
  const statistics = [
    { value: 50, label: "Digital Services", suffix: "+" },
    { value: 2500000, label: "Active Users", suffix: "+", prefix: "" },
    { value: 24, label: "AI Support", suffix: "/7" },
    { value: 100, label: "Secure & Transparent", suffix: "%" }
  ];

  // Ref for stats section to trigger counters
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, threshold: 0.3 });

  // Controls for module animations
  const controls = useAnimation();

  // Helper to navigate
  const handleExplore = () => {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2b3d] via-[#1e4a76] to-[#2a6b9e]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#ff8c42] font-bold text-lg tracking-wider inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              GOVERNMENT OF INDIA INITIATIVE
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-2 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Samraddh Bharat
            </h1>
            <p className="text-3xl md:text-4xl font-light text-gray-200 mb-4">समृद्ध भारत · विकसित भारत</p>
            <p className="text-xl md:text-2xl mb-4 text-gray-200 max-w-3xl mx-auto">
              Integrated Digital Management System
            </p>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
              Web Portal + Mobile Application | Village to State Level Digital Governance
            </p>
          </motion.div>

          <motion.div 
            className="flex gap-4 justify-center flex-col sm:flex-row"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplore}
              className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl transition-all"
            >
              Explore Modules
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="border-2 border-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#1e3a5f] transition-all backdrop-blur-sm"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Live Stats Bar */}
      <motion.div 
        className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] py-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            <div><p className="text-xs font-semibold">LIVE USERS</p><p className="text-sm font-bold">2,34,567+</p></div>
            <div><p className="text-xs font-semibold">TODAY'S SERVICES</p><p className="text-sm font-bold">1,23,456</p></div>
            <div><p className="text-xs font-semibold">SATISFACTION</p><p className="text-sm font-bold">98.5%</p></div>
            <div><p className="text-xs font-semibold">VILLAGES COVERED</p><p className="text-sm font-bold">1,25,000+</p></div>
          </div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.section 
        className="py-20 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4" variants={fadeInUp}>
            Welcome to Samraddh Bharat Foundation
          </motion.h2>
          <motion.div className="w-24 h-1 bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] mx-auto mb-6" variants={fadeInUp}></motion.div>
          <motion.p className="text-lg text-gray-600 leading-relaxed" variants={fadeInUp}>
            Samraddh Bharat Foundation is a unified digital ecosystem integrating Education, Healthcare, Agriculture, 
            Finance, NGO operations, and Media into a single platform. Our mission is to provide seamless, transparent, 
            and efficient delivery of services from village to state level, ensuring "Sabka Saath, Sabka Vikas, Sabka Vishwas" 
            through technology-driven governance.
          </motion.p>
        </div>
      </motion.section>

      {/* Core Modules Section */}
      <section id="modules" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">Integrated Core Modules</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Complete digital ecosystem for governance and citizen services</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {coreModules.map((module, index) => (
              <motion.div
                key={index}
                variants={cardVariants(index * 0.1)}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all cursor-pointer group border-t-4 border-[#ff8c42]"
                onClick={() => navigate(module.path)}
              >
                <motion.div 
                  className="text-5xl mb-4 inline-block"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {module.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm">{module.desc}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#ff8c42] text-sm font-semibold">
                  Learn more →
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">Membership & Subscription Plans</h2>
            <p className="text-gray-600">Affordable plans for every citizen — Education, Health, Agriculture</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {subscriptionPlans.map((plan, idx) => (
              <motion.div key={idx} variants={cardVariants(idx * 0.1)} whileHover={{ y: -8 }} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-[#ff8c42] my-3">{plan.price}</div>
                <ul className="text-gray-600 space-y-2 my-4">
                  {plan.features.map((feature, i) => <li key={i} className="flex items-center gap-2">✓ {feature}</li>)}
                </ul>
                <button 
                  onClick={() => navigate(plan.cta)}
                  className="w-full bg-[#1e3a5f] text-white py-2 rounded-lg hover:bg-[#ff8c42] transition-colors"
                >
                  Subscribe Now
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">How It Works</h2>
            <p className="text-gray-600">Simple steps to access government services online</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Register", desc: "Sign up with your mobile number or Aadhaar", icon: "📝" },
              { step: 2, title: "Choose Service", desc: "Select from 50+ digital services", icon: "🔍" },
              { step: 3, title: "Get Benefits", desc: "Receive certificates, payments, or assistance", icon: "🎁" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-[#ff8c42]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-[#ff8c42] mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">Flagship Initiatives</h2>
            <p className="text-gray-600">Transforming India — One initiative at a time</p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {initiatives.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-gray-50 rounded-2xl p-6 border-l-4 border-[#ff8c42] shadow-lg hover:shadow-xl transition">
                <span className="text-xs font-bold text-[#ff8c42] uppercase">{item.tag}</span>
                <h3 className="text-xl font-semibold text-[#1e3a5f] my-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <button 
                  onClick={() => navigate(item.cta)}
                  className="text-[#ff8c42] font-semibold hover:text-[#e6732e]"
                >
                  Apply Now →
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Franchise & MLM System Highlight */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#2a6b9e] text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="inline-block p-3 bg-[#ff8c42]/20 rounded-full mb-4">🤝</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Franchise & MLM System</h2>
            <p className="text-gray-200 text-lg mb-6">Multi-level income distribution · Weekly payouts · Team hierarchy earnings</p>
            <button 
              onClick={() => navigate('/franchise')}
              className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
            >
              Become a Partner →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-center text-[#1e3a5f] mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            What Citizens Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-[#1e3a5f]">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-3">"{testimonial.text}"</p>
                <div className="text-[#ff8c42]">{"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section with dynamic counters */}
      <section ref={statsRef} className="bg-gradient-to-r from-[#1e3a5f] to-[#2a6b9e] text-white py-20 px-4">
        <div className="container mx-auto">
          <motion.h3 className="text-3xl md:text-4xl font-bold text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            Samraddh Bharat in Numbers
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {statistics.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: idx * 0.1 }} whileHover={{ scale: 1.05 }} viewport={{ once: true }}>
                <div className="text-5xl font-bold mb-2 text-[#ff8c42]">
                  {isStatsInView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  ) : stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section (compact) */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-center text-[#1e3a5f] mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            About Samraddh Bharat Foundation
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.02 }} className="bg-gray-50 p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold text-[#1e3a5f] mb-3">Our Vision</h3>
              <p className="text-gray-600">To create a "Samraddh Bharat" (Prosperous India) where every citizen has equal access to government services, opportunities, and benefits through technology-driven governance.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.02 }} className="bg-gray-50 p-8 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-semibold text-[#1e3a5f] mb-3">Our Mission</h3>
              <p className="text-gray-600">Leveraging digital infrastructure to deliver citizen-centric services, promote transparency, and ensure last-mile delivery of government schemes and foundation programs.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">Need Assistance?</h2>
            <p className="text-gray-600 text-lg">Samraddh Bharat Helpline is available 24/7 to assist you with any government services</p>
          </motion.div>

          <motion.div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-8 shadow-xl" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-6">
              <a href="tel:18001234567" className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all text-center">
                📞 Call Helpline: 1800-123-4567
              </a>
              <a href="mailto:support@samraddhbharat.gov.in" className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#1e3a5f] hover:text-white transition-all text-center">
                ✉️ Send Email
              </a>
            </div>
            <div className="mt-8 text-center text-gray-500">
              <p className="font-semibold">Samraddh Bharat Foundation - Government of India Initiative</p>
              <p>support@samraddhbharat.gov.in</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;