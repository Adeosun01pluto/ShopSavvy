import React, { useState } from 'react'
import { FaBan, FaChartLine, FaEdit, FaUsers, FaUserTie, FaWarehouse } from 'react-icons/fa'

function OwnerDashboardHome() {
  const [goods, setGoods] = useState([
    { id: 1, name: 'Smartphone X', price: 599.99, quantity: 50 },
    { id: 2, name: 'Laptop Pro', price: 1299.99, quantity: 30 },
    { id: 3, name: 'Wireless Earbuds', price: 149.99, quantity: 100 },
  ]);

  const [workers, setWorkers] = useState([
    { id: 1, name: 'John Doe', sales: 5000 },
    { id: 2, name: 'Jane Smith', sales: 4500 },
  ]);

  const totalUsers = 1000;
  const totalWorkers = workers.length;
  const totalSales = 50000;
  const totalAsset = 100000;

  const editGood = (id) => {
    // Implement edit functionality
    console.log('Editing good with id:', id);
  };

  const toggleWorkerStatus = (id) => {
    // Implement block/unblock functionality
    console.log('Toggling status for worker with id:', id);
  };
  return (
    <div>
      <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <FaUsers className="text-2xl lg:text-3xl text-blue-600 mb-2" />
              <h2 className="text-lg lg:text-xl font-semibold">Total Users</h2>
              <p className="text-xl lg:text-2xl">{totalUsers}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <FaUserTie className="text-2xl lg:text-3xl text-green-600 mb-2" />
              <h2 className="text-lg lg:text-xl font-semibold">Total Workers</h2>
              <p className="text-xl lg:text-2xl">{totalWorkers}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <FaChartLine className="text-2xl lg:text-3xl text-yellow-600 mb-2" />
              <h2 className="text-lg lg:text-xl font-semibold">Total Sales</h2>
              <p className="text-xl lg:text-2xl">${totalSales}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow">
              <FaWarehouse className="text-2xl lg:text-3xl text-purple-600 mb-2" />
              <h2 className="text-lg lg:text-xl font-semibold">Total Asset</h2>
              <p className="text-xl lg:text-2xl">${totalAsset}</p>
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

          {/* Workers List */}
          <h2 className="text-xl lg:text-2xl font-semibold my-4">Workers</h2>
          <div className="space-y-4">
            {workers.map((worker) => (
              <div key={worker.id} className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold">{worker.name}</h3>
                  <p className="text-sm lg:text-base">Sales: ${worker.sales}</p>
                </div>
                <button
                  onClick={() => toggleWorkerStatus(worker.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  <FaBan />
                </button>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default OwnerDashboardHome