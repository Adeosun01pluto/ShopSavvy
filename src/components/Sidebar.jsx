import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUsers, FaBoxes, FaChartLine, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isOwner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Determine the dashboard type based on the current URL path
  const isOwnerDashboard = location.pathname.startsWith('/owner-dashboard');
  const isWorkerDashboard = location.pathname.startsWith('/worker-dashboard');

  return (
    <div className='relative'>
      <button
        className="absolute z-50 top-2 left-4 p-2 bg-blue-600 text-white rounded-md lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div
        className={`fixed z-10 top-0 left-0 h-full w-64 bg-blue-600 text-white p-5 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:w-64`}
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to={`${isOwnerDashboard ? '/owner-dashboard' : '/worker-dashboard'}`} className="flex items-center p-2 hover:bg-blue-700 rounded">
                <FaHome className="mr-2" /> Home
              </Link>
            </li>
            {isOwner && isOwnerDashboard && (
              <>
                <li>
                  <Link to="/owner-dashboard/workers" className="flex items-center p-2 hover:bg-blue-700 rounded">
                    <FaUsers className="mr-2" /> Workers
                  </Link>
                </li>
                <li>
                  <Link to="/owner-dashboard/sales" className="flex items-center p-2 hover:bg-blue-700 rounded">
                    <FaChartLine className="mr-2" /> Sales
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to={`${isOwnerDashboard ? '/owner-dashboard/inventory' : '/worker-dashboard/inventory'}`} className="flex items-center p-2 hover:bg-blue-700 rounded">
                <FaBoxes className="mr-2" /> Inventory
              </Link>
            </li>
            <li>
              <Link to={`${isOwnerDashboard ? '/owner-dashboard/messages' : '/worker-dashboard/messages'}`} className="flex items-center p-2 hover:bg-blue-700 rounded">
                <FaEnvelope className="mr-2" /> Messages
              </Link>
            </li>
            <li>
              <Link to="/logout" className="flex items-center p-2 hover:bg-blue-700 rounded">
                <FaSignOutAlt className="mr-2" /> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
