// Home.jsx - Modern UI with Tricolor Theme (Saffron, White, Green)
// Indian Village & People Theme | Fully Responsive | No External Animation Libs

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ----------------------------- CONSTANTS -----------------------------
const COLORS = {
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#138808',
  darkGreen: '#0a4a2f',
  darkSaffron: '#8B3A00',
  lightSaffron: '#FFE5CC',
  lightGreen: '#E8F5E9',
};

const coreModules = [
  { icon: '🎓', title: 'Education', desc: 'Online courses, live classes, test series, certificates, and teacher earnings dashboard.', color: '#FF9933', path: '/services/education' },
  { icon: '🏥', title: 'Healthcare', desc: 'Doctor search, video consultation, health records, prescription & AI disease detection.', color: '#138808', path: '/services/healthcare' },
  { icon: '🌾', title: 'Agriculture', desc: 'Farmer registration, crop management, product selling, AI crop disease detection.', color: '#FF9933', path: '/services/agriculture' },
  { icon: '💰', title: 'Finance', desc: 'Digital wallet, money transfer, AEPS, bill payments, loans & EMI system.', color: '#138808', path: '/services/finance' },
  { icon: '📺', title: 'News & Media', desc: 'News posting, video editing, live streaming, ads & monetization platform.', color: '#FF9933', path: '/services/media' },
  { icon: '💼', title: 'CRM & IT', desc: 'Client management, GST billing, project tracking, and team management tools.', color: '#138808', path: '/services/crm' },
  { icon: '🏪', title: 'Village Store', desc: 'Ayurvedic products, agricultural goods, digital services, product exchange system.', color: '#FF9933', path: '/services/store' },
  { icon: '🤝', title: 'Franchise & MLM', desc: 'Multi-level income distribution, weekly payouts, team hierarchy earnings.', color: '#138808', path: '/services/franchise' },
];

const subscriptionPlans = [
  { name: 'Education Plan', price: '₹300 - ₹600', features: ['Full course access', 'Live classes', 'Test series', 'Certificates'], icon: '📚', popular: false },
  { name: 'Health Plan', price: '₹200 - ₹2200', features: ['Doctor consultations', 'Health records', 'AI diagnostics', 'Medicine delivery'], icon: '🩺', popular: true },
  { name: 'Agriculture Plan', price: '₹1200+', features: ['Crop advisory', 'Market linkage', 'AI disease detection', 'Contract farming'], icon: '🌾', popular: false },
];

const initiatives = [
  { title: 'Digital Literacy Mission', desc: 'Empowering rural India with digital skills and computer education.', tag: 'Education', icon: '💻' },
  { title: 'Ayushman Telehealth', desc: 'Affordable healthcare consultations via video and AI support.', tag: 'Healthcare', icon: '🏥' },
  { title: 'Smart Kisan Samriddhi', desc: 'Real-time crop advisories and direct market access for farmers.', tag: 'Agriculture', icon: '🚜' },
  { title: 'Jan Dhan Fintech', desc: 'Banking, AEPS, and micro-loans for every village citizen.', tag: 'Finance', icon: '💰' },
  { title: 'Gramin Media Network', desc: 'Local news, live events, and monetization for content creators.', tag: 'Media', icon: '📡' },
  { title: 'e-Panchayat ERP', desc: 'GST billing, project tracking, and digital governance for local bodies.', tag: 'CRM & IT', icon: '🏛️' },
];

const testimonials = [
  { name: 'Ramesh Kumar', role: 'Farmer, Uttar Pradesh', text: 'The agriculture module helped me get real-time weather alerts and sell my produce directly. My income has increased by 30%!', rating: 5, avatar: '👨‍🌾' },
  { name: 'Priya Sharma', role: 'Student, Bihar', text: 'Education plan is a game-changer! I access live classes and study materials easily.', rating: 5, avatar: '👩‍🎓' },
  { name: 'Dr. Anil Mehta', role: 'Doctor, Rajasthan', text: 'Ayushman Telehealth allows me to consult patients in remote areas. The platform is intuitive and reliable.', rating: 4, avatar: '👨‍⚕️' },
];

// ----------------------------- HELPER COMPONENTS -----------------------------
const TricolorBar = React.memo(() => (
  <div className="fixed top-0 left-0 w-full h-1.5 flex z-50">
    <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.saffron }} />
    <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.white }} />
    <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.green }} />
  </div>
));

