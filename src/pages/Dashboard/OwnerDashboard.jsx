import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import OwnerDashboardHome from './OwnerDashboardHome';
import Workers from './Workers';
import Inventory from './Inventory';
import Sales from './Sales';
import AddCollection from './AddCollection';

const OwnerDashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row relative min-h-screen">
      <Sidebar isOwner={true} />
      <div className="flex-1 container p-0 py-2 sm:px-4 lg:px-10 overflow-auto mx-auto">
        <header className="mb-8 hidden lg:block px-4 sticky top-0 z-20">
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        </header>
        <main className="">
          <Routes>
            <Route index element={<OwnerDashboardHome />} />
            <Route path="workers" element={<Workers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<Sales />} />
            <Route path="add-collection" element={<AddCollection />} /> {/* New route */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
