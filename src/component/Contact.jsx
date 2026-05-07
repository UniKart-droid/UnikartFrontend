import React from "react";
import Footer from "./Footer";
import { FiMail, FiMapPin, FiMessageCircle } from "react-icons/fi";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="px-6 md:px-16 pb-20">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Get in <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Have questions about UniKart? We're here to help. Reach out to us directly 
            and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* INFO CARDS GRID */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* EMAIL CARD (Link Removed) */}
          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6">
              <FiMail size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Us</h2>
            <p className="text-gray-600 mb-6">
              For support, feedback, or any business inquiries, drop us a line anytime.
            </p>
            <div className="text-orange-600 font-bold text-lg">
              rajputridhi92@gmail.com
            </div>
          </div>

          {/* OFFICE/LOCATION CARD */}
          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300">
            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-white mb-6">
              <FiMapPin size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Location</h2>
            <p className="text-gray-600 mb-6">
              Based in the beautiful hills of Himachal. Currently serving the campus community locally.
            </p>
            <div className="text-gray-900 font-bold text-lg">
              Dharamshala, Himachal Pradesh
            </div>
          </div>

        </div>

        {/* HELP SECTION - Enhanced Styling */}
        <div className="mt-16 max-w-6xl mx-auto bg-orange-500 rounded-[2.5rem] p-12 text-center text-white shadow-2xl overflow-hidden relative">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <FiMessageCircle size={32} className="text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Want to sell something quickly?</h3>
            <p className="text-orange-50 text-lg max-w-xl mx-auto font-medium opacity-90">
              Just log in to your UniKart account and list your items. For technical issues, 
              reach out to our support team.
            </p>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-400 rounded-full blur-2xl opacity-40"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-orange-600 rounded-full blur-2xl opacity-30"></div>
        </div>

      </div>

      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
};

export default Contact;