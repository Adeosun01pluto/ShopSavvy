import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-7">
            <Link to="/" className="flex items-center py-4 px-2">
              <span className="font-semibold text-gray-500 text-lg">ElectroStore</span>
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-[#435EEF] focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/" className="py-4 px-2 text-gray-500 hover:text-[#435EEF]">
              <FaHome className="inline mr-1" /> Home
            </Link>
            <Link to="/search" className="py-4 px-2 text-gray-500 hover:text-[#435EEF]">
              <FaSearch className="inline mr-1" /> Search
            </Link>
            <Link to="/products" className="py-4 px-2 text-gray-500 hover:text-[#435EEF]">
              <FaSearch className="inline mr-1" /> Products
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="py-2 px-3 font-medium text-[#435EEF] rounded hover:bg-[#435EEF] hover:text-white transition duration-300"
              >
                <FaSignOutAlt className="inline mr-1" /> Logout
              </button>
            ) : (
              <Link to="/login" className="py-2 px-3 font-medium text-white bg-[#435EEF] rounded hover:bg-[#3141B0] transition duration-300">
                <FaUser className="inline mr-1" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col items-center space-y-2 pb-4">
            <Link to="/" className="py-2 px-4 text-gray-500 hover:text-[#435EEF]" onClick={() => setIsOpen(false)}>
              <FaHome className="inline mr-1" /> Home
            </Link>
            <Link to="/search" className="py-2 px-4 text-gray-500 hover:text-[#435EEF]" onClick={() => setIsOpen(false)}>
              <FaSearch className="inline mr-1" /> Search
            </Link>
            <Link to="/products" className="py-2 px-4 text-gray-500 hover:text-[#435EEF]" onClick={() => setIsOpen(false)}>
              <FaSearch className="inline mr-1" /> Products
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="py-2 px-4 text-[#435EEF] hover:bg-[#435EEF] hover:text-white transition duration-300"
              >
                <FaSignOutAlt className="inline mr-1" /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="py-2 px-4 text-white bg-[#435EEF] rounded hover:bg-[#3141B0] transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="inline mr-1" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
