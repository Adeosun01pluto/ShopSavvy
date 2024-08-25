// WorkerDashboard.js
import React, { useState } from 'react';
import { FaBoxes, FaChartLine, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const WorkerDashboard = () => {
  const [goods, setGoods] = useState([
    { id: 1, name: 'Smartphone X', price: 599.99, quantity: 50 },
    { id: 2, name: 'Laptop Pro', price: 1299.99, quantity: 30 },
    { id: 3, name: 'Wireless Earbuds', price: 149.99, quantity: 100 },
  ]);

  const [salesData, setSalesData] = useState({
    todaySales: 1500,
    totalSold: 25,
  });

  const [message, setMessage] = useState('');

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    // Implement message sending functionality
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="flex">
      <Sidebar isOwner={false} />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Worker Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <FaChartLine className="text-3xl text-green-600 mb-2" />
            <h2 className="text-xl font-semibold">Today's Sales</h2>
            <p className="text-2xl">${salesData.todaySales}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <FaBoxes className="text-3xl text-blue-600 mb-2" />
            <h2 className="text-xl font-semibold">Total Items Sold</h2>
            <p className="text-2xl">{salesData.totalSold}</p>
          </div>
        </div>

        {/* Inventory List */}
        <h2 className="text-xl lg:text-2xl font-semibold mb-4">Inventory</h2>
        <div className="space-y-4">
          {goods.map((good) => (
            <div key={good.id} className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg lg:text-xl font-semibold">{good.name}</h3>
                <p className="text-sm lg:text-base">Price: ${good.price}</p>
                <p className="text-sm lg:text-base">Quantity: {good.quantity}</p>
              </div>
              <button
                onClick={() => editGood(good.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                <FaEdit />
              </button>
            </div>
          ))}
        </div>

        {/* Message to Owner */}
        <h2 className="text-2xl font-semibold my-4">Message to Owner</h2>
        <form onSubmit={handleMessageSubmit} className="mb-8">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Report low stock or requested items..."
          ></textarea>
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>

        {/* Low Stock Alert */}
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold flex items-center">
            <FaExclamationTriangle className="text-yellow-600 mr-2" />
            Low Stock Alert
          </h2>
          <p>The following items are running low:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Laptop Pro (5 left)</li>
            <li>Wireless Earbuds (10 left)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;