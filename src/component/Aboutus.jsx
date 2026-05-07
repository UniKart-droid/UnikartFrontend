import React from "react";
import Footer from "./Footer";

const AboutUs = () => {
  return (
    
    <div className="bg-white min-h-screen pt-20"> 
      
      {/* HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-12 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          About UniKart
        </h1>
        <p className="text-gray-600 text-lg">
          A smart platform designed for students to buy, sell, and share resources easily within their campus.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto px-6 md:px-16">
        
        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            UniKart is a student-focused marketplace that allows users to buy and sell
            unused items like books, electronics, notes, and more. Our goal is to create
            a seamless and trustworthy environment where students can connect and exchange
            resources efficiently.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to reduce waste and help students save money by giving unused items a second life.
            UniKart promotes a sustainable and collaborative campus ecosystem.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="px-4">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Students"
            className="rounded-2xl shadow-lg w-full h-80 object-cover"
          />
        </div>
      </div>

      
      <div className="bg-gray-50 py-16 mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose UniKart?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2 text-orange-600">Easy Selling</h3>
              <p className="text-gray-600">
                List your unused items in minutes and reach potential buyers instantly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2 text-orange-600">Affordable Prices</h3>
              <p className="text-gray-600">
                Find products at student-friendly prices within your campus.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2 text-orange-600">Trusted Community</h3>
              <p className="text-gray-600">
                Connect with verified students for safe and reliable transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="py-16 text-center bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Start Selling Today 
        </h2>
        <p className="text-gray-600 mb-6">
          Join UniKart and turn your unused items into cash.
        </p>

        <a
          href="/student/sell-items"
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition inline-block"
        >
          Sell Now
        </a>
      </div>

      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
};

export default AboutUs;