import React, { useEffect, useRef, useState } from "react";

const About = ({ animate = false }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!animate); 
  // animate false hole shuru theke i visible true thakbe (static)

  useEffect(() => {
    if (!animate) return; // animation na thakle observer lagbe na

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [animate]);

  return (
    <div
      ref={sectionRef}
      className="w-full py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-12"
    >
      {/* Image */}
<div
  className={`relative w-full md:w-1/2 ${
    animate
      ? `transition-all duration-1000 ease-out ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
        }`
      : ""
  }`}
>
  {/* Decorative Orange Box behind image */}
  <div className="absolute top-4 left-4 w-full h-full border-4 border-orange-400 rounded-2xl z-0 hidden md:block"></div>

  <img
    src="homeb.jpg"
    alt="About BoiLagbe"
    className="relative z-10 w-full rounded-2xl border-2 border-orange-400 shadow-md object-cover"
  />
</div>

      {/* Text */}
      <div
        className={`w-full md:w-1/2 ${
          animate
            ? `transition-all duration-1000 ease-out delay-150 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"
              }`
            : ""
        }`}
      >
        <p className="text-green-600 font-bold uppercase tracking-wide mb-2">
          Who We Are
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-orange-400 mb-6">
          About BoiLagbe
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          We believe that books should not gather dust on shelves.{" "}
          <span className="text-green-600 font-semibold">BoiLagbe.com</span> is a
          community-driven platform designed to connect book lovers across
          Bangladesh. Whether you are a student looking for affordable
          textbooks or a fiction lover hunting for a rare gem, we are here to
          make book sharing easy and sustainable.
        </p>

        <div className="flex gap-10">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">5k+</h3>
            <p className="text-gray-500">Books Available</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">2k+</h3>
            <p className="text-gray-500">Happy Readers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;