import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Context ইমপোর্ট করুন

const Navbar = () => {
  // useState বা useEffect আর লাগবে না
  // সরাসরি Context থেকে user ডাটা নিন
  const { user } = useContext(UserContext);

  return (
    <nav className="w-full bg-gray-100 flex items-center justify-between px-6 md:px-16 py-6">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="logo.png" alt="logo" className="w-12 h-12 rounded-full" />
        <h1 className="text-4xl font-bold text-orange-400">BoiLagbe.com</h1>
      </div>

      {/* Menu */}
      <div className="flex items-center space-x-8 text-xl font-semibold text-green-600">
        <Link to="/" className="hover:text-orange-400">Home</Link>
        <Link to="/about" className="hover:text-orange-400">About</Link>
        <Link to="/list" className="hover:text-orange-400">Explore</Link>

        {/* Conditional Rendering using Context Data */}
        {user ? (
          <Link to="/profile" className="flex items-center space-x-2">
            <img
              src={`/${user.profilePic || "noavatar.png"}`}
              alt="profile"
              className="w-12 h-12 rounded-full border-2 border-orange-400 object-cover"
            />
            <button className="bg-orange-400 w-24 h-9 font-semibold text-white px-4 py-1 rounded-md hover:bg-orange-500">
              Profile
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-md">
              Account
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;