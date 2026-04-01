import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaGraduationCap,
  FaMoneyBillWave,
  FaHeartbeat,
  FaNewspaper,
  FaLeaf,
  FaLaptopCode,
  FaArrowRight,
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const services = [
  {
    title: "Education",
    desc: "Access courses, learning tools, and resources",
    shortDesc: "Online courses, live classes, test series, certificates",
    color: "from-indigo-500 to-indigo-700",
    icon: FaGraduationCap,
    route: "education",
    features: ["Live Classes", "Test Series", "Certificates", "Teacher Dashboard"]
  },
  {
    title: "Finance",
    desc: "Manage money, banking, and transactions",
    shortDesc: "Digital wallet, money transfer, AEPS, loans & EMI",
    color: "from-emerald-500 to-emerald-700",
    icon: FaMoneyBillWave,
    route: "finance",
    features: ["Digital Wallet", "Money Transfer", "AEPS", "Loans & EMI"]
  },
  {
    title: "Healthcare",
    desc: "Doctors, medical records & consultation",
    shortDesc: "Doctor search, video consultation, health records, AI diagnostics",
    color: "from-rose-500 to-rose-700",
    icon: FaHeartbeat,
    route: "health",
    features: ["Video Consultation", "Health Records", "AI Diagnostics", "Medicine Delivery"]
  },
  {
    title: "News",
    desc: "Stay updated with latest news",
    shortDesc: "News posting, video editing, live streaming, monetization",
    color: "from-sky-500 to-sky-700",
    icon: FaNewspaper,
    route: "news",
    features: ["Live Streaming", "Video Editing", "Ads & Monetization", "Local News"]
  },
  {
    title: "Agriculture",
    desc: "Crop guidance & farming insights",
    shortDesc: "Farmer registration, crop management, AI disease detection",
    color: "from-lime-500 to-lime-700",
    icon: FaLeaf,
    route: "agriculture",
    features: ["Crop Advisory", "Market Linkage", "AI Disease Detection", "Contract Farming"]
  },
  {
    title: "IT Services",
    desc: "Digital tools & tech solutions",
    shortDesc: "Client management, GST billing, project tracking, team tools",
    color: "from-slate-600 to-slate-800",
    icon: FaLaptopCode,
    route: "it",
    features: ["GST Billing", "Project Tracking", "Team Management", "Client CRM"]
  }
];

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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              Choose Your Service
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">
              Access a wide range of digital services tailored to your needs. Login or register to get started.
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100"
              >
                {/* Top Gradient with Icon */}
                <div className={`bg-gradient-to-br ${service.color} p-6 text-white relative`}>
                  <service.icon className="w-12 h-12" />
                  <div className="absolute bottom-0 right-0 opacity-10 text-8xl font-bold">
                    {service.title[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{service.desc}</p>
                  <p className="text-gray-500 text-xs mb-4">{service.shortDesc}</p>

                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-2 gap-1">
                      {service.features.map((feature, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="text-[#ff8c42]">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => navigate(`/login/${service.route}`)}
                      className="flex-1 py-2.5 text-sm font-medium border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-lg hover:bg-[#1e3a5f] hover:text-white transition-all duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate(`/register/${service.route}`)}
                      className="flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] text-white rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c4e7a] rounded-2xl p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Need Help Choosing?</h2>
              <p className="text-gray-200 mb-6">Our support team is here to guide you to the right service.</p>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 bg-[#ff8c42] hover:bg-[#ff6b22] px-6 py-3 rounded-lg font-semibold transition"
              >
                Contact Support <FaArrowRight />
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ServicesSection;