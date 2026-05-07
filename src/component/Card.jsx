import React from "react";
import { FaBook, FaCalendarAlt, FaBullseye } from "react-icons/fa";


const Card = ({ icon, title, description }) => {
  return (
    <div
      className="
        group
        p-4 sm:p-5 md:p-8
        bg-[#0f0f0f]
        rounded-3xl
        border border-white/10
        shadow-lg md:shadow-xl
        hover:shadow-orange-500/40
        transition-all duration-500
        hover:-translate-y-2 md:hover:-translate-y-3
        h-64 sm:h-72 md:h-96
        flex flex-col justify-start
        relative overflow-hidden
      "
    >
      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(249,115,22,0.15), transparent, rgba(249,115,22,0.15))",
        }}
      ></div>

      {/* Icon */}
      <div
        className="
        text-3xl sm:text-4xl md:text-5xl
        mb-3 sm:mb-4 md:mb-5 
        text-orange-400 
        transition-transform duration-300 
        group-hover:scale-110
        z-10
      "
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="
        text-lg sm:text-xl md:text-2xl
        font-bold text-white 
        group-hover:text-orange-400 
        transition
        z-10
      "
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="
        mt-2 sm:mt-3 md:mt-4
        text-gray-400 
        text-xs sm:text-sm md:text-base
        leading-relaxed
        group-hover:text-gray-300
        transition
        z-10
      "
      >
        {description}
      </p>

      {/* Bottom Accent Line */}
      <div
        className="
        absolute bottom-0 left-0 w-0 h-1
        bg-orange-500 
        group-hover:w-full 
        transition-all duration-500
      "
      ></div>
    </div>
  );
};

// Cards Section
const Cards = () => {
  const cardData = [
    {
      icon: <FaBook />,
      title: "Study Notes",
      description:
        "Access subject-wise notes uploaded by teachers and students.",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Latest Notices",
      description:
        "Stay updated with exam schedules and important announcements.",
    },
    {
      icon: <FaBullseye />,
      title: "Marketplace",
      description:
        "Buy and sell books, notes, and study materials easily.",
    },
  ];

  return (
    <div className="py-12 sm:py-14 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-10">
        {cardData.map((item, index) => (
          <Card
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Cards;