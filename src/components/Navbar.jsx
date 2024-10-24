import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { AiOutlineProduct } from 'react-icons/ai';
import { RxDashboard } from 'react-icons/rx';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Access user from context

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          if(userDoc.data().isAdmin){
            setUserRole("Admin")
          }
          if(userDoc.data().isWorker){
            setUserRole("Worker")
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
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
  const handleProductClick = () => {
    if (user?.role === 'worker' && user.branchId) {
      navigate(`/products/${user.branchId}`); // Route to worker's branch
    }
  };

  const handleDashboardClick = () => {
    if (userRole === 'Admin') {
      navigate('/owner-dashboard');
    } else if (userRole === 'Worker') {
      navigate('/worker-dashboard');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-7">
            <Link to="/" className="flex items-center py-4">
              <span className="font-semibold text-gray-500 text-xl">Royal Band</span>
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
            {user?.role === 'worker' ? (
              <button
                onClick={handleProductClick}
                className="py-4 px-2 text-gray-500 hover:text-[#435EEF]"
              >
                <AiOutlineProduct className="inline mr-1" /> Products
              </button>
            ) : user?.role === 'admin' ? (
              <Link
                to="/branch-selection"
                className="py-4 px-2 text-gray-500 hover:text-[#435EEF]"
              >
                Branches
              </Link>
            ) : null}
            <button
              onClick={handleDashboardClick}
              className="py-4 px-2 text-gray-500 hover:text-[#435EEF]"
            >
              <RxDashboard className="inline mr-1" /> Dashboard
            </button>
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
            {user?.role === 'worker' ? (
              <button
                onClick={() => {
                  handleProductClick();
                  setIsOpen(false);
                }}
                className="py-2 px-4 text-gray-500 hover:text-[#435EEF]"
              >
                <AiOutlineProduct className="inline mr-1" /> Products
              </button>
            ) : user?.role === 'admin' ? (
              <Link
                to="/branch-selection"
                className="py-2 px-4 text-gray-500 hover:text-[#435EEF]"
                onClick={() => setIsOpen(false)}
              >
                Branches
              </Link>
            ) : null}
            <button
              onClick={() => {
                handleDashboardClick();
                setIsOpen(false);
              }}
              className="py-2 px-4 text-gray-500 hover:text-[#435EEF]"
            >
              <RxDashboard className="inline mr-1" /> Dashboard
            </button>
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
