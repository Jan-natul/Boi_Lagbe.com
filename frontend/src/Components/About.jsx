import React from "react";

const About = () => {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Image */}
        <div className="relative">
          {/* Decorative Orange Box behind image */}
          <div className="absolute top-4 left-4 w-full h-full border-4 border-orange-400 rounded-2xl z-0 hidden md:block"></div>
          
          <img
            src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="About BoiLagbe"
            className="relative z-10 w-full h-[350px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Right Side: Text */}
        <div className="font-sans">
          <h4 className="text-green-600 font-bold tracking-wider uppercase mb-2">
            Who We Are
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-orange-400 mb-6 font-Grandstander">
            About BoiLagbe
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We believe that books should not gather dust on shelves. 
            <span className="font-semibold text-green-700"> BoiLagbe.com </span> 
            is a community-driven platform designed to connect book lovers across Bangladesh. 
            Whether you are a student looking for affordable textbooks or a fiction lover 
            hunting for a rare gem, we are here to make book sharing easy and sustainable.
          </p>
          
          {/* Stats Row */}
          <div className="flex space-x-8 mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-800">5k+</h3>
              <p className="text-sm text-gray-500">Books Available</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">2k+</h3>
              <p className="text-sm text-gray-500">Happy Readers</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;