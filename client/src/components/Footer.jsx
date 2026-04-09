import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';

// Constants extracted outside component
const CURRENT_YEAR = new Date().getFullYear();

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Dashboard', path: '/education' },
];

const LEGAL_LINKS = [
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Refund Policy', path: '/refund' },
  { name: 'Disclaimer', path: '/disclaimer' },
  { name: 'FAQ', path: '/faq' },
];

const SOCIAL_ICONS = ['📘', '🐦', '📷', '🔗'];
const SOCIAL_ARIA_LABELS = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'];

// Memoized link component to prevent unnecessary re-renders
const FooterLink = memo(({ to, children }) => (
  <li>
    <Link
      to={to}
      className="hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
    >
      <span className="text-blue-600" aria-hidden="true">›</span>
      {children}
    </Link>
  </li>
));

FooterLink.displayName = 'FooterLink';

// Social icon button component
const SocialIcon = memo(({ icon, label, index }) => (
  <button
    key={index}
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    {icon}
  </button>
));

SocialIcon.displayName = 'SocialIcon';

const Footer = () => {
  // Memoized quick links rendering
  const quickLinksMarkup = useMemo(() => (
    <ul className="space-y-3 text-sm">
      {QUICK_LINKS.map((link) => (
        <FooterLink key={link.path} to={link.path}>
          {link.name}
        </FooterLink>
      ))}
    </ul>
  ), []);

  // Memoized legal links rendering
  const legalLinksMarkup = useMemo(() => (
    <ul className="space-y-3 text-sm">
      {LEGAL_LINKS.map((link) => (
        <FooterLink key={link.path} to={link.path}>
          {link.name}
        </FooterLink>
      ))}
    </ul>
  ), []);

  // Memoized social icons rendering
  const socialIconsMarkup = useMemo(() => (
    <div className="mt-5 flex gap-3">
      {SOCIAL_ICONS.map((icon, i) => (
        <SocialIcon
          key={i}
          icon={icon}
          label={SOCIAL_ARIA_LABELS[i]}
          index={i}
        />
      ))}
    </div>
  ), []);

  return (
    <footer className="bg-white text-gray-600 pt-14 pb-6 px-4 border-t" role="contentinfo">
      <div className="container mx-auto max-w-6xl">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Logo + About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                aria-label="Samraddh Bharat Foundation Emblem"
              >
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

          {/* Quick Links Section */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            {quickLinksMarkup}
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
            {legalLinksMarkup}
          </div>

          {/* Contact & Social Section */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <span aria-hidden="true">📞</span>
                <a 
                  href="tel:18001234567" 
                  className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  1800-123-4567
                </a>
              </p>
              <p className="flex items-center gap-2 break-all">
                <span aria-hidden="true">✉️</span>
                <a 
                  href="mailto:support@samraddhbharat.gov.in" 
                  className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  support@samraddhbharat.gov.in
                </a>
              </p>
              <p className="flex items-start gap-2">
                <span aria-hidden="true">📍</span>
                <span>New Delhi, India</span>
              </p>
            </div>
            {socialIconsMarkup}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500 text-center">
          <p>© {CURRENT_YEAR} Samraddh Bharat Foundation</p>
          <p className="text-xs sm:text-sm">Built with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);