import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1a24] text-gray-400 pt-14 pb-6 px-6 xl:px-12">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1400px]">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-14 mb-10">

          {/* LOGO */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-[#ff8c42] to-[#ff6b22] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                🇮🇳
              </div>
              <div>
                <span className="text-white font-semibold text-lg xl:text-xl">
                  SAMRADDH BHARAT
                </span>
                <p className="text-xs text-gray-400">
                  Foundation · Digital India
                </p>
              </div>
            </div>

            <p className="text-sm xl:text-[15px] text-gray-400 mb-4 leading-relaxed">
              Empowering citizens through technology-driven governance and transparent service delivery.
            </p>

            <p className="text-xs text-gray-500">
              Government of India Initiative
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold text-lg xl:text-xl mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm xl:text-[15px]">
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
                    className="hover:text-white transition flex items-center gap-2 group"
                  >
                    <span className="text-[#ff8c42] group-hover:translate-x-1 transition">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* POLICIES */}
          <div>
            <h3 className="text-white font-semibold text-lg xl:text-xl mb-5">
              Support
            </h3>

            <ul className="space-y-3 text-sm xl:text-[15px]">
              {[
                { name: 'Refund', path: '/refund' },
                { name: 'Disclaimer', path: '/disclaimer' },
                { name: 'Privacy', path: '/privacy' },
                { name: 'FAQ', path: '/faq' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition flex items-center gap-2 group"
                  >
                    <span className="text-[#ff8c42] group-hover:translate-x-1 transition">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold text-lg xl:text-xl mb-5">
              Get in Touch
            </h3>

            <div className="space-y-4 text-sm xl:text-[15px]">
              <div className="flex items-start gap-3">
                <span className="text-[#ff8c42] text-lg">📞</span>
                <a href="tel:18001234567" className="hover:text-white">
                  1800-123-4567 (Toll Free)
                </a>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#ff8c42] text-lg">✉️</span>
                <a href="mailto:support@samraddhbharat.gov.in" className="hover:text-white break-all">
                  support@samraddhbharat.gov.in
                </a>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#ff8c42] text-lg">📍</span>
                <span>
                  Samraddh Bharat Foundation,<br />
                  New Delhi - 110001, India
                </span>
              </div>
            </div>

            {/* SOCIAL */}
            <div className="mt-5 flex gap-4">
              {['📘', '🐦', '📷', '🔗'].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-700 hover:bg-[#ff8c42] flex items-center justify-center text-white transition transform hover:scale-110"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm xl:text-[15px]">
          <p>
            © {currentYear} Samraddh Bharat Foundation. All rights reserved.
          </p>
          <p className="text-gray-500">
            A Digital India Initiative
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;