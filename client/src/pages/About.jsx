import React from 'react';
import { motion, useInView } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  // Stats data
  const stats = [
    { label: 'Citizens Served', value: '10M+', icon: '👥' },
    { label: 'States Covered', value: '28', icon: '🗺️' },
    { label: 'Services Launched', value: '150+', icon: '⚙️' },
    { label: 'Partner Organizations', value: '500+', icon: '🤝' },
  ];

  // Core values data
  const coreValues = [
    { title: 'Transparency', description: 'Ensuring openness in all government processes and citizen interactions.', icon: '🔍' },
    { title: 'Accessibility', description: 'Making services available to every citizen, regardless of location or background.', icon: '🌐' },
    { title: 'Innovation', description: 'Leveraging technology to simplify and improve governance.', icon: '💡' },
    { title: 'Accountability', description: 'Taking responsibility for delivering quality services to the people.', icon: '⚖️' },
  ];

  // Journey milestones
  const milestones = [
    { year: '2020', title: 'Foundation Launched', description: 'Samraddh Bharat Foundation established as a Government of India initiative.' },
    { year: '2021', title: 'Digital Portal Go-Live', description: 'Launched the unified digital platform for citizen services.' },
    { year: '2022', title: 'Reached 5M Citizens', description: 'Successfully served over 5 million citizens across the country.' },
    { year: '2023', title: 'Expanded to All States', description: 'Extended services to all 28 states and 8 union territories.' },
    { year: '2024', title: 'AI-Powered Services', description: 'Introduced AI-driven assistance for faster grievance redressal.' },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1e3a5f] to-[#2c4e7a] text-white py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About Samraddh Bharat Foundation
            </motion.h1>
            <motion.p
              className="text-xl max-w-3xl mx-auto text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Empowering citizens through technology-driven governance and transparent service delivery.
            </motion.p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-xl"
              >
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-semibold text-[#1e3a5f] mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  To create a "Samraddh Bharat" (Prosperous India) where every citizen has equal access to government services,
                  opportunities, and benefits through technology-driven governance.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-xl"
              >
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-semibold text-[#1e3a5f] mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  Leveraging digital infrastructure to deliver citizen-centric services, promote transparency, and ensure last-mile
                  delivery of government schemes and foundation programs.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center text-[#1e3a5f] mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Core Values
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#ff8c42]/10 to-[#ff6b22]/10">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center text-[#1e3a5f] mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Impact
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-[#ff8c42]">{stat.value}</div>
                  <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center text-[#1e3a5f] mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Journey
            </motion.h2>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 h-full hidden md:block"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#ff8c42] rounded-full z-10 hidden md:block"></div>
                    <div className="w-full md:w-1/2 p-4">
                      <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                        <div className="text-[#ff8c42] font-bold text-xl mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#2c4e7a] text-white text-center">
          <div className="container mx-auto max-w-3xl">
            <motion.h3
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Join Us in Building a Prosperous India
            </motion.h3>
            <motion.p
              className="text-lg mb-8 text-gray-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Whether you're a citizen seeking services or an organization wanting to collaborate, we're here to help.
            </motion.p>
            <motion.a
              href="/contact"
              className="inline-block bg-[#ff8c42] hover:bg-[#ff6b22] text-white font-semibold px-8 py-3 rounded-lg transition"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Get in Touch
            </motion.a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;