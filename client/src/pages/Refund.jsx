import React from "react";

// ✅ Constants
const COMPANY_NAME = "Samraddh Bharat";
const SUPPORT_EMAIL = "support@samraddhbharat.com";

// ✅ Static Data
const REFUND_DATA = {
  title: "Refund Policy",
  lastUpdated: "April 1, 2026",
  intro: `At ${COMPANY_NAME}, we strive to provide high-quality services. Please review our refund policy carefully.`,
  sections: [
    {
      id: "eligibility",
      heading: "Eligibility for Refund",
      text: "Refund requests must be made within 7 days of purchase. Requests after this period may not be accepted."
    },
    {
      id: "non-refundable",
      heading: "Non-Refundable Items",
      text: "Digital products, downloadable content, and services already accessed are non-refundable."
    },
    {
      id: "process",
      heading: "Refund Process",
      text: "To request a refund, contact our support team with your order details. Approved refunds are processed within 5–7 business days."
    },
    {
      id: "mode",
      heading: "Mode of Refund",
      text: "Refunds will be credited to the original payment method used during purchase."
    }
  ]
};

const Refund = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* SEO Title */}
      <title>{REFUND_DATA.title} | {COMPANY_NAME}</title>

      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {REFUND_DATA.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Last Updated: {REFUND_DATA.lastUpdated}
        </p>
      </header>

      {/* Content */}
      <section className="bg-white shadow-md rounded-2xl p-6 md:p-8">

        {/* Intro */}
        <p className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md text-gray-700 mb-6 text-sm md:text-base">
          {REFUND_DATA.intro}
        </p>

        {/* Sections */}
        {REFUND_DATA.sections.map((item, idx) => (
          <article key={item.id} className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
              {idx + 1}. {item.heading}
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {item.text}
            </p>
          </article>
        ))}

        {/* Contact */}
        <footer className="mt-8 pt-4 border-t text-sm text-gray-600">
          Need help? Contact us at{" "}
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

export default Refund;
