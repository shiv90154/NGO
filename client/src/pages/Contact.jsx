import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ submitted: false, error: false, message: '' });
  const [activeFAQ, setActiveFAQ] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ submitted: true, error: true, message: 'Please fill in all required fields.' });
      return;
    }
    // Simulate API call
    setFormStatus({ submitted: true, error: false, message: 'Sending...' });
    try {
      // Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setFormStatus({ submitted: true, error: false, message: 'Thank you! Your message has been sent.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus({ submitted: false, error: false, message: '' }), 5000);
    } catch (err) {
      setFormStatus({ submitted: true, error: true, message: 'Something went wrong. Please try again later.' });
    }
  };

  const faqData = [
    {
      question: 'What are the operating hours of the helpline?',
      answer: 'Our helpline (1800-123-4567) is available 24/7, 365 days a year to assist you with any government services.'
    },
    {
      question: 'How quickly can I expect a response to my email?',
      answer: 'We strive to respond to all email inquiries within 24-48 business hours. For urgent matters, please call our helpline.'
    },
    {
      question: 'Is Samraddh Bharat Foundation an official government body?',
      answer: 'Yes, Samraddh Bharat Foundation is a Government of India initiative dedicated to providing accessible citizen services.'
    },
    {
      question: 'What services can I avail through this portal?',
      answer: 'You can access various government schemes, apply for certificates, track application status, and get assistance with public welfare programs.'
    },
    {
      question: 'Are there any charges for using the helpline or email support?',
      answer: 'All our support services are completely free of charge. We are here to help citizens without any cost.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <>
      <Header />
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">Need Assistance?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Samraddh Bharat Helpline is available 24/7 to assist you with any government services
            </p>
          </motion.div>

          {/* Quick Contact Buttons */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <a
              href="tel:18001234567"
              className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all text-center"
            >
              📞 Call Helpline: 1800-123-4567
            </a>
            <a
              href="mailto:support@samraddhbharat.gov.in"
              className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#1e3a5f] hover:text-white transition-all text-center"
            >
              ✉️ Send Email
            </a>
          </motion.div>

          {/* Contact Form & Info Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Form Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2c4e7a] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  Send Message
                </button>
                {formStatus.submitted && (
                  <div className={`text-center p-3 rounded-lg ${formStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {formStatus.message}
                  </div>
                )}
              </form>
            </motion.div>

            {/* Info Card */}
            <motion.div
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 shadow-xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ff8c42] p-3 rounded-full text-white">📍</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Visit Us</h4>
                    <p className="text-gray-600">Samraddh Bharat Foundation,<br />Government of India,<br />New Delhi - 110001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#ff8c42] p-3 rounded-full text-white">📞</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Helpline Numbers</h4>
                    <p className="text-gray-600">Toll Free: 1800-123-4567<br />Office: +91-11-23456789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#ff8c42] p-3 rounded-full text-white">✉️</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email Support</h4>
                    <p className="text-gray-600">support@samraddhbharat.gov.in<br />grievance@samraddhbharat.gov.in</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-center text-[#1e3a5f] mb-4">Frequently Asked Questions</h3>
            <p className="text-center text-gray-600 mb-12">Find quick answers to common queries</p>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-4 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="text-[#ff8c42] text-xl">
                      {activeFAQ === index ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {activeFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="px-6 py-4 text-gray-600 bg-gray-50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;