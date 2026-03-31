import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  // State for language selection
  const [language, setLanguage] = useState('english');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Translations object
  const translations = {
    english: {
      home: "Home",
      services: "Services",
      schemes: "Schemes",
      about: "About",
      contact: "Contact",
      login: "Login",
      govOfIndia: "GOVERNMENT OF INDIA",
      samraddhBharat: "Samraddh Bharat",
      samraddhBharatHindi: "समृद्ध भारत - विकसित भारत",
      tagline: "Your Gateway to a Prosperous India",
      taglineSub: "Digital Services for Every Citizen",
      exploreServices: "Explore Services",
      applySchemes: "Apply for Schemes",
      welcome: "Welcome to Samraddh Bharat",
      missionText: "Samraddh Bharat (समृद्ध भारत) is a flagship digital initiative by the Government of India aimed at transforming governance through technology. Our mission is to provide seamless, transparent, and efficient delivery of government services to every citizen, ensuring \"Sabka Saath, Sabka Vikas, Sabka Vishwas\".",
      digitalServices: "Digital Services",
      empoweringText: "Empowering citizens with 50+ online services at your fingertips",
      documents: "Documents & Certificates",
      documentsDesc: "Apply for birth, income, caste, and domicile certificates",
      taxFinance: "Tax & Finance",
      taxFinanceDesc: "Pay direct/indirect taxes, check refunds, file returns",
      healthcare: "Healthcare Services",
      healthcareDesc: "Ayushman Bharat, e-Hospital, health insurance schemes",
      education: "Education & Scholarships",
      educationDesc: "National Scholarships, exams, results, and e-learning",
      housing: "Housing & Urban",
      housingDesc: "PMAY applications, property registration, utilities",
      agriculture: "Agriculture & Rural",
      agricultureDesc: "PM-KISAN, soil health cards, crop insurance",
      security: "Security & Justice",
      securityDesc: "e-Courts, police services, passport applications",
      employment: "Employment & Labour",
      employmentDesc: "Job portals, skill development, EPFO services",
      flagshipSchemes: "Flagship Schemes",
      transformingIndia: "Transforming India - One Scheme at a Time",
      applyNow: "Apply Now",
      learnMore: "Learn More",
      pmKisan: "PM-Kisan Samman Nidhi",
      pmKisanDesc: "₹6000 per year financial benefit to small and marginal farmers",
      ayushman: "Ayushman Bharat Yojana",
      ayushmanDesc: "₹5 lakh health insurance per family for vulnerable sections",
      standUp: "Stand Up India Scheme",
      standUpDesc: "Loans from ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs",
      pmAwas: "PM Awas Yojana",
      pmAwasDesc: "Housing for All - Financial assistance for home construction",
      pmMudra: "PM Mudra Yojana",
      pmMudraDesc: "Loans up to ₹10 lakh for non-corporate, non-farm small enterprises",
      digitalIndia: "Digital India Mission",
      digitalIndiaDesc: "Empowering citizens with digital literacy and online services",
      numbers: "Samraddh Bharat in Numbers",
      digitalServicesCount: "Digital Services",
      citizensServed: "Citizens Served",
      supportAvailable: "Support Available",
      secureTransparent: "Secure & Transparent",
      aboutSamraddh: "About Samraddh Bharat",
      ourVision: "Our Vision",
      visionText: "To create a \"Samraddh Bharat\" (Prosperous India) where every citizen has equal access to government services, opportunities, and benefits through technology-driven governance.",
      ourMission: "Our Mission",
      missionText2: "Leveraging digital infrastructure as a core competency to deliver citizen-centric services, promote transparency, and ensure last-mile delivery of government schemes.",
      needAssistance: "Need Assistance?",
      helplineText: "Samraddh Bharat Helpline is available 24/7 to assist you with any government services",
      callHelpline: "Call Helpline: 1800-123-4567",
      sendEmail: "Send Email",
      emailSupport: "support@samraddhbharat.gov.in",
      govInitiative: "Government of India Initiative",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of Use",
      accessibility: "Accessibility",
      sitemap: "Sitemap",
      faq: "FAQ",
      copyright: "© 2025 Samraddh Bharat Portal. All rights reserved. | A Digital India Initiative",
      liveUpdates: "Live Updates",
      activeUsers: "Active Users",
      servicesToday: "Services Today",
      satisfaction: "Satisfaction Rate",
    },
    hindi: {
      home: "होम",
      services: "सेवाएं",
      schemes: "योजनाएं",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      login: "लॉगिन",
      govOfIndia: "भारत सरकार",
      samraddhBharat: "समृद्ध भारत",
      samraddhBharatHindi: "समृद्ध भारत - विकसित भारत",
      tagline: "एक समृद्ध भारत का प्रवेश द्वार",
      taglineSub: "हर नागरिक के लिए डिजिटल सेवाएं",
      exploreServices: "सेवाएं देखें",
      applySchemes: "योजनाओं के लिए आवेदन करें",
      welcome: "समृद्ध भारत में आपका स्वागत है",
      missionText: "समृद्ध भारत भारत सरकार की एक प्रमुख डिजिटल पहल है जिसका उद्देश्य प्रौद्योगिकी के माध्यम से शासन को बदलना है। हमारा मिशन हर नागरिक को सरकारी सेवाओं की सहज, पारदर्शी और कुशल डिलीवरी सुनिश्चित करना है, \"सबका साथ, सबका विकास, सबका विश्वास\"।",
      digitalServices: "डिजिटल सेवाएं",
      empoweringText: "50+ ऑनलाइन सेवाओं के साथ नागरिकों को सशक्त बनाना",
      documents: "दस्तावेज और प्रमाण पत्र",
      documentsDesc: "जन्म, आय, जाति और डोमिसाइल प्रमाण पत्र के लिए आवेदन करें",
      taxFinance: "कर और वित्त",
      taxFinanceDesc: "प्रत्यक्ष/अप्रत्यक्ष कर चुकाएं, रिफंड चेक करें, रिटर्न दाखिल करें",
      healthcare: "स्वास्थ्य सेवाएं",
      healthcareDesc: "आयुष्मान भारत, ई-हॉस्पिटल, स्वास्थ्य बीमा योजनाएं",
      education: "शिक्षा और छात्रवृत्ति",
      educationDesc: "राष्ट्रीय छात्रवृत्ति, परीक्षाएं, परिणाम और ई-लर्निंग",
      housing: "आवास और शहरी",
      housingDesc: "पीएमएवाई आवेदन, संपत्ति पंजीकरण, उपयोगिताएं",
      agriculture: "कृषि और ग्रामीण",
      agricultureDesc: "पीएम-किसान, मृदा स्वास्थ्य कार्ड, फसल बीमा",
      security: "सुरक्षा और न्याय",
      securityDesc: "ई-कोर्ट, पुलिस सेवाएं, पासपोर्ट आवेदन",
      employment: "रोजगार और श्रम",
      employmentDesc: "जॉब पोर्टल, कौशल विकास, ईपीएफओ सेवाएं",
      flagshipSchemes: "प्रमुख योजनाएं",
      transformingIndia: "भारत को बदलना - एक योजना एक बार में",
      applyNow: "अभी आवेदन करें",
      learnMore: "और जानें",
      pmKisan: "पीएम-किसान सम्मान निधि",
      pmKisanDesc: "छोटे और सीमांत किसानों के लिए ₹6000 प्रति वर्ष वित्तीय लाभ",
      ayushman: "आयुष्मान भारत योजना",
      ayushmanDesc: "कमजोर वर्गों के लिए प्रति परिवार ₹5 लाख स्वास्थ्य बीमा",
      standUp: "स्टैंड अप इंडिया योजना",
      standUpDesc: "एससी/एसटी और महिला उद्यमियों के लिए ₹10 लाख से ₹1 करोड़ तक के ऋण",
      pmAwas: "पीएम आवास योजना",
      pmAwasDesc: "सभी के लिए आवास - घर निर्माण के लिए वित्तीय सहायता",
      pmMudra: "पीएम मुद्रा योजना",
      pmMudraDesc: "गैर-कॉर्पोरेट, गैर-कृषि छोटे उद्यमों के लिए ₹10 लाख तक के ऋण",
      digitalIndia: "डिजिटल इंडिया मिशन",
      digitalIndiaDesc: "डिजिटल साक्षरता और ऑनलाइन सेवाओं के साथ नागरिकों को सशक्त बनाना",
      numbers: "समृद्ध भारत आंकड़ों में",
      digitalServicesCount: "डिजिटल सेवाएं",
      citizensServed: "नागरिक सेवा प्राप्त",
      supportAvailable: "सहायता उपलब्ध",
      secureTransparent: "सुरक्षित और पारदर्शी",
      aboutSamraddh: "समृद्ध भारत के बारे में",
      ourVision: "हमारा दृष्टिकोण",
      visionText: "एक \"समृद्ध भारत\" बनाना जहां हर नागरिक को प्रौद्योगिकी-संचालित शासन के माध्यम से सरकारी सेवाओं, अवसरों और लाभों तक समान पहुंच हो।",
      ourMission: "हमारा मिशन",
      missionText2: "नागरिक-केंद्रित सेवाओं को वितरित करने, पारदर्शिता को बढ़ावा देने और सरकारी योजनाओं की अंतिम-मील डिलीवरी सुनिश्चित करने के लिए डिजिटल इंफ्रास्ट्रक्चर का लाभ उठाना।",
      needAssistance: "सहायता चाहिए?",
      helplineText: "समृद्ध भारत हेल्पलाइन किसी भी सरकारी सेवा में आपकी सहायता के लिए 24/7 उपलब्ध है",
      callHelpline: "कॉल हेल्पलाइन: 1800-123-4567",
      sendEmail: "ईमेल भेजें",
      emailSupport: "support@samraddhbharat.gov.in",
      govInitiative: "भारत सरकार की पहल",
      privacyPolicy: "गोपनीयता नीति",
      termsOfUse: "उपयोग की शर्तें",
      accessibility: "पहुंचनीयता",
      sitemap: "साइटमैप",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      copyright: "© 2025 समृद्ध भारत पोर्टल। सर्वाधिकार सुरक्षित। | एक डिजिटल इंडिया पहल",
      liveUpdates: "लाइव अपडेट",
      activeUsers: "सक्रिय उपयोगकर्ता",
      servicesToday: "आज की सेवाएं",
      satisfaction: "संतुष्टि दर",
    }
  };

  const t = translations[language];
  const toggleLanguage = () => setLanguage(prev => prev === 'english' ? 'hindi' : 'english');

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

  const serviceCardVariants = (delay) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header / Navigation with Glassmorphism */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#1e3a5f]/95 backdrop-blur-md shadow-xl' : 'bg-[#1e3a5f]'
        } text-white`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-4">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-[#ff8c42] to-[#ff6b22] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              🇮🇳
            </motion.div>
            <div>
              <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t.samraddhBharat}
              </span>
              <p className="text-xs text-gray-300 hidden sm:block">{t.samraddhBharatHindi}</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
            >
              {language === 'english' ? 'हिंदी' : 'English'}
            </motion.button>

            <nav className="hidden md:flex gap-6 items-center">
              {['home', 'services', 'schemes', 'about', 'contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  whileHover={{ scale: 1.1 }}
                  className="hover:text-[#ffd966] transition-colors relative group"
                >
                  {t[item]}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8c42] transition-all group-hover:w-full"></span>
                </motion.a>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {t.login}
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Parallax Effect */}
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
              {t.govOfIndia}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-2 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t.samraddhBharat}
            </h1>
            <p className="text-3xl md:text-4xl font-light text-gray-200 mb-4">{t.samraddhBharatHindi}</p>
            <p className="text-xl md:text-2xl mb-4 text-gray-200 max-w-3xl mx-auto">
              {t.tagline}
            </p>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
              {t.taglineSub}
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
              className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl transition-all"
            >
              {t.exploreServices}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#1e3a5f] transition-all backdrop-blur-sm"
            >
              {t.applySchemes}
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
            <div>
              <p className="text-xs font-semibold">{t.liveUpdates}</p>
              <p className="text-sm font-bold">2,34,567 {t.activeUsers}</p>
            </div>
            <div>
              <p className="text-xs font-semibold">{t.servicesToday}</p>
              <p className="text-sm font-bold">1,23,456+</p>
            </div>
            <div>
              <p className="text-xs font-semibold">{t.satisfaction}</p>
              <p className="text-sm font-bold">98.5%</p>
            </div>
            <div>
              <p className="text-xs font-semibold">24/7 Support</p>
              <p className="text-sm font-bold">Always Active</p>
            </div>
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
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4"
            variants={fadeInUp}
          >
            {t.welcome}
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] mx-auto mb-6"
            variants={fadeInUp}
          ></motion.div>
          <motion.p 
            className="text-lg text-gray-600 leading-relaxed"
            variants={fadeInUp}
          >
            {t.missionText}
          </motion.p>
        </div>
      </motion.section>

      {/* Services Section with 3D Cards */}
      <section id="services" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">{t.digitalServices}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.empoweringText}</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: "📄", title: t.documents, desc: t.documentsDesc },
              { icon: "💰", title: t.taxFinance, desc: t.taxFinanceDesc },
              { icon: "🏥", title: t.healthcare, desc: t.healthcareDesc },
              { icon: "📚", title: t.education, desc: t.educationDesc },
              { icon: "🏠", title: t.housing, desc: t.housingDesc },
              { icon: "🌾", title: t.agriculture, desc: t.agricultureDesc },
              { icon: "👮", title: t.security, desc: t.securityDesc },
              { icon: "💼", title: t.employment, desc: t.employmentDesc },
            ].map((service, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={serviceCardVariants(index * 0.1)}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all cursor-pointer group"
              >
                <motion.div 
                  className="text-6xl mb-4 inline-block"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
                <motion.div 
                  className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <span className="text-[#ff8c42] text-sm font-semibold">Learn More →</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Schemes Section with Animated Cards */}
      <section id="schemes" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">{t.flagshipSchemes}</h2>
            <p className="text-gray-600">{t.transformingIndia}</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: t.pmKisan, desc: t.pmKisanDesc },
              { title: t.ayushman, desc: t.ayushmanDesc },
              { title: t.standUp, desc: t.standUpDesc },
              { title: t.pmAwas, desc: t.pmAwasDesc },
              { title: t.pmMudra, desc: t.pmMudraDesc },
              { title: t.digitalIndia, desc: t.digitalIndiaDesc },
            ].map((scheme, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-l-4 border-[#ff8c42] shadow-lg transition-all cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{scheme.title}</h3>
                <p className="text-gray-600 mb-4">{scheme.desc}</p>
                <motion.button 
                  whileHover={{ x: 10 }}
                  className="text-[#ff8c42] font-semibold hover:text-[#e6732e] transition-colors"
                >
                  {t.applyNow} →
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section className="bg-gradient-to-r from-[#1e3a5f] to-[#2a6b9e] text-white py-20 px-4">
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t.numbers}
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: t.digitalServicesCount },
              { value: "25 Cr+", label: t.citizensServed },
              { value: "24/7", label: t.supportAvailable },
              { value: "100%", label: t.secureTransparent },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold mb-2 text-[#ff8c42]">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center text-[#1e3a5f] mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t.aboutSamraddh}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: t.ourVision, text: t.visionText, icon: "🎯" },
              { title: t.ourMission, text: t.missionText2, icon: "🚀" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-[#1e3a5f] mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">{t.needAssistance}</h2>
            <p className="text-gray-600 text-lg">{t.helplineText}</p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                📞 {t.callHelpline}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#1e3a5f] hover:text-white transition-all"
              >
                ✉️ {t.sendEmail}
              </motion.button>
            </div>
            <div className="mt-8 text-center text-gray-500">
              <p className="font-semibold">{t.samraddhBharat} - {t.govInitiative}</p>
              <p>{t.emailSupport}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1a24] text-gray-400 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <motion.div 
              className="text-center md:text-left"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff8c42] to-[#ff6b22] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  🇮🇳
                </div>
                <div>
                  <span className="text-white font-semibold text-lg">{t.samraddhBharat}</span>
                  <p className="text-xs text-gray-400">{t.samraddhBharatHindi}</p>
                </div>
              </div>
              <p className="text-sm">{t.govInitiative}</p>
            </motion.div>
            <div className="flex gap-6 flex-wrap justify-center">
              {[t.privacyPolicy, t.termsOfUse, t.accessibility, t.sitemap, t.faq].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, color: "#ff8c42" }}
                  className="hover:text-white transition-colors text-sm cursor-pointer"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
          <motion.div 
            className="text-center pt-6 border-t border-gray-700 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.copyright}
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Home;