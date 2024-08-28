import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import WorkerDashboardHome from './WorkerDashboardHome';
import Sales from './Sales';

const WorkerDashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row relative min-h-screen">
      <Sidebar isOwner={false} />
      <div className="mx-auto flex-1 container p-0 py-2 sm:px-4 lg:px-10 overflow-auto">
        <header className="mb-8 hidden lg:block px-4 sticky top-0 z-20">
          <h1 className="text-3xl font-bold">Worker Dashboard</h1>
        </header>
        <main className="">
          <Routes>
            <Route index element={<WorkerDashboardHome />} />
            <Route path="sales" element={<Sales />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;
