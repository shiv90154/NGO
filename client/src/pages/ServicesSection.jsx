import React from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    title: "Education",
    desc: "Access courses, learning tools",
    shortDesc: "Learn anytime, anywhere",
    route: "education",
    image: "https://images.pexels.com/photos/4145197/pexels-photo-4145197.jpeg",
    color: "from-orange-500 to-red-600",
    icon: "📚"
  },
  {
    title: "Finance",
    desc: "Manage money easily",
    shortDesc: "Smart banking & payments",
    route: "finance",
    image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg",
    color: "from-green-500 to-emerald-600",
    icon: "💰"
  },
  {
    title: "Healthcare",
    desc: "Doctor & health services",
    shortDesc: "24/7 medical assistance",
    route: "health",
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg",
    color: "from-blue-500 to-cyan-600",
    icon: "🏥"
  },
  {
    title: "News",
    desc: "Latest local updates",
    shortDesc: "Stay informed daily",
    route: "news",
    image: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg",
    color: "from-purple-500 to-pink-600",
    icon: "📰"
  },
  {
    title: "Agriculture",
    desc: "Smart farming help",
    shortDesc: "AI-powered crop advice",
    route: "agriculture",
    image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg",
    color: "from-lime-500 to-green-600",
    icon: "🌾"
  },
  {
    title: "IT Services",
    desc: "Digital business tools",
    shortDesc: "Grow your business",
    route: "it",
    image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
    color: "from-indigo-500 to-purple-600",
    icon: "💻"
  }
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto w-full">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer group"
            onClick={() => navigate(`/${service.route}`)}
          >
            <div className="relative h-[200px] sm:h-[220px] md:h-[260px] w-full">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
              />
              
              <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-80 group-hover:opacity-90 transition duration-300`}></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition duration-300"></div>
              
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                <div className="mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-lg sm:text-xl">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                  {service.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-white/90 mb-1 sm:mb-2">
                  {service.desc}
                </p>
                
                <p className="text-xs text-white/70 mb-2 sm:mb-3">
                  {service.shortDesc}
                </p>
                
                <button className="inline-flex items-center gap-2 text-xs sm:text-sm bg-white/20 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full w-fit hover:bg-white/30 transition-all duration-300">
                  Explore Now
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition duration-1000"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;