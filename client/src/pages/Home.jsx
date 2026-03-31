import React from "react";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const SERVICES_DATA = [
  { title: "Online Courses", desc: "A high-quality learning experience structured by expert educators." },
  { title: "Live Classes", desc: "Engaging and interactive sessions with renowned industry professionals." },
  { title: "Skill Development", desc: "Practical, career-focused skills to make you future-ready." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans selection:bg-orange-200">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-stone-200 sticky top-0 z-50">
        <h1 className="text-2xl font-serif font-bold text-orange-800 tracking-wide">
          Samraddh Bharat
        </h1>
        <div className="space-x-8 hidden md:flex">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              className="text-sm font-semibold tracking-wider text-slate-600 uppercase hover:text-orange-800 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button className="bg-orange-800 text-white px-6 py-2 rounded-sm text-sm font-medium tracking-wide hover:bg-orange-900 transition-colors duration-300">
          LOGIN
        </button>
      </nav>

      {/* Hero Section */}
      <section id="home" className="flex flex-col items-center justify-center text-center px-6 py-24 min-h-[75vh] bg-white">
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
          Empowering a <span className="text-orange-800 italic">Samraddh Bharat</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
          Building a digitally empowered nation through traditional values, modern education, 
          and enduring opportunities for every citizen.
        </p>
        <div className="mt-10 flex gap-4">
          <button className="bg-orange-800 text-white px-8 py-3 rounded-sm text-sm font-semibold tracking-wider uppercase hover:bg-orange-900 transition-colors duration-300">
            Get Started
          </button>
          <button className="border border-orange-800 text-orange-800 px-8 py-3 rounded-sm text-sm font-semibold tracking-wider uppercase hover:bg-orange-50 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-stone-100 text-center border-y border-stone-200">
        <h3 className="text-3xl font-serif font-bold text-slate-900">About Our Mission</h3>
        <div className="w-16 h-1 bg-orange-800 mx-auto mt-4 mb-6"></div>
        <p className="max-w-3xl mx-auto text-slate-600 leading-loose text-lg">
          Samraddh Bharat is an institution aimed at empowering individuals with
          quality education, digital skills, and sustainable employment opportunities. Our
          heritage and goal is to make India self-reliant, resilient, and future-ready.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-24 bg-white">
        <h3 className="text-3xl font-serif font-bold text-center text-slate-900">Our Services</h3>
        <div className="w-16 h-1 bg-orange-800 mx-auto mt-4 mb-12"></div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SERVICES_DATA.map((item, index) => (
            <div
              key={index}
              className="bg-stone-50 border border-stone-200 p-8 rounded-md hover:border-orange-800 hover:shadow-md transition-all duration-300"
            >
              <h4 className="text-xl font-serif font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-4 text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center bg-orange-900 text-stone-50">
        <h3 className="text-3xl font-serif font-bold">
          Join the Movement
        </h3>
        <p className="mt-4 text-orange-100/80 max-w-xl mx-auto text-lg">
          Become a part of India's digital growth and educational revolution today.
        </p>
        <button className="mt-8 bg-stone-50 text-orange-900 px-10 py-3 rounded-sm text-sm font-bold tracking-wider uppercase hover:bg-white hover:shadow-lg transition-all duration-300">
          Join Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 text-sm tracking-wide border-t border-slate-800">
        <p>© {new Date().getFullYear()} Samraddh Bharat. All rights reserved.</p>
      </footer>
    </div>
  );
}