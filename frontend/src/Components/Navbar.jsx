import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user } = useContext(UserContext);

  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const profileImage =
    !imageError &&
    user?.profilePic &&
    typeof user.profilePic === "string" &&
    user.profilePic.trim() !== ""
      ? user.profilePic
      : "/noavatar.png";

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="w-full bg-gray-100 relative z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-16 py-4 md:py-6">

        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 shrink-0">
          <img
            src="/logo.png"
            alt="logo"
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
          />

          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-orange-400 whitespace-nowrap">
            BoiLagbe.com
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-xl font-semibold text-green-600">

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

        {/* Mobile: profile pic (if logged in) + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <Link to="/profile" onClick={closeMenu} className="w-9 h-9 rounded-full border-2 border-orange-400 overflow-hidden flex-shrink-0">
              <img
                key={profileImage}
                src={profileImage}
                alt=""
                className="w-full h-full object-cover block"
                onError={() => setImageError(true)}
              />
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="text-green-600 text-2xl p-1"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-100 border-t border-gray-200 shadow-md flex flex-col items-start px-6 py-4 space-y-4 text-lg font-semibold text-green-600">
          <Link to="/" onClick={closeMenu} className="hover:text-orange-400">
            Home
          </Link>
          <Link to="/about" onClick={closeMenu} className="hover:text-orange-400">
            About
          </Link>
          <Link to="/list" onClick={closeMenu} className="hover:text-orange-400">
            Explore
          </Link>

          {user ? (
            <Link to="/profile" onClick={closeMenu}>
              <span className="bg-orange-400 px-5 py-2 flex items-center justify-center font-semibold text-white rounded-md hover:bg-orange-500">
                Profile
              </span>
            </Link>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              <span className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-md inline-block">
                Account
              </span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;