import React from "react";
import { useNavigate } from "react-router-dom";
const StartNow = () => {
  const navigate = useNavigate();
  return (
    <div
      className="py-20 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 text-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #ffedd5 100%)",
      }}
    >
      {/* Background Glow Circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-300 opacity-30 blur-3xl rounded-full"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
          Ready to Explore <span className="text-orange-500">Smarter Learning?</span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 mt-5 text-base md:text-lg">
          Join now to explore a smart student hub where you can buy and sell unused items, access study notes, stay updated with notices, and discover internships and training opportunities all in one place.
        </p>

        {/* Button */}
        <div className="mt-10">
          <button  onClick={() => navigate("/login")}
            className="
              px-10 py-3 md:py-4
              bg-orange-500 text-white
              rounded-full
              font-semibold text-lg
              shadow-lg
              hover:bg-orange-600
              hover:shadow-orange-400/40
              hover:scale-105
              active:scale-95
              transition-all duration-300
            "
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartNow;