import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Stack,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ----- Helper: Custom styled components -----
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff8c42, #ff6b22)',
  borderRadius: 12,
  padding: '12px 32px',
  fontWeight: 600,
  fontSize: '1.125rem',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 25px 30px -5px rgba(0,0,0,0.3)',
    background: 'linear-gradient(135deg, #ff9a5a, #ff7b3a)',
  },
}));

const OutlineButton = styled(Button)(({ theme }) => ({
  border: '2px solid white',
  borderRadius: 12,
  padding: '12px 32px',
  fontWeight: 600,
  fontSize: '1.125rem',
  color: 'white',
  backgroundColor: 'transparent',
  backdropFilter: 'blur(4px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'white',
    color: '#1e3a5f',
    transform: 'scale(1.02)',
  },
}));

// ----- Animation variants (reused from original) -----
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

// ----- Data arrays (unchanged) -----
const coreModules = [
  { icon: "🎓", title: "Education", desc: "Online courses, live classes, test series, certificates, and teacher earnings dashboard.", path: "/services/education" },
  { icon: "🏥", title: "Healthcare", desc: "Doctor search, video consultation, health records, prescription & AI disease detection.", path: "/services/healthcare" },
  { icon: "🌾", title: "Agriculture", desc: "Farmer registration, crop management, product selling, AI crop disease detection.", path: "/services/agriculture" },
  { icon: "💰", title: "Finance", desc: "Digital wallet, money transfer, AEPS, bill payments, loans & EMI system.", path: "/services/finance" },
  { icon: "📺", title: "News & Media", desc: "News posting, video editing, live streaming, ads & monetization platform.", path: "/services/media" },
  { icon: "💼", title: "CRM & IT", desc: "Client management, GST billing, project tracking, and team management tools.", path: "/services/crm" },
  { icon: "🏪", title: "Village Store", desc: "Ayurvedic products, agricultural goods, digital services, product exchange system.", path: "/services/store" },
  { icon: "🤝", title: "Franchise & MLM", desc: "Multi-level income distribution, weekly payouts, team hierarchy earnings.", path: "/services/franchise" },
];

const subscriptionPlans = [
  { name: "Education Plan", price: "₹300 - ₹600", features: ["Full course access", "Live classes", "Test series", "Certificates"], cta: "/subscribe/education" },
  { name: "Health Plan", price: "₹200 - ₹2200", features: ["Doctor consultations", "Health records", "AI diagnostics", "Medicine delivery"], cta: "/subscribe/health" },
  { name: "Agriculture Plan", price: "₹1200+", features: ["Crop advisory", "Market linkage", "AI disease detection", "Contract farming"], cta: "/subscribe/agriculture" },
];

const initiatives = [
  { title: "Digital Literacy Mission", desc: "Empowering rural India with digital skills and computer education.", tag: "Education", cta: "/initiatives/digital-literacy" },
  { title: "Ayushman Telehealth", desc: "Affordable healthcare consultations via video and AI support.", tag: "Healthcare", cta: "/initiatives/ayushman" },
  { title: "Smart Kisan Samriddhi", desc: "Real-time crop advisories and direct market access for farmers.", tag: "Agriculture", cta: "/initiatives/smart-kisan" },
  { title: "Jan Dhan Fintech", desc: "Banking, AEPS, and micro-loans for every village citizen.", tag: "Finance", cta: "/initiatives/jan-dhan" },
  { title: "Gramin Media Network", desc: "Local news, live events, and monetization for content creators.", tag: "Media", cta: "/initiatives/gramin-media" },
  { title: "e-Panchayat ERP", desc: "GST billing, project tracking, and digital governance for local bodies.", tag: "CRM & IT", cta: "/initiatives/panchayat-erp" },
];

const testimonials = [
  { name: "Ramesh Kumar", role: "Farmer, Uttar Pradesh", text: "Samraddh Bharat's agriculture module helped me get real-time weather alerts and sell my produce directly. My income has increased by 30%!", rating: 5, avatar: "👨‍🌾" },
  { name: "Priya Sharma", role: "Student, Bihar", text: "The education plan is a game-changer! I access live classes and study materials for free. The digital literacy mission empowered my entire village.", rating: 5, avatar: "👩‍🎓" },
  { name: "Dr. Anil Mehta", role: "Doctor, Rajasthan", text: "Ayushman Telehealth allows me to consult patients in remote areas. The platform is intuitive and reliable.", rating: 4, avatar: "👨‍⚕️" },
];

const statistics = [
  { value: 50, label: "Digital Services", suffix: "+" },
  { value: 2500000, label: "Active Users", suffix: "+", prefix: "" },
  { value: 24, label: "AI Support", suffix: "/7" },
  { value: 100, label: "Secure & Transparent", suffix: "%" },
];

