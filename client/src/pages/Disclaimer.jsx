import React from "react";

const Disclaimer = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Disclaimer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Last Updated: April 1, 2026
        </p>
      </header>

      {/* Content */}
      <section className="bg-white shadow-md rounded-2xl p-6 md:p-8 text-gray-700 space-y-6">

        {/* Intro */}
        <p className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md">
          The information provided by <strong>Samraddh Bharat</strong> on this platform is for general informational purposes only.
        </p>

        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            1. No Professional Advice
          </h2>
          <p className="mt-2">
            All content is provided in good faith, but we make no guarantees about accuracy or completeness. 
            It should not be considered legal, financial, or medical advice.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            2. External Links Disclaimer
          </h2>
          <p className="mt-2">
            Our platform may contain links to external websites. We are not responsible for the content, accuracy, 
            or reliability of these third-party sites.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            3. Limitation of Liability
          </h2>
          <p className="mt-2">
            Under no circumstances shall we be liable for any loss or damage arising from the use of our platform.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            4. Consent
          </h2>
          <p className="mt-2">
            By using our website, you hereby consent to our disclaimer and agree to its terms.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            5. Updates
          </h2>
          <p className="mt-2">
            We may update this disclaimer from time to time. Any changes will be posted on this page.
          </p>
        </div>

        {/* Contact */}
        <footer className="pt-4 border-t text-sm">
          For any questions, contact us at{" "}
          <a
            href="mailto:support@samraddhbharat.com"
            className="text-blue-600 font-medium hover:underline"
          >
            support@samraddhbharat.com
          </a>
        </footer>

      </section>
    </main>
  );
};

export default Disclaimer;