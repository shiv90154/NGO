// Home.jsx - Optimized Professional Version | Indian Village & Farmer Theme
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
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
};

const ANIMATION_VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  },
  card: (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
  }),
};

// Data arrays (unchanged)
const coreModules = [
  { icon: '🎓', title: 'Education', desc: 'Online courses, live classes, test series, certificates, and teacher earnings dashboard.', path: '/services/education' },
  { icon: '🏥', title: 'Healthcare', desc: 'Doctor search, video consultation, health records, prescription & AI disease detection.', path: '/services/healthcare' },
  { icon: '🌾', title: 'Agriculture', desc: 'Farmer registration, crop management, product selling, AI crop disease detection.', path: '/services/agriculture' },
  { icon: '💰', title: 'Finance', desc: 'Digital wallet, money transfer, AEPS, bill payments, loans & EMI system.', path: '/services/finance' },
  { icon: '📺', title: 'News & Media', desc: 'News posting, video editing, live streaming, ads & monetization platform.', path: '/services/media' },
  { icon: '💼', title: 'CRM & IT', desc: 'Client management, GST billing, project tracking, and team management tools.', path: '/services/crm' },
  { icon: '🏪', title: 'Village Store', desc: 'Ayurvedic products, agricultural goods, digital services, product exchange system.', path: '/services/store' },
  { icon: '🤝', title: 'Franchise & MLM', desc: 'Multi-level income distribution, weekly payouts, team hierarchy earnings.', path: '/services/franchise' },
];

const subscriptionPlans = [
  { name: 'Education Plan', price: '₹300 - ₹600', features: ['Full course access', 'Live classes', 'Test series', 'Certificates'], cta: '/subscribe/education' },
  { name: 'Health Plan', price: '₹200 - ₹2200', features: ['Doctor consultations', 'Health records', 'AI diagnostics', 'Medicine delivery'], cta: '/subscribe/health' },
  { name: 'Agriculture Plan', price: '₹1200+', features: ['Crop advisory', 'Market linkage', 'AI disease detection', 'Contract farming'], cta: '/subscribe/agriculture' },
];

const initiatives = [
  { title: 'Digital Literacy Mission', desc: 'Empowering rural India with digital skills and computer education.', tag: 'Education', cta: '/initiatives/digital-literacy' },
  { title: 'Ayushman Telehealth', desc: 'Affordable healthcare consultations via video and AI support.', tag: 'Healthcare', cta: '/initiatives/ayushman' },
  { title: 'Smart Kisan Samriddhi', desc: 'Real-time crop advisories and direct market access for farmers.', tag: 'Agriculture', cta: '/initiatives/smart-kisan' },
  { title: 'Jan Dhan Fintech', desc: 'Banking, AEPS, and micro-loans for every village citizen.', tag: 'Finance', cta: '/initiatives/jan-dhan' },
  { title: 'Gramin Media Network', desc: 'Local news, live events, and monetization for content creators.', tag: 'Media', cta: '/initiatives/gramin-media' },
  { title: 'e-Panchayat ERP', desc: 'GST billing, project tracking, and digital governance for local bodies.', tag: 'CRM & IT', cta: '/initiatives/panchayat-erp' },
];

const testimonials = [
  { name: 'Ramesh Kumar', role: 'Farmer, Uttar Pradesh', text: 'Samraddh Bharat\'s agriculture module helped me get real-time weather alerts and sell my produce directly. My income has increased by 30%!', rating: 5, avatar: '👨‍🌾' },
  { name: 'Priya Sharma', role: 'Student, Bihar', text: 'The education plan is a game-changer! I access live classes and study materials for free. The digital literacy mission empowered my entire village.', rating: 5, avatar: '👩‍🎓' },
  { name: 'Dr. Anil Mehta', role: 'Doctor, Rajasthan', text: 'Ayushman Telehealth allows me to consult patients in remote areas. The platform is intuitive and reliable.', rating: 4, avatar: '👨‍⚕️' },
];

// ----------------------------- HELPER COMPONENTS (Optimized) -----------------------------
const TricolorBar = React.memo(() => (
  <div className="fixed top-0 left-0 w-full h-1.5 flex z-50">
    <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.saffron }} />
    <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.white }} />
    <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.green }} />
  </div>
));

const ScrollIndicator = React.memo(() => (
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ repeat: Infinity, duration: 1.5 }}
  >
    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
      <div className="w-1 h-2 bg-white rounded-full mt-2" />
    </div>
  </motion.div>
));

