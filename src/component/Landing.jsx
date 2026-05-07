import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const phoneRef = useRef(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const elements = [contentRef.current];

    if (window.innerWidth >= 1280 && phoneRef.current) {
      elements.push(phoneRef.current);
    }

    gsap.fromTo(
      elements,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", stagger: 0 },
    );
  }, []);

  return (
    <div className="flex h-[70vh] sm:h-screen w-full relative overflow-hidden">
      {/* LEFT SIDE IMAGE */}
      <div className="w-full xl:w-3/4 relative">
        <img
          src="/bgimg.jpg"
          alt="Landing"
          className="w-full h-full object-cover"
        />

        {/* HEADING + PARAGRAPH + BUTTON */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col justify-center items-center text-center 
             xl:block xl:top-40 xl:left-16 xl:text-left xl:items-start px-4"
        >
          <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold text-black leading-snug">
            <span>
              One <span className="border-b-4 border-orange-500">Platform</span>
            </span>
            <br />
            <span>
              All Campus{" "}
              <span className="border-b-4 border-orange-500">Needs</span>
            </span>
          </h1>

          <p className="mt-6 text-gray-700 text-base sm:text-lg xl:text-lg">
            A smarter way to manage academic life — anytime, anywhere.
          </p>

          <button onClick={() => navigate("/login")} className="mt-6 px-8 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition duration-300">
            Get Started
          </button>
        </div>
      </div>

      {/* RIGHT SIDE GRADIENT */}
      <div
        className="hidden xl:block w-1/4"
        style={{
          background:
            "linear-gradient(to bottom, #2c1a0d 0%, #5a341f 40%, #c16825 70%, #d9b38c 100%)",
        }}
      />

      {/* OVERLAY PHONE IMAGE */}
      <img
        ref={phoneRef}
        src="/phoneimg.png"
        alt="Overlay"
        className="hidden xl:block absolute bottom-0 left-[70%] transform -translate-x-1/2 w-[56%] xl:w-1/2 h-auto z-10"
      />
    </div>
  );
};

export default Landing;
