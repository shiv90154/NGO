import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, GraduationCap, Wallet, HeartPulse,
  Newspaper, Sprout, MonitorSmartphone
} from 'lucide-react';

const services = [
  {
    title: "Education",
    desc: "Courses, live classes & certificates.",
    route: "education",
    features: ["Live Classes", "Tests", "Certs"],
    icon: GraduationCap,
    accent: "#7c3aed",
    light: "#f3f0ff",
    tag: "Learning"
  },
  {
    title: "Finance",
    desc: "Wallet, transfers & micro-loans.",
    route: "finance/dashboard",
    features: ["Wallet", "Transfer", "Loans"],
    icon: Wallet,
    accent: "#0369a1",
    light: "#e0f2fe",
    tag: "Banking"
  },
  {
    title: "Healthcare",
    desc: "Doctors, records & medicines online.",
    route: "healthcare",
    features: ["Consult", "Records", "Meds"],
    icon: HeartPulse,
    accent: "#be123c",
    light: "#fff1f2",
    tag: "Wellness"
  },
  {
    title: "News",
    desc: "Live local news & community stories.",
    route: "news",
    features: ["Live Feed", "Videos", "Local"],
    icon: Newspaper,
    accent: "#b45309",
    light: "#fffbeb",
    tag: "Media"
  },
  {
    title: "Agriculture",
    desc: "AI crop tips & smart market prices.",
    route: "agriculture",
    features: ["Crop Tips", "Market", "AI Help"],
    icon: Sprout,
    accent: "#15803d",
    light: "#f0fdf4",
    tag: "Farming"
  },
  {
    title: "IT Services",
    desc: "Billing, projects & CRM tools.",
    route: "it/dashboard",
    features: ["Billing", "Projects", "CRM"],
    icon: MonitorSmartphone,
    accent: "#0f766e",
    light: "#f0fdfa",
    tag: "Tech"
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function ServicesSection() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="services-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .services-container {
          height: 100vh;
          width: 100%;
          background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* Modern scrollbar hiding (just in case) */
        .services-container ::-webkit-scrollbar {
          display: none;
        }

        /* Header styles */
        .services-header {
          flex-shrink: 0;
          padding: 1.2rem 2rem 0.8rem 2rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        .badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          background: #1e293b;
          color: white;
          padding: 0.25rem 0.9rem;
          border-radius: 40px;
          margin-bottom: 0.75rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .title {
          font-size: clamp(1.4rem, 4vw, 1.9rem);
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a, #334155);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 0.75rem;
          color: #5b6e8c;
          margin-top: 0.25rem;
          font-weight: 500;
        }

        /* Grid layout - exactly fits without scroll */
        .services-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          padding: 1rem 2rem 1.2rem 2rem;
          min-height: 0;
          align-content: center;
        }

        /* Card styles */
        .service-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(2px);
          border-radius: 1.5rem;
          padding: 1.2rem;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.6);
          transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .service-card:hover {
          transform: translateY(-4px);
          background: white;
          border-color: rgba(0,0,0,0.08);
          box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.12);
        }

        /* Icon wrapper */
        .card-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: transform 0.2s ease;
        }

        .service-card:hover .card-icon {
          transform: scale(0.96);
        }

        /* Typography */
        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
          letter-spacing: -0.3px;
        }

        .card-desc {
          font-size: 0.7rem;
          color: #5b6e8c;
          line-height: 1.4;
          margin-bottom: 1rem;
          flex: 1;
        }

        /* Features chips */
        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .feature-chip {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.2rem 0.7rem;
          border-radius: 30px;
          background: rgba(0, 0, 0, 0.04);
          color: #334155;
          transition: all 0.2s;
        }

        .service-card:hover .feature-chip {
          background: rgba(0, 0, 0, 0.08);
        }

        /* Bottom row with tag and arrow */
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .tag {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          padding: 0.2rem 0.7rem;
          border-radius: 30px;
          background: rgba(0,0,0,0.04);
          backdrop-filter: blur(2px);
        }

        .arrow-circle {
          width: 1.8rem;
          height: 1.8rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.34, 1.2, 0.64, 1);
          opacity: 0.6;
        }

        .service-card:hover .arrow-circle {
          opacity: 1;
          transform: translateX(2px);
        }

        /* Footer */
        .services-footer {
          text-align: center;
          padding: 0.6rem 1rem 0.8rem;
          flex-shrink: 0;
          font-size: 0.65rem;
          font-weight: 500;
          color: #94a3b8;
          border-top: 1px solid rgba(0, 0, 0, 0.03);
          letter-spacing: 0.2px;
        }

        /* Responsive: on smaller screens, 2 columns */
        @media (max-width: 780px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            padding: 0.8rem 1.2rem 1rem;
          }
          .services-header {
            padding: 1rem 1.2rem 0.5rem;
          }
          .card-title {
            font-size: 1rem;
          }
        }

        /* For very narrow devices, still 2 columns but adjust */
        @media (max-width: 500px) {
          .services-grid {
            gap: 0.8rem;
            padding: 0.8rem 1rem 1rem;
          }
          .service-card {
            padding: 0.9rem;
          }
          .card-icon {
            width: 2.4rem;
            height: 2.4rem;
            margin-bottom: 0.7rem;
          }
        }

        /* Focus ring for accessibility */
        .service-card:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>

      {/* Header */}
      <div className="services-header">
        <span className="badge">✨ DigitalVillage</span>
        <h1 className="title">Everything you need<br />in one ecosystem</h1>
        <p className="subtitle">Smart digital services • Unified platform</p>
      </div>

      {/* Services Grid - no scrolling guaranteed */}
      <motion.div
        className="services-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service, idx) => {
          const Icon = service.icon;
          const isHovered = hoveredIndex === idx;

          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="service-card"
              style={{
                borderColor: isHovered ? `${service.accent}30` : 'rgba(255,255,255,0.6)'
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => navigate(`/${service.route}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/${service.route}`)}
            >
              <div
                className="card-icon"
                style={{
                  background: service.light,
                  boxShadow: isHovered ? `0 6px 12px ${service.accent}20` : 'none'
                }}
              >
                <Icon size={24} style={{ color: service.accent, strokeWidth: 1.8 }} />
              </div>

              <h3 className="card-title">{service.title}</h3>
              <p className="card-desc">{service.desc}</p>

              <div className="features">
                {service.features.map((feature, fIdx) => (
                  <span key={fIdx} className="feature-chip">{feature}</span>
                ))}
              </div>

              <div className="card-footer">
                <span
                  className="tag"
                  style={{
                    background: `${service.accent}0c`,
                    color: service.accent,
                    border: `0.5px solid ${service.accent}15`
                  }}
                >
                  {service.tag}
                </span>
                <motion.div
                  className="arrow-circle"
                  style={{ background: service.accent }}
                  animate={{ scale: isHovered ? 1.02 : 0.98 }}
                >
                  <ArrowRight size={14} color="white" strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Subtle shine overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at 20% 0%, ${service.accent}08, transparent 80%)`,
                opacity: isHovered ? 0.5 : 0,
                transition: 'opacity 0.25s',
                pointerEvents: 'none',
                borderRadius: '1.5rem'
              }} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer hint */}
      <div className="services-footer">
        <span>⚡ Tap any card to explore • Seamless experience</span>
      </div>
    </div>
  );
}