const StatsBar = React.memo(() => (
  <motion.div
    className="py-3 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-bold" style={{ color: COLORS.darkGreen }}>
        <div><p className="text-xs font-semibold">LIVE USERS</p><p className="text-sm">2,34,567+</p></div>
        <div><p className="text-xs font-semibold">TODAY'S SERVICES</p><p className="text-sm">1,23,456</p></div>
        <div><p className="text-xs font-semibold">SATISFACTION</p><p className="text-sm">98.5%</p></div>
        <div><p className="text-xs font-semibold">VILLAGES COVERED</p><p className="text-sm">1,25,000+</p></div>
      </div>
    </div>
  </motion.div>
));

const SectionHeading = React.memo(({ title, subtitle }) => (
  <motion.div variants={ANIMATION_VARIANTS.fadeInUp} className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.darkGreen }}>{title}</h2>
    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-24 h-1 mx-auto mt-4 flex">
      <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.saffron }} />
      <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.white }} />
      <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.green }} />
    </div>
  </motion.div>
));

const CoreModuleCard = React.memo(({ icon, title, desc }) => (
  <motion.div
    variants={ANIMATION_VARIANTS.card}
    whileHover={{ scale: 1.03 }}
    className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all border-t-4"
    style={{ borderTopColor: COLORS.saffron }}
  >
    <motion.div className="text-5xl mb-4 inline-block" whileHover={{ scale: 1.1, rotate: 5 }}>{icon}</motion.div>
    <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.darkSaffron }}>{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </motion.div>
));

const SubscriptionCard = React.memo(({ name, price, features, cta, onNavigate }) => (
  <motion.div variants={ANIMATION_VARIANTS.card} whileHover={{ y: -8 }} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-xl border border-gray-200">
    <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.darkSaffron }}>{name}</h3>
    <div className="text-3xl font-bold my-3" style={{ color: COLORS.saffron }}>{price}</div>
    <ul className="text-gray-600 space-y-2 my-4">
      {features.map((feature, i) => <li key={i} className="flex items-center gap-2">✓ {feature}</li>)}
    </ul>
    <button onClick={() => onNavigate(cta)} className="w-full text-white py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.green})` }}>
      Subscribe Now
    </button>
  </motion.div>
));

