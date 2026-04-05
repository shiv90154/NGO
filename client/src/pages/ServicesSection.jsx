import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    title: "Education",
    desc: "Access courses, learning tools, and resources",
    shortDesc: "Online courses, live classes, test series, certificates",
    route: "education",
    image: "https://imgs.search.brave.com/tYWx6E_AcHkcG6uYjZWj4trMCpZsyU-TkMsMuodsJNU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjIy/Mzg3MDQ0OC9waG90/by9lZHVjYXRpb24t/a2lkLWxlYXJuaW5n/LWFuZC10cmFpbmlu/Zy13aXRoLWFpLWtu/b3dsZWRnZS1hbmQt/dGVjaG5vbG9neS1j/b25jZXB0LXJvYm90/LWhvbG9ncmFtLndl/YnA_YT0xJmI9MSZz/PTYxMng2MTImdz0w/Jms9MjAmYz1haFQ0/bW5nQW9qNE1LUUdG/T3AzQnh2SGhKRXlW/cTREdHRhcVBYWlVX/eHNBPQ",
    features: ["Live Classes", "Test Series", "Certificates", "Teacher Dashboard"]
  },
  {
    title: "Finance",
    desc: "Manage money, banking, and transactions",
    shortDesc: "Digital wallet, money transfer, AEPS, loans & EMI",
    route: "finance",
    image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=600",
    features: ["Digital Wallet", "Money Transfer", "AEPS", "Loans & EMI"]
  },
  {
    title: "Healthcare",
    desc: "Doctors, medical records & consultation",
    shortDesc: "Doctor search, video consultation, health records, AI diagnostics",
    route: "health",
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=600",
    features: ["Video Consultation", "Health Records", "AI Diagnostics", "Medicine Delivery"]
  },
  {
    title: "News",
    desc: "Stay updated with latest news",
    shortDesc: "News posting, video editing, live streaming, monetization",
    route: "news",
    image: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=600",
    features: ["Live Streaming", "Video Editing", "Ads & Monetization", "Local News"]
  },
  {
    title: "Agriculture",
    desc: "Crop guidance & farming insights",
    shortDesc: "Farmer registration, crop management, AI disease detection",
    route: "agriculture",
    image: "https://imgs.search.brave.com/U-qhgHtfoeh3ny9DWOzLIzJiOergTi8rgSwwRPZpFMM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saW5l/MjUuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIyLzExLzEy/Li1BZ3JpY3VsdHVy/ZS1UZWNobm9sb2d5/LmpwZw",
    features: ["Crop Advisory", "Market Linkage", "AI Disease Detection", "Contract Farming"]
  },
  {
    title: "IT Services",
    desc: "Digital tools & tech solutions",
    shortDesc: "Client management, GST billing, project tracking, team tools",
    route: "it",
    image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600",
    features: ["GST Billing", "Project Tracking", "Team Management", "Client CRM"]
  }
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50 py-16 px-4">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Choose Your Service
        </h1>
        <p className="text-gray-600">
          Empowering villages with digital solutions.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer"
            onClick={() => navigate(`/${service.route}`)}
          >

            {/* Image */}
            <div className="relative h-48 overflow-hidden group">
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Title on image */}
              <h3 className="absolute bottom-3 left-3 text-white text-lg font-semibold">
                {service.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-5">

              <p className="text-gray-600 text-sm mb-2">
                {service.desc}
              </p>

              <p className="text-gray-500 text-xs mb-4">
                {service.shortDesc}
              </p>

              {/* Features */}
              <ul className="text-xs text-gray-600 mb-4 space-y-1">
                {service.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>

             

            </div>

          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default ServicesSection;