// ----- Main Component -----
const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Refs & animations
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, threshold: 0.3 });
  const controls = useAnimation();

  const handleExplore = () => {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pt: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #0f2b3d, #1e4a76, #2a6b9e)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: '#ff8c42',
                fontWeight: 'bold',
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                px: 2,
                py: 0.5,
                borderRadius: 20,
                display: 'inline-block',
                mb: 2,
              }}
            >
              GOVERNMENT OF INDIA INITIATIVE
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mt: 2,
                background: 'linear-gradient(135deg, #fff, #ccc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Samraddh Bharat
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 300, color: 'grey.200', mb: 1 }}>
              समृद्ध भारत · विकसित भारत
            </Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.2rem', md: '1.8rem' }, color: 'grey.200', mb: 1 }}>
              Integrated Digital Management System
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'grey.300', maxWidth: '700px', mx: 'auto', mb: 4 }}>
              Web Portal + Mobile Application | Village to State Level Digital Governance
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <GradientButton onClick={handleExplore} sx={{ minWidth: 200 }}>
              Explore Modules
            </GradientButton>
            <OutlineButton onClick={() => navigate('/register')} sx={{ minWidth: 200 }}>
              Get Started
            </OutlineButton>
          </motion.div>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 24,
            height: 40,
            border: '2px solid white',
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: 4, height: 8, bgcolor: 'white', borderRadius: 2, mt: 1 }} />
        </motion.div>
      </Box>

      {/* Live Stats Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Box sx={{ bgcolor: '#ff8c42', py: 1.5 }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ textAlign: 'center', color: 'white' }}>
              {['LIVE USERS', "TODAY'S SERVICES", 'SATISFACTION', 'VILLAGES COVERED'].map((label, idx) => (
                <Grid item xs={6} md={3} key={idx}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {idx === 0 && '2,34,567+'}
                    {idx === 1 && '1,23,456'}
                    {idx === 2 && '98.5%'}
                    {idx === 3 && '1,25,000+'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* Mission Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
              Welcome to Samraddh Bharat Foundation
            </Typography>
            <Box sx={{ width: 96, height: 4, bgcolor: '#ff8c42', mx: 'auto', mb: 4 }} />
            <Typography variant="body1" sx={{ color: 'grey.600', lineHeight: 1.8 }}>
              Samraddh Bharat Foundation is a unified digital ecosystem integrating Education, Healthcare, Agriculture,
              Finance, NGO operations, and Media into a single platform. Our mission is to provide seamless, transparent,
              and efficient delivery of services from village to state level, ensuring "Sabka Saath, Sabka Vikas, Sabka Vishwas"
              through technology-driven governance.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Core Modules Section */}
      <Box id="modules" sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
              Integrated Core Modules
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.600', maxWidth: 600, mx: 'auto' }}>
              Complete digital ecosystem for governance and citizen services
            </Typography>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}
          >
            {coreModules.map((module, index) => (
              <motion.div
                key={index}
                variants={cardVariants(index * 0.1)}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(module.path)}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 2,
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: 8 },
                    borderTop: `4px solid #ff8c42`,
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                  }}
                >
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ fontSize: 48, marginBottom: 16 }}>
                    {module.icon}
                  </motion.div>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a5f', mb: 1 }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.600' }}>
                    {module.desc}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'inline-block',
                      mt: 2,
                      color: '#ff8c42',
                      fontWeight: 600,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      '.MuiCard-root:hover &': { opacity: 1 },
                    }}
                  >
                    Learn more →
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Box>

      {/* Subscription Plans */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
              Membership & Subscription Plans
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.600' }}>
              Affordable plans for every citizen — Education, Health, Agriculture
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {subscriptionPlans.map((plan, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div variants={cardVariants(idx * 0.1)} whileHover={{ y: -8 }}>
                  <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, height: '100%', bgcolor: 'grey.50' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#ff8c42', fontWeight: 700, my: 2 }}>
                      {plan.price}
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                      {plan.features.map((feature, i) => (
                        <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          ✓ {feature}
                        </Typography>
                      ))}
                    </Stack>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(plan.cta)}
                      sx={{ bgcolor: '#1e3a5f', '&:hover': { bgcolor: '#ff8c42' }, borderRadius: 2, py: 1 }}
                    >
                      Subscribe Now
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
              How It Works
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.600' }}>
              Simple steps to access government services online
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {[
              { step: 1, title: 'Register', desc: 'Sign up with your mobile number or Aadhaar', icon: '📝' },
              { step: 2, title: 'Choose Service', desc: 'Select from 50+ digital services', icon: '🔍' },
              { step: 3, title: 'Get Benefits', desc: 'Receive certificates, payments, or assistance', icon: '🎁' },
            ].map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ textAlign: 'center', p: 4, borderRadius: 4, boxShadow: 2 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'rgba(255, 140, 66, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        fontSize: 32,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h4" sx={{ color: '#ff8c42', fontWeight: 700, mb: 1 }}>
                      {item.step}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a5f', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>
                      {item.desc}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Initiatives Section */}
      <Box id="initiatives" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
              Flagship Initiatives
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.600' }}>
              Transforming India — One initiative at a time
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {initiatives.map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} style={{ height: '100%' }}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      borderLeft: `4px solid #ff8c42`,
                      boxShadow: 2,
                      transition: 'box-shadow 0.3s',
                      '&:hover': { boxShadow: 6 },
                      height: '100%',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#ff8c42', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.tag}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a5f', my: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', mb: 2 }}>
                      {item.desc}
                    </Typography>
                    <Button
                      onClick={() => navigate(item.cta)}
                      sx={{ color: '#ff8c42', fontWeight: 600, '&:hover': { color: '#e6732e' }, p: 0 }}
                    >
                      Apply Now →
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Franchise & MLM System Highlight */}
      <Box sx={{ py: 8, bgcolor: '#1e3a5f', color: 'white', textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Box sx={{ display: 'inline-block', p: 1, bgcolor: 'rgba(255,140,66,0.2)', borderRadius: '50%', mb: 2 }}>
              <Typography variant="h4">🤝</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Franchise & MLM System
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.300', mb: 4 }}>
              Multi-level income distribution · Weekly payouts · Team hierarchy earnings
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/franchise')}
              sx={{ bgcolor: '#ff8c42', '&:hover': { bgcolor: '#ff6b22' }, px: 4, py: 1.5, borderRadius: 3, fontWeight: 600 }}
            >
              Become a Partner →
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', color: '#1e3a5f', mb: 6 }}>
            What Citizens Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ p: 3, borderRadius: 4, boxShadow: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h3">{testimonial.avatar}</Typography>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.500' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'grey.600', mb: 2 }}>
                      "{testimonial.text}"
                    </Typography>
                    <Typography sx={{ color: '#ff8c42' }}>
                      {'★'.repeat(testimonial.rating)}
                      {'☆'.repeat(5 - testimonial.rating)}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section with CountUp */}
      <Box ref={statsRef} sx={{ bgcolor: '#1e3a5f', py: 10, color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: 6 }}>
            Samraddh Bharat in Numbers
          </Typography>
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            {statistics.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                >
                  <Typography variant="h2" sx={{ fontWeight: 700, color: '#ff8c42', mb: 1 }}>
                    {isStatsInView ? (
                      <CountUp start={0} end={stat.value} duration={2} suffix={stat.suffix} prefix={stat.prefix} />
                    ) : (
                      stat.value
                    )}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'grey.300' }}>
                    {stat.label}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box id="about" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', color: '#1e3a5f', mb: 6 }}>
            About Samraddh Bharat Foundation
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: '🎯', title: 'Our Vision', text: 'To create a "Samraddh Bharat" (Prosperous India) where every citizen has equal access to government services, opportunities, and benefits through technology-driven governance.' },
              { icon: '🚀', title: 'Our Mission', text: 'Leveraging digital infrastructure to deliver citizen-centric services, promote transparency, and ensure last-mile delivery of government schemes and foundation programs.' }
            ].map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card sx={{ p: 4, borderRadius: 4, boxShadow: 3, height: '100%', bgcolor: 'grey.50' }}>
                    <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>
                      {item.icon}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e3a5f', mb: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'grey.600' }}>
                      {item.text}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
              Need Assistance?
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.600' }}>
              Samraddh Bharat Helpline is available 24/7 to assist you with any government services
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Paper elevation={3} sx={{ borderRadius: 4, p: 4, textAlign: 'center', bgcolor: 'white' }}>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    component="a"
                    href="tel:18001234567"
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#ff8c42', '&:hover': { bgcolor: '#ff6b22' }, py: 1.5, borderRadius: 3 }}
                  >
                    📞 Call Helpline: 1800-123-4567
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    component="a"
                    href="mailto:support@samraddhbharat.gov.in"
                    fullWidth
                    variant="outlined"
                    sx={{ borderColor: '#1e3a5f', color: '#1e3a5f', py: 1.5, borderRadius: 3, '&:hover': { bgcolor: '#1e3a5f', color: 'white' } }}
                  >
                    ✉️ Send Email
                  </Button>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ color: 'grey.500', fontWeight: 600 }}>
                Samraddh Bharat Foundation - Government of India Initiative
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.500' }}>
                support@samraddhbharat.gov.in
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;