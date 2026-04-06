import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-600 pt-14 pb-6 px-4 border-t">
      <div className="container mx-auto max-w-6xl">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* LOGO + ABOUT */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                🇮🇳
              </div>
              <div>
                <h2 className="text-gray-900 font-semibold text-lg">
                  SAMRADDH BHARAT
                </h2>
                <p className="text-xs text-gray-500">
                  Digital India Initiative
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">
              Empowering citizens through transparent digital services and smart governance solutions.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Dashboard', path: '/education' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-2"
                  >
                    <span className="text-blue-600">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* POLICIES */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Refund Policy', path: '/refund' },
                { name: 'Disclaimer', path: '/disclaimer' },
                { name: 'FAQ', path: '/faq' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-2"
                  >
                    <span className="text-blue-600">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                📞 <span className="hover:text-blue-600">1800-123-4567</span>
              </p>

              <p className="flex items-center gap-2 break-all">
                ✉️ <span className="hover:text-blue-600">support@samraddhbharat.gov.in</span>
              </p>

              <p className="flex items-start gap-2">
                📍 New Delhi, India
              </p>
            </div>

            {/* SOCIAL */}
            <div className="mt-5 flex gap-3">
              {['📘', '🐦', '📷', '🔗'].map((icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white cursor-pointer transition-all"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500 text-center">
          <p>© {currentYear} Samraddh Bharat Foundation</p>
          <p className="text-xs sm:text-sm">Built with ❤️ in India</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;