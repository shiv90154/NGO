import React from 'react';

const Policy = () => {
  // Privacy Policy data
  const privacyPolicy = {
    title: "Privacy Policy",
    lastUpdated: "April 1, 2026",
    content: {
      intro: "At [Your Company Name], we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
      sections: [
        {
          heading: "Information We Collect",
          text: "We may collect personal information such as your name, email address, phone number, billing address, and payment details when you create an account, make a purchase, or contact us. We also automatically collect usage data like IP address, browser type, and pages visited."
        },
        {
          heading: "How We Use Your Information",
          text: "We use the information to process transactions, provide customer support, improve our services, send updates and marketing communications (with your consent), and comply with legal obligations."
        },
        {
          heading: "Sharing Your Information",
          text: "We do not sell your personal information. We may share data with trusted third-party service providers (payment processors, hosting services) who assist in operating our website, subject to confidentiality agreements."
        },
        {
          heading: "Data Security",
          text: "We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure."
        },
        {
          heading: "Your Rights",
          text: "You have the right to access, correct, or delete your personal information. Contact us at support@example.com for any privacy-related requests."
        }
      ]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 sm:mb-4">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your privacy is important to us. Please review our policy below to understand how we protect your rights and manage your data.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Policy Content */}
        <div className="p-5 sm:p-6 md:p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {privacyPolicy.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Last Updated: {privacyPolicy.lastUpdated}
            </p>
          </div>

          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p className="text-gray-700 bg-gray-50 p-4 sm:p-5 rounded-lg border-l-4 border-blue-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
              {privacyPolicy.content.intro}
            </p>

            {privacyPolicy.content.sections.map((section, idx) => (
              <div key={idx} className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  {section.heading}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {section.text}
                </p>
              </div>
            ))}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <hr className="border-gray-200 mb-4" />
              <p className="text-sm sm:text-base text-gray-600">
                <strong className="font-semibold text-gray-800">Questions?</strong> If you have any questions about our privacy policy, please contact us at{' '}
                <a 
                  href="mailto:support@example.com" 
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  support@example.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;