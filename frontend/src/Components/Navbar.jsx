import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useContext(UserContext);

  const [imageError, setImageError] = useState(false);

  const profileImage =
    !imageError &&
    user?.profilePic &&
    typeof user.profilePic === "string" &&
    user.profilePic.trim() !== ""
      ? user.profilePic
      : "/noavatar.png";

  return (
    <nav className="w-full bg-gray-100 flex items-center justify-between px-6 md:px-16 py-6">

      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.png"
          alt="logo"
          className="w-12 h-12 rounded-full"
        />

        <h1 className="text-4xl font-bold text-orange-400">
          BoiLagbe.com
        </h1>
      </div>

      {/* Menu */}
      <div className="flex items-center space-x-8 text-xl font-semibold text-green-600">

        <Link
          to="/"
          className="hover:text-orange-400"
        >
          Home
        </Link>

        <Link
          to="/about"
          className="hover:text-orange-400"
        >
          About
        </Link>

        <Link
          to="/list"
          className="hover:text-orange-400"
        >
          Explore
        </Link>

        {user ? (
          <Link
            to="/profile"
            className="flex items-center space-x-2"
          >

            {/* PROFILE IMAGE */}
            <div className="w-12 h-12 rounded-full border-2 border-orange-400 overflow-hidden flex-shrink-0">
              <img
                key={profileImage}
                src={profileImage}
                alt=""
                className="w-full h-full object-cover block"
                onError={() => {
                  console.log("Navbar profile image failed");
                  setImageError(true);
                }}
              />
            </div>

            {/* PROFILE BUTTON */}
            <span className="bg-orange-400 w-24 h-9 flex items-center justify-center font-semibold text-white rounded-md hover:bg-orange-500">
              Profile
            </span>

          </Link>
        ) : (
          <Link to="/login">
            <span className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-md">
              Account
            </span>
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;