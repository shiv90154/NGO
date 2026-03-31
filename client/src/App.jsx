import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Layout from './components/Layout';

import Login from './pages/Login'
import Logins from './pages/Logins';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import ManageUsers from './pages/ManageUsers';
import ManageRoles from './pages/ManageRoles';
import SystemSettings from './pages/SystemSettings';
import Reports from './pages/Reports';
import Patients from './pages/Patients';
import Prescriptions from './pages/Prescriptions';
import Content from './pages/Content';
import MyCourses from './pages/MyCourses';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Help from './pages/Help';

import StudentDashboard from './student/Student';

import Home from './pages/Home'

// ========== LANGUAGE CONTEXT ==========
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Translation dictionary
const translations = {
  en: {
    // Navbar
    logo: 'SmartManage',
    navHome: 'Home',
    navFeatures: 'Features',
    navModules: 'Modules',
    navAbout: 'About',
    login: 'Login',
    // Hero
    heroHeading: 'All-in-One Smart Management Platform',
    heroSubheading: 'Manage courses, healthcare, agriculture, news, and more — in one powerful dashboard with real-time insights.',
    getStarted: 'Get Started',
    // Features
    featuresTitle: 'Powerful Features',
    featuresSubtitle: 'Everything you need to streamline operations',
    featureRbac: 'Role-Based Access (RBAC)',
    featureRbacDesc: 'Granular permissions for users & admins',
    featureCourses: 'Course Management',
    featureCoursesDesc: 'Create, manage & track courses',
    featureWallet: 'Orders & Wallet System',
    featureWalletDesc: 'Seamless payments & wallet integration',
    featureNews: 'News CMS',
    featureNewsDesc: 'Publish & manage content easily',
    featureHealthcare: 'Healthcare Module',
    featureHealthcareDesc: 'Patient records & appointments',
    featureAgriculture: 'Agriculture Advisory',
    featureAgricultureDesc: 'Smart farming insights',
    featureAnalytics: 'Analytics Dashboard',
    featureAnalyticsDesc: 'Real-time data visualization',
    featureNotifications: 'Notifications System',
    featureNotificationsDesc: 'Multi-channel alerts',
    // Modules
    modulesTitle: 'Specialized Modules',
    modulesSubtitle: 'Tailored solutions for every vertical',
    moduleCourses: 'Courses',
    moduleCoursesDesc: 'Interactive learning paths & certifications',
    moduleOrders: 'Orders',
    moduleOrdersDesc: 'Manage purchases & invoices',
    moduleWallet: 'Wallet',
    moduleWalletDesc: 'Digital wallet & transaction history',
    moduleNews: 'News',
    moduleNewsDesc: 'Curated news & announcements',
    moduleHealthcare: 'Healthcare',
    moduleHealthcareDesc: 'Telemedicine & health records',
    moduleAgriculture: 'Agriculture',
    moduleAgricultureDesc: 'Crop advisory & market rates',
    learnMore: 'Learn More',
    // Analytics
    analyticsTitle: 'Real-time Insights & Analytics',
    activeUsers: 'Active Users',
    revenue: 'Revenue',
    courseCompletion: 'Course Completion',
    activeOrders: 'Active Orders',
    // Security
    securityJwt: 'JWT Authentication',
    securityJwtDesc: 'Secure token-based authentication with refresh tokens',
    securityRbac: 'Role-based Permissions',
    securityRbacDesc: 'Granular access control for every user role',
    securityApi: 'Secure APIs',
    securityApiDesc: 'End-to-end encryption & rate limiting',
    // Testimonials
    testimonialsTitle: 'Trusted by Leaders',
    testimonialsSubtitle: 'What our customers say about us',
    testimonial1Name: 'Priya Sharma',
    testimonial1Role: 'CTO, EduTech',
    testimonial1Content: 'This platform transformed our operations. The analytics dashboard alone saved us 20+ hours weekly.',
    testimonial2Name: 'Amit Kumar',
    testimonial2Role: 'Farm Manager',
    testimonial2Content: 'Agriculture module gives real-time insights. Our yield improved by 35% using their advisory.',
    testimonial3Name: 'Neha Gupta',
    testimonial3Role: 'Healthcare Director',
    testimonial3Content: 'Secure, fast, and intuitive. The RBAC system is exactly what we needed.',
    // CTA
    ctaTitle: 'Start building your system today',
    ctaSubtitle: 'Join thousands of businesses streamlining their operations with SmartManage.',
    ctaButton: 'Get Started — It\'s Free',
    // Footer
    footerProduct: 'Product',
    footerFeatures: 'Features',
    footerModules: 'Modules',
    footerPricing: 'Pricing',
    footerCompany: 'Company',
    footerAbout: 'About',
    footerBlog: 'Blog',
    footerCareers: 'Careers',
    footerResources: 'Resources',
    footerDocumentation: 'Documentation',
    footerApi: 'API',
    footerSupport: 'Support',
    footerLegal: 'Legal',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerCopyright: '© 2025 SmartManage. All rights reserved.',
  },
  hi: {
    // Navbar
    logo: 'स्मार्टमैनेज',
    navHome: 'होम',
    navFeatures: 'विशेषताएँ',
    navModules: 'मॉड्यूल',
    navAbout: 'हमारे बारे में',
    login: 'लॉगिन',
    // Hero
    heroHeading: 'ऑल-इन-वन स्मार्ट प्रबंधन प्लेटफॉर्म',
    heroSubheading: 'पाठ्यक्रम, स्वास्थ्य सेवा, कृषि, समाचार और बहुत कुछ प्रबंधित करें — एक शक्तिशाली डैशबोर्ड में रीयल-टाइम अंतर्दृष्टि के साथ।',
    getStarted: 'शुरू करें',
    // Features
    featuresTitle: 'शक्तिशाली विशेषताएँ',
    featuresSubtitle: 'परिचालन को सुव्यवस्थित करने के लिए आपकी जरूरत की हर चीज',
    featureRbac: 'रोल-आधारित पहुंच (RBAC)',
    featureRbacDesc: 'उपयोगकर्ताओं और व्यवस्थापकों के लिए विस्तृत अनुमतियाँ',
    featureCourses: 'पाठ्यक्रम प्रबंधन',
    featureCoursesDesc: 'पाठ्यक्रम बनाएं, प्रबंधित करें और ट्रैक करें',
    featureWallet: 'ऑर्डर और वॉलेट प्रणाली',
    featureWalletDesc: 'सहज भुगतान और वॉलेट एकीकरण',
    featureNews: 'समाचार CMS',
    featureNewsDesc: 'सामग्री आसानी से प्रकाशित और प्रबंधित करें',
    featureHealthcare: 'स्वास्थ्य सेवा मॉड्यूल',
    featureHealthcareDesc: 'रोगी रिकॉर्ड और अपॉइंटमेंट',
    featureAgriculture: 'कृषि सलाह',
    featureAgricultureDesc: 'स्मार्ट खेती की जानकारी',
    featureAnalytics: 'एनालिटिक्स डैशबोर्ड',
    featureAnalyticsDesc: 'रीयल-टाइम डेटा विज़ुअलाइज़ेशन',
    featureNotifications: 'सूचना प्रणाली',
    featureNotificationsDesc: 'मल्टी-चैनल अलर्ट',
    // Modules
    modulesTitle: 'विशेष मॉड्यूल',
    modulesSubtitle: 'हर क्षेत्र के लिए अनुकूल समाधान',
    moduleCourses: 'पाठ्यक्रम',
    moduleCoursesDesc: 'इंटरैक्टिव शिक्षण पथ और प्रमाणन',
    moduleOrders: 'ऑर्डर',
    moduleOrdersDesc: 'खरीदारी और चालान प्रबंधित करें',
    moduleWallet: 'वॉलेट',
    moduleWalletDesc: 'डिजिटल वॉलेट और लेनदेन इतिहास',
    moduleNews: 'समाचार',
    moduleNewsDesc: 'चुनिंदा समाचार और घोषणाएँ',
    moduleHealthcare: 'स्वास्थ्य सेवा',
    moduleHealthcareDesc: 'टेलीमेडिसिन और स्वास्थ्य रिकॉर्ड',
    moduleAgriculture: 'कृषि',
    moduleAgricultureDesc: 'फसल सलाह और बाजार दरें',
    learnMore: 'और जानें',
    // Analytics
    analyticsTitle: 'रीयल-टाइम अंतर्दृष्टि और एनालिटिक्स',
    activeUsers: 'सक्रिय उपयोगकर्ता',
    revenue: 'राजस्व',
    courseCompletion: 'पाठ्यक्रम पूर्णता',
    activeOrders: 'सक्रिय ऑर्डर',
    // Security
    securityJwt: 'JWT प्रमाणीकरण',
    securityJwtDesc: 'रिफ्रेश टोकन के साथ सुरक्षित टोकन-आधारित प्रमाणीकरण',
    securityRbac: 'रोल-आधारित अनुमतियाँ',
    securityRbacDesc: 'हर उपयोगकर्ता भूमिका के लिए विस्तृत पहुंच नियंत्रण',
    securityApi: 'सुरक्षित API',
    securityApiDesc: 'एंड-टू-एंड एन्क्रिप्शन और दर सीमित',
    // Testimonials
    testimonialsTitle: 'नेताओं द्वारा विश्वसनीय',
    testimonialsSubtitle: 'हमारे ग्राहक हमारे बारे में क्या कहते हैं',
    testimonial1Name: 'प्रिया शर्मा',
    testimonial1Role: 'CTO, एडुटेक',
    testimonial1Content: 'इस प्लेटफॉर्म ने हमारे संचालन को बदल दिया। अकेले एनालिटिक्स डैशबोर्ड ने हमें साप्ताहिक 20+ घंटे बचाए।',
    testimonial2Name: 'अमित कुमार',
    testimonial2Role: 'फार्म मैनेजर',
    testimonial2Content: 'कृषि मॉड्यूल रीयल-टाइम अंतर्दृष्टि देता है। उनकी सलाह से हमारी उपज में 35% सुधार हुआ।',
    testimonial3Name: 'नीता गुप्ता',
    testimonial3Role: 'हेल्थकेयर डायरेक्टर',
    testimonial3Content: 'सुरक्षित, तेज और सहज। RBAC प्रणाली बिल्कुल वही है जिसकी हमें आवश्यकता थी।',
    // CTA
    ctaTitle: 'आज ही अपना सिस्टम बनाना शुरू करें',
    ctaSubtitle: 'स्मार्टमैनेज के साथ अपने संचालन को सुव्यवस्थित करने वाले हजारों व्यवसायों से जुड़ें।',
    ctaButton: 'शुरू करें — मुफ्त है',
    // Footer
    footerProduct: 'उत्पाद',
    footerFeatures: 'विशेषताएँ',
    footerModules: 'मॉड्यूल',
    footerPricing: 'मूल्य निर्धारण',
    footerCompany: 'कंपनी',
    footerAbout: 'हमारे बारे में',
    footerBlog: 'ब्लॉग',
    footerCareers: 'करियर',
    footerResources: 'संसाधन',
    footerDocumentation: 'दस्तावेज़ीकरण',
    footerApi: 'API',
    footerSupport: 'सहायता',
    footerLegal: 'कानूनी',
    footerPrivacy: 'गोपनीयता',
    footerTerms: 'शर्तें',
    footerCopyright: '© 2025 स्मार्टमैनेज। सर्वाधिकार सुरक्षित।',
  }
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const t = (key) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ========== LANDING PAGE COMPONENTS ==========
import { FaShieldAlt, FaBookOpen, FaWallet, FaNewspaper, FaHeart, FaSeedling, FaChartBar, FaBell } from 'react-icons/fa';
import { FaGraduationCap, FaShoppingCart, FaLock, FaUsers, FaChevronRight, FaStar, FaFacebook, FaTwitter, FaGithub, FaLinkedin, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';

const Container = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 focus:ring-indigo-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md focus:ring-indigo-500",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
  };
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [t('navHome'), t('navFeatures'), t('navModules'), t('navAbout')];
  const sectionIds = ['home', 'features', 'modules', 'about'];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white/0'}`}>
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-md"></div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              {t('logo')}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(sectionIds[idx])}
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {link}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/login">
              <Button variant="secondary" className="px-4 py-2">
                <FaSignInAlt className="w-4 h-4 mr-2 inline" />
                {t('login')}
              </Button>
            </a>
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${language === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${language === 'hi' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                HI
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(sectionIds[idx])}
                className="block text-gray-600 hover:text-indigo-600 font-medium py-2 w-full text-left"
              >
                {link}
              </button>
            ))}
            <a href="/login" className="block">
              <Button variant="secondary" className="w-full justify-center mt-2">
                <FaSignInAlt className="w-4 h-4 mr-2 inline" />
                {t('login')}
              </Button>
            </a>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${language === 'en' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${language === 'hi' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
              >
                HI
              </button>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 md:py-28">
      <div className="absolute top-0 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              {t('heroHeading')}
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              {t('heroSubheading')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/register">
                <Button variant="primary">{t('getStarted')}</Button>
              </a>
              <a href="/login">
                <Button variant="secondary">{t('login')}</Button>
              </a>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-all duration-500">
              <div className="bg-gray-50 px-4 py-2 border-b flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-xs text-gray-500 ml-2">dashboard.smartmanage.app</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  <div className="h-2 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl"></div>
                  <div className="h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"></div>
                </div>
                <div className="h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="w-full px-3 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 rounded-full bg-indigo-100"></div>
                  <div className="w-8 h-8 rounded-full bg-indigo-100"></div>
                  <div className="w-8 h-8 rounded-full bg-indigo-100"></div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-indigo-200 to-blue-200 blur-3xl opacity-20"></div>
          </div>
        </div>
      </Container>
    </section>
  );
};

const features = [
  { icon: FaShieldAlt, titleKey: 'featureRbac', descKey: 'featureRbacDesc' },
  { icon: FaBookOpen, titleKey: 'featureCourses', descKey: 'featureCoursesDesc' },
  { icon: FaWallet, titleKey: 'featureWallet', descKey: 'featureWalletDesc' },
  { icon: FaNewspaper, titleKey: 'featureNews', descKey: 'featureNewsDesc' },
  { icon: FaHeart, titleKey: 'featureHealthcare', descKey: 'featureHealthcareDesc' },
  { icon: FaSeedling, titleKey: 'featureAgriculture', descKey: 'featureAgricultureDesc' },
  { icon: FaChartBar, titleKey: 'featureAnalytics', descKey: 'featureAnalyticsDesc' },
  { icon: FaBell, titleKey: 'featureNotifications', descKey: 'featureNotificationsDesc' }
];

const Features = () => {
  const { t } = useLanguage();
  return (
    <section id="features" className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('featuresTitle')}</h2>
          <p className="mt-4 text-xl text-gray-600">{t('featuresSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(feature.titleKey)}</h3>
              <p className="text-gray-600">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const modules = [
  { icon: FaGraduationCap, titleKey: 'moduleCourses', descKey: 'moduleCoursesDesc', color: "from-indigo-500 to-indigo-600" },
  { icon: FaShoppingCart, titleKey: 'moduleOrders', descKey: 'moduleOrdersDesc', color: "from-blue-500 to-blue-600" },
  { icon: FaWallet, titleKey: 'moduleWallet', descKey: 'moduleWalletDesc', color: "from-emerald-500 to-emerald-600" },
  { icon: FaNewspaper, titleKey: 'moduleNews', descKey: 'moduleNewsDesc', color: "from-amber-500 to-amber-600" },
  { icon: FaHeart, titleKey: 'moduleHealthcare', descKey: 'moduleHealthcareDesc', color: "from-rose-500 to-rose-600" },
  { icon: FaSeedling, titleKey: 'moduleAgriculture', descKey: 'moduleAgricultureDesc', color: "from-green-500 to-green-600" }
];

const Modules = () => {
  const { t } = useLanguage();
  return (
    <section id="modules" className="py-20 bg-gray-50">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('modulesTitle')}</h2>
          <p className="mt-4 text-xl text-gray-600">{t('modulesSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, idx) => (
            <div key={idx} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className={`p-6 bg-gradient-to-br ${mod.color} text-white`}>
                <mod.icon className="w-12 h-12" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(mod.titleKey)}</h3>
                <p className="text-gray-600 mb-4">{t(mod.descKey)}</p>
                <button className="text-indigo-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  {t('learnMore')} <FaChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const AnalyticsPreview = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">{t('analyticsTitle')}</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{t('activeUsers')}</span>
                    <span className="text-sm text-gray-500">+23%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{t('revenue')}</span>
                    <span className="text-sm text-gray-500">+45%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                    <p className="text-sm text-gray-500">{t('courseCompletion')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-2xl font-bold text-gray-900">12.4K</p>
                    <p className="text-sm text-gray-500">{t('activeOrders')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-end h-40 space-x-2">
                  {[45, 68, 32, 87, 54, 71, 92].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all hover:bg-indigo-600" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

const Security = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaLock className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('securityJwt')}</h3>
            <p className="text-gray-600">{t('securityJwtDesc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaUsers className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('securityRbac')}</h3>
            <p className="text-gray-600">{t('securityRbacDesc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaShieldAlt className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('securityApi')}</h3>
            <p className="text-gray-600">{t('securityApiDesc')}</p>
          </div>
        </div>
      </Container>
    </section>
  );
};

const testimonials = [
  { nameKey: 'testimonial1Name', roleKey: 'testimonial1Role', contentKey: 'testimonial1Content', rating: 5 },
  { nameKey: 'testimonial2Name', roleKey: 'testimonial2Role', contentKey: 'testimonial2Content', rating: 5 },
  { nameKey: 'testimonial3Name', roleKey: 'testimonial3Role', contentKey: 'testimonial3Content', rating: 5 }
];

const Testimonials = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('testimonialsTitle')}</h2>
          <p className="mt-4 text-xl text-gray-600">{t('testimonialsSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((tst, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex mb-4">
                {[...Array(tst.rating)].map((_, i) => <FaStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-gray-700 italic mb-6">"{t(tst.contentKey)}"</p>
              <div>
                <p className="font-bold text-gray-900">{t(tst.nameKey)}</p>
                <p className="text-sm text-gray-500">{t(tst.roleKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const CTA = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-800">
      <Container className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">{t('ctaSubtitle')}</p>
        <a href="/register">
          <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50">
            {t('ctaButton')}
          </Button>
        </a>
      </Container>
    </section>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer id="about" className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-white font-bold mb-4">{t('footerProduct')}</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition">{t('footerFeatures')}</a></li>
              <li><a href="#modules" className="hover:text-white transition">{t('footerModules')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footerPricing')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{t('footerCompany')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">{t('footerAbout')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footerBlog')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footerCareers')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{t('footerResources')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">{t('footerDocumentation')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footerApi')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footerSupport')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{t('footerLegal')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">{t('footerPrivacy')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footerTerms')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-white transition"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaGithub size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedin size={20} /></a>
          </div>
          <p className="text-sm">{t('footerCopyright')}</p>
        </div>
      </Container>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <LanguageProvider>
      <div className="font-sans antialiased">
        <Navbar />
        <Hero />
        <Features />
        <Modules />
        <AnalyticsPreview />
        <Security />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </LanguageProvider>
  );
};
// ========== END LANDING PAGE COMPONENTS ==========

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Logins />} />
          <Route path="/student" element={<StudentDashboard />} />

          <Route path="home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logins" element={<Logins />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/unauthorized" element={<div className="p-8 text-center">Unauthorized access</div>} />

          {/* Protected Routes (require authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/help" element={<Help />} />

              <Route
                path="/users"
                element={
                  <RoleRoute allowedRoles={['super_admin', 'admin']}>
                    <ManageUsers />
                  </RoleRoute>
                }
              />

              <Route
                path="/roles"
                element={
                  <RoleRoute allowedRoles={['super_admin']}>
                    <ManageRoles />
                  </RoleRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <RoleRoute allowedRoles={['super_admin']}>
                    <SystemSettings />
                  </RoleRoute>
                }
              />

              <Route
                path="/content"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <Content />
                  </RoleRoute>
                }
              />

              <Route
                path="/patients"
                element={
                  <RoleRoute allowedRoles={['doctor']}>
                    <Patients />
                  </RoleRoute>
                }
              />

              <Route
                path="/prescriptions"
                element={
                  <RoleRoute allowedRoles={['doctor']}>
                    <Prescriptions />
                  </RoleRoute>
                }
              />

              <Route
                path="/courses"
                element={
                  <RoleRoute allowedRoles={['user']}>
                    <MyCourses />
                  </RoleRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <RoleRoute allowedRoles={['user']}>
                    <MyOrders />
                  </RoleRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <RoleRoute allowedRoles={['super_admin', 'admin', 'doctor']}>
                    <Reports />
                  </RoleRoute>
                }
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="p-8 text-center">Page Not Found</div>} />
        </Routes >
      </AuthProvider >
    </BrowserRouter >
  );
}

export default App;