import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaUsers, FaChartLine, FaUserTie, FaUserCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { ThreeDots } from 'react-loader-spinner';

function OwnerDashboardHome() {
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [monthSales, setMonthSales] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(usersSnapshot.size);

        // Get total workers by filtering based on their role
        const workersQuery = query(collection(db, 'users'), where('role', '==', 'worker'));
        const workersSnapshot = await getDocs(workersQuery);
        setTotalWorkers(workersSnapshot.size);

        // Get sales data from branches
        const branchesSnapshot = await getDocs(collection(db, 'branches'));
        const salesData = [];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        for (const branchDoc of branchesSnapshot.docs) {
          const salesSnapshot = await getDocs(collection(branchDoc.ref, 'sales'));
          salesSnapshot.forEach(saleDoc => {
            const sale = saleDoc.data();
            if (sale.userId === user.uid) {
              const saleDate = new Date(sale.timestamp);
              const salePrice = Number(sale.price) || 0;
              const quantity = Number(sale.quantity) || 1;
              const totalSaleAmount = salePrice * quantity;

              salesData.push({ saleDate, totalSaleAmount });

              if (saleDate >= today) {
                todaySales += totalSaleAmount;
              }
              if (saleDate >= lastMonth) {
                monthSales += totalSaleAmount;
              }
            }
          });
        }

        setTodaySales(todaySales);
        setMonthSales(monthSales);
      } catch (error) {
        console.error('Error fetching dashboard data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const collections = ['laptops', 'phones', 'gadgets'];
        const lowStockItems = [];

        for (const collectionName of collections) {
          const itemsSnapshot = await getDocs(collection(db, collectionName));
          itemsSnapshot.forEach(doc => {
            const item = doc.data();
            if (item.stock < 20) {
              lowStockItems.push({
                brand: item.brand,
                model: item.model,
                stock: item.stock,
              });
            }
          });
        }
        setLowStockItems(lowStockItems);
      } catch (error) {
        console.error('Error fetching low stock items:', error);
      }
    };

    fetchLowStockItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <ThreeDots color="#435EEF" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className='px-3 sm:p-0'>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow">
            <FaUsers className="text-xl md:text-3xl text-blue-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold">Total Users</h2>
            <p className="text-md md:text-2xl">{totalUsers}</p>
          </div>
          <div className="bg-green-100 p-3 md:p-4 rounded-lg shadow">
            <FaUserTie className="text-xl md:text-3xl text-green-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold">Total Workers</h2>
            <p className="text-md md:text-2xl">{totalWorkers}</p>
          </div>
          <div className="bg-yellow-100 p-3 md:p-4 rounded-lg shadow">
            <FaChartLine className="text-xl md:text-3xl text-yellow-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold">Today's Sales</h2>
            <p className="text-md md:text-2xl">${todaySales}</p>
          </div>
          <div className="bg-purple-100 p-3 md:p-4 rounded-lg shadow">
            <FaChartLine className="text-xl md:text-3xl text-purple-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold">This Month's Sales</h2>
            <p className="text-md md:text-2xl">${monthSales}</p>
          </div>
        </div>

        <div className="bg-indigo-100 p-3 md:p-4 rounded-lg shadow mb-8">
          <div className="md:flex p-3 md:p-4 items-center gap-4">
            <FaUserCircle className="text-3xl md:text-7xl text-indigo-600 mb-2" />
            <div>
              {user && (
                <div>
                  <p className="text-md md:text-xl">Email: {user.email}</p>
                  <p className="text-md md:text-xl">Role: {user.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg shadow mt-8">
          <h2 className="text-lg md:text-xl font-semibold flex items-center">
            <FaExclamationTriangle className="text-yellow-600 mr-2" />
            Low Stock Alert
          </h2>
          {lowStockItems.length === 0 ? (
            <p>No items are currently low in stock.</p>
          ) : (
            <ul className="list-disc list-inside mt-2">
              {lowStockItems.map((item, index) => (
                <li key={index}>
                  {item.brand} {item.model} ({item.stock} left)
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardHome;
