import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUsers, FaBoxes, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isOwner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Determine the dashboard type based on the current URL path
  const isOwnerDashboard = location.pathname.startsWith('/owner-dashboard');
  const isWorkerDashboard = location.pathname.startsWith('/worker-dashboard');

  return (
    <div className=''>
      <div className="container mx-auto lg:hidden p-4 flex justify-between items-center text-white">
        <button onClick={toggleSidebar} className="text-lg md:text-2xl text-blue-600">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="text-md md:text-xl font-bold text-black">
          {isOwnerDashboard ? 'Owner Dashboard' : 'Worker Dashboard'}
        </h1>
      </div>
      <div
        className={`fixed z-10 top-0 left-0 h-full w-64 bg-blue-600 text-white p-5 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:w-64`}
      >
        <h2 className="text-2xl font-bold mb-6">Electrostore</h2>
        <nav>
          <ul className="space-y-2">
            <li onClick={toggleSidebar}>
              <Link to={`${isOwnerDashboard ? '/owner-dashboard' : '/worker-dashboard'}`} className="flex items-center p-2 hover:bg-blue-700 rounded">
                <FaHome className="mr-2" /> Home
              </Link>
            </li>
            {isOwner && isOwnerDashboard && (
              <>
                <li onClick={toggleSidebar}>
                  <Link to="/owner-dashboard/workers" className="flex items-center p-2 hover:bg-blue-700 rounded">
                    <FaUsers className="mr-2" /> Workers
                  </Link>
                </li>
                <li onClick={toggleSidebar}>
                  <Link to="/owner-dashboard/inventory" className="flex items-center p-2 hover:bg-blue-700 rounded">
                    <FaBoxes className="mr-2" /> Inventory
                  </Link>
                </li>
              </>
            )}
            <li onClick={toggleSidebar}>
              <Link to={`${isOwnerDashboard ? '/owner-dashboard/sales' : '/worker-dashboard/sales'}`} className="flex items-center p-2 hover:bg-blue-700 rounded">
                <FaChartLine className="mr-2" /> Sales
              </Link>
            </li>
            <li onClick={toggleSidebar}>
              <Link to="/logout" className="flex items-center p-2 hover:bg-blue-700 rounded">
                <FaSignOutAlt className="mr-2" /> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {isOpen && <div className="fixed inset-0 z-0 bg-black opacity-50 lg:hidden" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Sidebar;
