import React, { useState } from 'react';
import { FaUsers, FaUserTie, FaChartLine, FaWarehouse, FaEdit, FaBan } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import OwnerDashboardHome from './OwnerDashboardHome';
import { Route, Routes } from 'react-router-dom';
import Workers from './Workers';
import Inventory from './Inventory';
import Sales from './Sales';

const OwnerDashboard = () => {

  return (
    <div className="flex flex-col lg:flex-row relative">
      <Sidebar isOwner={true} />
      <div className="flex-1 p-4 lg:p-10">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">Owner Dashboard</h1>
      
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route index element={<OwnerDashboardHome />} />
            <Route path="workers" element={<Workers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<Sales />} />
            {/* 
            <Route path="edit-profile" element={<EditProfile />} />
            {isAdmin && (
              <>
                <Route path="customers" element={<Customers />} />
                <Route path="price-list" element={<PriceList />} />
                <Route path="blog-manager" element={<BlogManager />} />
                <Route path="notifications" element={<Notifications />} />
              </>
            )} */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