const ScrollIndicator = React.memo(() => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
      <div className="w-1 h-2 bg-white rounded-full mt-2" />
    </div>
  </div>
));

const StatsBar = React.memo(() => {
  const stats = [
    { label: 'LIVE USERS', value: '2,34,567+', icon: '👥' },
    { label: 'TODAY\'S SERVICES', value: '1,23,456', icon: '⚡' },
    { label: 'SATISFACTION', value: '98.5%', icon: '😊' },
    { label: 'VILLAGES COVERED', value: '1,25,000+', icon: '🏘️' },
  ];
  return (
    <div className="relative -mt-12 z-20 container mx-auto px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl md:text-2xl font-bold" style={{ color: COLORS.darkGreen }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const SectionHeading = React.memo(({ title, subtitle, light = false }) => (
  <div className="text-center mb-12">
    <div className="inline-block mb-4">
      <div className="flex gap-1">
        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: COLORS.saffron }} />
        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: COLORS.white }} />
        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: COLORS.green }} />
      </div>
    </div>
    <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${light ? 'text-white' : 'text-gray-800'}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`max-w-2xl mx-auto text-base md:text-lg ${light ? 'text-gray-100' : 'text-gray-600'}`}>
        {subtitle}
      </p>
    )}
  </div>
));

const CoreModuleCard = React.memo(({ icon, title, desc, color }) => (
  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
    <div className="h-2 w-full" style={{ backgroundColor: color }} />
    <div className="p-6 text-center">
      <div className="text-5xl mb-4 inline-block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.darkSaffron }}>{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      <button className="mt-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: color }}>
        Explore →
      </button>
    </div>
  </div>
));

const SubscriptionCard = React.memo(({ name, price, features, icon, popular, onNavigate, cta }) => (
  <div className={`relative bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${popular ? 'ring-2 ring-[#FF9933]' : ''}`}>
    {popular && (
      <div className="absolute top-0 right-0 bg-[#FF9933] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
        POPULAR
      </div>
    )}
    <div className="p-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.darkSaffron }}>{name}</h3>
      <div className="text-3xl font-bold my-3" style={{ color: COLORS.saffron }}>{price}</div>
      <ul className="text-gray-600 space-y-2 my-4 text-left">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="text-green-600">✓</span> {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onNavigate(cta)}
        className="w-full py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
        style={{ background: `linear-gradient(135deg, ${COLORS.saffron}, ${COLORS.darkSaffron})`, color: 'white' }}
      >
        Subscribe Now
      </button>
    </div>
  </div>
));

const InitiativeCard = React.memo(({ title, desc, tag, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
    <div className="flex items-start gap-4">
      <div className="text-3xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex-1">
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: COLORS.lightSaffron, color: COLORS.darkSaffron }}>
          {tag}
        </span>
        <h3 className="text-lg font-bold mt-2 mb-1" style={{ color: COLORS.darkGreen }}>{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  </div>
));

