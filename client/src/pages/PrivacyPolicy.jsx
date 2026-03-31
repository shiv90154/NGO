import React from "react";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Privacy Policy</h1>
      <p className="mb-4">We respect your privacy and are committed to protecting your personal information.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p>We may collect personal details like name, email, phone number and usage data.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Information</h2>
      <p>Your data is used to improve our services, provide support, and communicate updates.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Security</h2>
      <p>We use standard security measures to protect your information.</p>
    </div>
  );
}