const InitiativeCard = React.memo(({ title, desc, tag }) => (
  <motion.div variants={ANIMATION_VARIANTS.fadeInUp} whileHover={{ scale: 1.02 }} className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4" style={{ borderLeftColor: COLORS.green }}>
    <span className="text-xs font-bold uppercase" style={{ color: COLORS.saffron }}>{tag}</span>
    <h3 className="text-xl font-semibold my-2" style={{ color: COLORS.darkSaffron }}>{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </motion.div>
));

const TestimonialCard = React.memo(({ name, role, text, rating, avatar }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-4xl">{avatar}</div>
      <div>
        <div className="font-bold" style={{ color: COLORS.darkGreen }}>{name}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
    <p className="text-gray-600 italic mb-3">"{text}"</p>
    <div style={{ color: COLORS.saffron }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
  </motion.div>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <TricolorBar />
      <Header />

      {/* Hero Section - Indian Village Farmer Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2b3d] via-[#1e4a76] to-[#2a6b9e]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/235725/pexels-photo-235725.jpeg?auto=compress&cs=tinysrgb&w=1600')"
            }}
          />
        </div>

        {/* Hero tricolor stripes */}
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="w-1/3 h-full bg-[#FF9933]" />
          <div className="w-1/3 h-full bg-white" />
          <div className="w-1/3 h-full bg-[#138808]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#ff8c42] font-bold text-lg tracking-wider inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              🇮🇳 GOVERNMENT OF INDIA INITIATIVE 🇮🇳
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-2 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Samraddh Bharat
            </h1>
            <p className="text-3xl md:text-4xl font-light text-gray-200 mb-4">समृद्ध भारत · विकसित भारत</p>
            <p className="text-xl md:text-2xl mb-4 text-gray-200">Integrated Digital Management System</p>
            <p className="text-lg mb-8 text-gray-300">Web Portal + Mobile Application | Village to State Level Digital Governance</p>
          </motion.div>

          <motion.div className="flex gap-4 justify-center flex-col sm:flex-row" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.95 }} onClick={handleExplore} className="px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl text-white" style={{ background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.white}, ${COLORS.green})`, backgroundSize: '150% auto' }}>
              Explore Modules
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleNavigate('/register')} className="border-2 border-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white backdrop-blur-sm transition-all">
              Get Started
            </motion.button>
          </motion.div>
        </div>
        <ScrollIndicator />
      </section>

      <StatsBar />

      {/* Mission Section - Indian Village Image */}
      <motion.section className="py-20 px-4 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ANIMATION_VARIANTS.fadeInUp}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.darkGreen }}>Welcome to Samraddh Bharat Foundation</h2>
              <div className="w-24 h-1 flex mb-6">
                <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.saffron }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.white }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: COLORS.green }} />
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Samraddh Bharat Foundation is a unified digital ecosystem integrating Education, Healthcare, Agriculture,
                Finance, NGO operations, and Media into a single platform. Our mission is to provide seamless, transparent,
                and efficient delivery of services from village to state level, ensuring "Sabka Saath, Sabka Vikas, Sabka Vishwas"
                through technology-driven governance.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/1650651/pexels-photo-1650651.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Traditional Indian village with mud houses"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Modules Section */}
      <section id="modules" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <SectionHeading title="Integrated Core Modules" subtitle="Complete digital ecosystem for governance and citizen services" />
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={ANIMATION_VARIANTS.staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {coreModules.map((module, idx) => <CoreModuleCard key={idx} {...module} />)}
          </motion.div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <SectionHeading title="Membership & Subscription Plans" subtitle="Affordable plans for every citizen — Education, Health, Agriculture" />
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" variants={ANIMATION_VARIANTS.staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {subscriptionPlans.map((plan, idx) => <SubscriptionCard key={idx} {...plan} onNavigate={handleNavigate} />)}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Farmer using digital tech */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading title="How It Works" subtitle="Simple steps to access government services online" />
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Register', desc: 'Sign up with your mobile number or Aadhaar', icon: '📝' },
                  { step: 2, title: 'Choose Service', desc: 'Select from 50+ digital services', icon: '🔍' },
                  { step: 3, title: 'Get Benefits', desc: 'Receive certificates, payments, or assistance', icon: '🎁' },
                ].map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${COLORS.saffron}20` }}>{item.icon}</div>
                    <div>
                      <div className="text-lg font-bold" style={{ color: COLORS.saffron }}>Step {item.step}</div>
                      <h3 className="text-xl font-semibold" style={{ color: COLORS.darkGreen }}>{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Farmer using smartphone in village"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <SectionHeading title="Flagship Initiatives" subtitle="Transforming India — One initiative at a time" />
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" variants={ANIMATION_VARIANTS.staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {initiatives.map((item, idx) => <InitiativeCard key={idx} {...item} />)}
          </motion.div>
        </div>
      </section>

      {/* Franchise & MLM Highlight */}
      <section className="py-16 px-4 text-center" style={{ background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.white}, ${COLORS.green})` }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="inline-block p-3 bg-white/20 rounded-full mb-4 text-3xl">🤝</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.darkGreen }}>Franchise & MLM System</h2>
            <p className="text-lg mb-6 font-semibold" style={{ color: COLORS.darkGreen }}>Multi-level income distribution · Weekly payouts · Team hierarchy earnings</p>
            <button onClick={() => handleNavigate('/franchise')} className="bg-[#0a4a2f] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition">Become a Partner →</button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading title="What Citizens Say" />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => <TestimonialCard key={idx} {...t} />)}
          </div>
        </div>
      </section>

      {/* About Section - Rural Development Image */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
              <img
                src="https://images.pexels.com/photos/235731/pexels-photo-235731.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Rural Indian family working in field"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: COLORS.darkGreen }}>About Samraddh Bharat Foundation</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl shadow-md border-l-4" style={{ borderLeftColor: COLORS.saffron }}>
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="text-2xl font-semibold mb-2" style={{ color: COLORS.darkSaffron }}>Our Vision</h3>
                  <p className="text-gray-600">To create a "Samraddh Bharat" (Prosperous India) where every citizen has equal access to government services, opportunities, and benefits through technology-driven governance.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl shadow-md border-l-4" style={{ borderLeftColor: COLORS.green }}>
                  <div className="text-4xl mb-2">🚀</div>
                  <h3 className="text-2xl font-semibold mb-2" style={{ color: COLORS.darkGreen }}>Our Mission</h3>
                  <p className="text-gray-600">Leveraging digital infrastructure to deliver citizen-centric services, promote transparency, and ensure last-mile delivery of government schemes and foundation programs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading title="Need Assistance?" subtitle="Samraddh Bharat Helpline is available 24/7 to assist you with any government services" />
          <motion.div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-8 shadow-xl" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-6">
              <a href="tel:18001234567" className="text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all text-center" style={{ background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.green})` }}>
                📞 Call Helpline: 1800-123-4567
              </a>
              <a href="mailto:support@samraddhbharat.gov.in" className="border-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all text-center" style={{ borderColor: COLORS.darkGreen, color: COLORS.darkGreen }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.darkGreen; e.currentTarget.style.color = COLORS.white; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = COLORS.darkGreen; }}>
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