const TestimonialCard = React.memo(({ name, role, text, rating, avatar }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-4xl">{avatar}</div>
      <div>
        <div className="font-bold text-gray-800">{name}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
    <p className="text-gray-600 italic text-sm leading-relaxed">"{text}"</p>
    <div className="mt-3 flex" style={{ color: COLORS.saffron }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>
  </div>
));

// ----------------------------- MAIN COMPONENT -----------------------------
const Home = () => {
  const navigate = useNavigate();

  const handleExplore = useCallback(() => {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <TricolorBar />
      <Header />

      {/* Hero Section - Green Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.green }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src="https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Indian village landscape"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-20">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 tracking-wider">
              🇮🇳 GOVERNMENT OF INDIA INITIATIVE
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
              Samraddh Bharat
            </h1>
            <p className="text-2xl md:text-4xl font-light text-white mb-4">समृद्ध भारत · विकसित भारत</p>
            <p className="text-xl text-gray-100 mb-2">Integrated Digital Management System</p>
            <p className="text-lg text-gray-200 mb-8">Web Portal + Mobile Application | Village to State Level Digital Governance</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleExplore}
                className="px-8 py-3 rounded-xl font-semibold text-lg shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-white text-green-700 hover:bg-gray-100"
              >
                Explore Modules
              </button>
              <button
                onClick={() => handleNavigate('/register')}
                className="px-8 py-3 rounded-xl font-semibold text-lg border-2 border-white text-white hover:bg-white hover:text-green-700 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <ScrollIndicator />
      </section>

      {/* Stats Bar */}
      <StatsBar />

      {/* Mission Section - White Background */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex gap-1 mb-4">
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: COLORS.saffron }} />
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: COLORS.green }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.darkGreen }}>
                Welcome to Samraddh Bharat Foundation
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Samraddh Bharat Foundation is a unified digital ecosystem integrating Education, Healthcare, Agriculture,
                Finance, NGO operations, and Media into a single platform. Our mission is to provide seamless, transparent,
                and efficient delivery of services from village to state level, ensuring <strong>"Sabka Saath, Sabka Vikas, Sabka Vishwas"</strong>
                through technology-driven governance.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Indian village community"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section id="modules" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <SectionHeading 
            title="Integrated Core Modules" 
            subtitle="Complete digital ecosystem for governance and citizen services" 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreModules.map((module, idx) => (
              <CoreModuleCard key={idx} {...module} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading title="How It Works" subtitle="Simple steps to access government services online" />
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Register', desc: 'Sign up with your mobile number or Aadhaar', icon: '📝', color: COLORS.saffron },
                  { step: 2, title: 'Choose Service', desc: 'Select from 50+ digital services', icon: '🔍', color: COLORS.green },
                  { step: 3, title: 'Get Benefits', desc: 'Receive certificates, payments, or assistance', icon: '🎁', color: COLORS.saffron },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all group">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}20` }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: item.color }}>Step {item.step}</div>
                      <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4100010/pexels-photo-4100010.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Farmer using smartphone"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans - Saffron Background */}
      <section className="py-20 px-4" style={{ backgroundColor: COLORS.saffron }}>
        <div className="container mx-auto">
          <SectionHeading 
            title="Membership & Subscription Plans" 
            subtitle="Affordable plans for every citizen — Education, Health, Agriculture" 
            light={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, idx) => (
              <SubscriptionCard key={idx} {...plan} onNavigate={handleNavigate} cta={plan.cta} />
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <SectionHeading title="Flagship Initiatives" subtitle="Transforming India — One initiative at a time" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((item, idx) => (
              <InitiativeCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Highlight */}
      <section className="py-16 px-4" style={{ backgroundColor: COLORS.lightGreen }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="inline-block p-3 bg-[#FF9933]/10 rounded-full mb-4">
              <span className="text-4xl">🤝</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.darkGreen }}>Franchise & MLM System</h2>
            <p className="text-lg text-gray-600 mb-6">Multi-level income distribution · Weekly payouts · Team hierarchy earnings</p>
            <button
              onClick={() => handleNavigate('/franchise')}
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.darkGreen})` }}
            >
              Become a Partner →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading title="What Citizens Say" subtitle="Real stories from real people" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <TestimonialCard key={idx} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/2664834/pexels-photo-2664834.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Indian rural family"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: COLORS.darkGreen }}>About Samraddh Bharat Foundation</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border-l-4" style={{ borderLeftColor: COLORS.saffron }}>
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.darkSaffron }}>Our Vision</h3>
                  <p className="text-gray-600">To create a "Samraddh Bharat" (Prosperous India) where every citizen has equal access to government services, opportunities, and benefits through technology-driven governance.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border-l-4" style={{ borderLeftColor: COLORS.green }}>
                  <div className="text-4xl mb-2">🚀</div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.darkGreen }}>Our Mission</h3>
                  <p className="text-gray-600">Leveraging digital infrastructure to deliver citizen-centric services, promote transparency, and ensure last-mile delivery of government schemes and foundation programs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading title="Need Assistance?" subtitle="Samraddh Bharat Helpline is available 24/7" />
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="tel:18001234567"
                className="flex items-center justify-center gap-3 bg-[#FF9933] text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#e68900] transition-all hover:scale-105"
              >
                📞 Call Helpline: 1800-123-4567
              </a>
              <a
                href="mailto:support@samraddhbharat.gov.in"
                className="flex items-center justify-center gap-3 border-2 border-[#138808] text-[#138808] px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#138808] hover:text-white transition-all hover:scale-105"
              >
                ✉️ Send Email
              </a>
            </div>
            <div className="mt-8 text-center text-gray-500">
              <p className="font-semibold">Samraddh Bharat Foundation - Government of India Initiative</p>
              <p className="text-sm">support@samraddhbharat.gov.in</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;