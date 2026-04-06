import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    title : "Education",
    desc: "Access courses, learning tools",
    shortDesc: "Courses, live classes & certificates",
    route: "education",
    image: "https://images.pexels.com/photos/4145197/pexels-photo-4145197.jpeg",
    features: ["Live Classes", "Tests", "Certificates"]
  },
  {
    title: "Finance",
    desc: "Manage money easily",
    shortDesc: "Wallet, transfer & banking",
    route: "finance",
    image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg",
    features: ["Wallet", "Transfer", "Loans"]
  },
  {
    title: "Healthcare",
    desc: "Doctor & health services",
    shortDesc: "Consultation & records",
    route: "health",
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg",
    features: ["Consultation", "Records", "Medicines"]
  },
  {
    title:"News",
    desc: "Latest local updates",
    shortDesc: "Live news & videos",
    route: "news",
    image: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg",
    features: ["Streaming", "Editing", "Ads"]
  },
  {
    title: "Agriculture",
    desc: "Smart farming help",
    shortDesc: "Crop tips & AI support",
    route: "agriculture",
    image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg",
    features: ["Crop Tips", "Market", "AI Help"]
  },
  {
    title: "IT Services",
    desc: "Digital business tools",
    shortDesc: "Billing & project tools",
    route: "it",
    image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
    features: ["Billing", "Projects", "CRM"]
  }
];

// 🎨 BRAND NEW COLOR SET – soft & modern (violet, sky, emerald, rose, amber, cyan)
const cardColors = [
  "bg-violet-100",
  "bg-sky-100",
  "bg-emerald-100",
  "bg-rose-100",
  "bg-amber-100",
  "bg-cyan-100"
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-orange-50 via-white to-green-50 px-4 py-4">
      
      {/* Heading */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Choose Your Service
        </h1>
        <p className="text-sm text-gray-600">
          Digital solutions for smarter villages 🚀
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto w-full">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`${cardColors[idx % cardColors.length]} rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden group`}
            onClick={() => navigate(`/${service.route}`)}
          >
            {/* Image */}
            <div className="relative h-36 w-full overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <h3 className="absolute bottom-3 left-3 text-white text-lg font-semibold">
                {service.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
              <p className="text-gray-700 text-sm font-medium">
                {service.desc}
              </p>
              <p className="text-gray-500 text-xs">
                {service.shortDesc}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {service.features.map((f, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default ServicesSection;
