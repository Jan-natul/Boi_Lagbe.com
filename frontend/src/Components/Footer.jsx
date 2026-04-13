import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#ff8c00] text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Section */}
        <div className="col-span-1">
          <h2 className="text-4xl font-bold mb-6">BoiLagbe</h2>
          <p className="text-white text-lg leading-relaxed max-w-xs">
            Give your old books a new home. The best platform to buy, sell, and exchange books in Bangladesh.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
          <ul className="space-y-4 text-lg">
            <li><Link to="/" className="hover:underline transition">Home</Link></li>
            <li><Link to="/about" className="hover:underline transition">About Us</Link></li>
            <li><Link to="/explore" className="hover:underline transition">Explore Books</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Categories</h3>
          <ul className="space-y-4 text-lg">
            <li><a href="#" className="hover:underline transition">Fiction</a></li>
            <li><a href="#" className="hover:underline transition">Academic</a></li>
            <li><a href="#" className="hover:underline transition">Comics</a></li>
            <li><a href="#" className="hover:underline transition">Self-Help</a></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
          <p className="text-white text-lg mb-6">
            Join our community on social media for updates.
          </p>
          <div className="flex space-x-4">
            {/* Facebook */}
            <a href="#" className="bg-white p-3 rounded-full text-[#ff8c00] hover:bg-gray-100 transition">
              <FaFacebookF size={24} />
            </a>
            {/* Instagram */}
            <a href="#" className="bg-white p-3 rounded-full text-[#ff8c00] hover:bg-gray-100 transition">
              <FaInstagram size={24} />
            </a>
            {/* Twitter */}
            <a href="#" className="bg-white p-3 rounded-full text-[#ff8c00] hover:bg-gray-100 transition">
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Border and Copyright */}
      <div className="border-t border-white mt-16 pt-6 text-center text-lg">
        &copy; 2026 BoiLagbe.com. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;