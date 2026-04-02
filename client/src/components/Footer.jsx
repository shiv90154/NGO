import React from 'react';
import { Link } from 'react-router-dom'; // if using React Router; otherwise replace with <a>

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1a24] text-gray-400 pt-12 pb-6 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Responsive grid: 1 column on mobile, 2 on small/medium, 4 on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Logo & Mission */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff8c42] to-[#ff6b22] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                🇮🇳
              </div>
              <div>
                <span className="text-white font-semibold text-base sm:text-lg">
                  SAMRADDH BHARAT
                </span>
                <p className="text-xs text-gray-400">Foundation · Digital India</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Empowering citizens through technology-driven governance and transparent service delivery.
            </p>
            <p className="text-xs text-gray-500">Government of India Initiative</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Student Dashboard', path: '/student' },
                { name: 'News', path: '/news' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2 py-1"
                  >
                    <span className="text-[#ff8c42]">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Legal (fixed duplicate heading) */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Policies & Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Refund Policy', path: '/refund' },
                { name: 'Disclaimer', path: '/disclaimer' },      // fixed typo
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'FAQ', path: '/faq' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2 py-1"
                  >
                    <span className="text-[#ff8c42]">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[#ff8c42]">📞</span>
                <a href="tel:18001234567" className="hover:text-white break-all">
                  1800-123-4567 (Toll Free)
                </a>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[#ff8c42]">✉️</span>
                <a href="mailto:support@samraddhbharat.gov.in" className="hover:text-white break-all">
                  support@samraddhbharat.gov.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#ff8c42] shrink-0">📍</span>
                <span className="text-sm">
                  Samraddh Bharat Foundation,<br />New Delhi - 110001, India
                </span>
              </div>
            </div>

            {/* Social Icons - wrap on small screens */}
            <div className="mt-4 flex flex-wrap gap-3">
              {['📘', '🐦', '📷', '🔗'].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-700 hover:bg-[#ff8c42] flex items-center justify-center text-white transition-colors duration-200"
                  aria-label={`Social media link ${idx + 1}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - fully responsive */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-center">
          <p>© {currentYear} Samraddh Bharat Foundation. All rights reserved.</p>
          <p className="text-gray-500">A Digital India Initiative</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;