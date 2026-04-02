import React from "react";

const Privacy = () => {
  const COMPANY_NAME = "Samraddh Bharat";
  const SUPPORT_EMAIL = "support@samraddhbharat.com";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Last Updated: April 1, 2026
        </p>
      </header>

      {/* Content */}
      <section className="bg-white shadow-md rounded-2xl p-6 md:p-8 text-gray-700 space-y-6">

        {/* Intro */}
        <p className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md">
          At <strong>{COMPANY_NAME}</strong>, we value your privacy and are committed to protecting your personal information.
        </p>

        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            1. Information We Collect
          </h2>
          <p className="mt-2">
            We may collect personal information such as your name, email address, phone number, and usage data when you use our services.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            2. How We Use Your Information
          </h2>
          <p className="mt-2">
            Your information is used to provide services, improve user experience, process transactions, and communicate updates.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            3. Data Sharing
          </h2>
          <p className="mt-2">
            We do not sell your personal data. We may share information with trusted service providers for operational purposes.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            4. Data Security
          </h2>
          <p className="mt-2">
            We implement appropriate security measures to protect your data. However, no system is completely secure.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            5. Your Rights
          </h2>
          <p className="mt-2">
            You have the right to access, update, or delete your personal information by contacting us.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            6. Updates to Policy
          </h2>
          <p className="mt-2">
            We may update this privacy policy from time to time. Changes will be posted on this page.
          </p>
        </div>

        {/* Contact */}
        <footer className="pt-4 border-t text-sm">
          For any privacy-related queries, contact us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-blue-600 font-medium hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </footer>

      </section>
    </main>
  );
};

export default Privacy;