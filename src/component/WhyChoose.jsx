import React from "react";
import { FaMoneyBillWave, FaUsers, FaShieldAlt } from "react-icons/fa";

const WhyChoose = () => {
  const features = [
    {
      icon: <FaMoneyBillWave />,
      title: "Affordable Learning",
      description:
        "Access notes, books, and study materials at student-friendly prices.",
    },
    {
      icon: <FaUsers />,
      title: "Student & Teacher Community",
      description:
        "Connect with students and teachers to share and explore learning resources.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Reliable & Organized",
      description:
        "Get verified notes, latest notices, and well-structured study content in one place.",
    },
  ];

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 "  style={{
    background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #ffedd5 100%)",
  }}>
      
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
        Why Choose Our Platform?
      </h2>

      <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
        A smart and simple way to access study resources, stay updated, and
        connect with your academic community.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
        {features.map((item, index) => (
          <div
            key={index}
            className="
              group
              bg-white/80 backdrop-blur-lg
              p-6 rounded-3xl
              shadow-md hover:shadow-orange-300/40
              border border-gray-100
              transition-all duration-300
              hover:-translate-y-2
              text-center
            "
          >
            {/* Icon */}
            <div className="
              text-4xl 
              text-orange-500 
              mb-4 
              transition-transform duration-300 
              group-hover:scale-110
            ">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="
              text-xl font-semibold text-gray-800 
              group-hover:text-orange-500 
              transition
            ">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChoose;