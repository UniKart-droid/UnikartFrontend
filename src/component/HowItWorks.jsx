// HowItWorks.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HowItWorks() {
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);

  const steps = [
    { title: "Sign Up", desc: "Register as a student or teacher.", icon: "📝" },
    { title: "Admin Approval", desc: "Admin verifies your account.", icon: "✅" },
    { title: "Login", desc: "Access your dashboard securely.", icon: "🔐" },
    { title: "Browse Marketplace", desc: "View items uploaded by students.", icon: "🛒" },
    { title: "Buy/Sell Items", desc: "Post or purchase academic items.", icon: "💰" },
    { title: "Access Notes", desc: "View or download study materials.", icon: "📚" },
    { title: "Check Notices", desc: "Stay updated with announcements.", icon: "📢" },
  ];

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    cardsRef.current.forEach((card) => {
      tl.fromTo(
        card,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        "+=0.15"
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#0f0f0f] py-20 px-6">
      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
          How It Works
        </h1>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Simple steps to use our platform efficiently
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-2 group"
          >
            {/* Step Number Badge */}
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-full text-sm font-bold shadow-md">
              {index + 1}
            </div>

            {/* Icon */}
            <div className="text-4xl md:text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
              {step.icon}
            </div>

            {/* Title */}
            <h2 className="text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-orange-500">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {step.desc}
            </p>

            {/* Bottom Line */}
            <div className="mt-5 h-0.5 w-0 bg-orange-500 group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;