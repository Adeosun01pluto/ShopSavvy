import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config'; // Ensure you have the correct path
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { FaUsers, FaChartLine, FaUserTie, FaUserCircle, FaExclamationTriangle } from 'react-icons/fa';

function OwnerDashboardHome() {
  const [sales, setSales] = useState([]);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [weekSales, setWeekSales] = useState(0);
  const [monthSales, setMonthSales] = useState(0);
  const [role, setRole] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);


  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      setLoggedInUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid)); // Adjust path as needed
        if (userDoc.exists()) {
          setRole(userDoc.data().isWorker ? 'worker' : userDoc.data().isAdmin ? 'admin' : 'none');
        }
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(usersSnapshot.size);

        // Fetch workers count
        const workersQuery = query(collection(db, 'users'), where('isWorker', '==', true));
        const workersSnapshot = await getDocs(workersQuery);
        setTotalWorkers(workersSnapshot.size);

        // Fetch sales for today, last week, and last month
        const salesSnapshot = await getDocs(collection(db, 'sales'));
        const salesData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        let todayTotal = 0;
        let weekTotal = 0;
        let monthTotal = 0;
        
        const salesByDay = {};
                
        salesData.forEach(sale => {        
          // Convert the timestamp string to a Date object
          const saleDate = new Date(sale.timestamp); 
          
          // Ensure the sale price and quantity are treated as numbers
          const salePrice = Number(sale.price) || 0;
          const quantity = Number(sale.quantity) || 1; // Default to 1 if quantity is not provided
          
          const totalSaleAmount = salePrice * quantity; // Multiply price by quantity
          
          if (saleDate >= today) todayTotal += totalSaleAmount;
          if (saleDate >= lastWeek) weekTotal += totalSaleAmount;
          if (saleDate >= lastMonth) monthTotal += totalSaleAmount;
        
          const day = saleDate.toISOString().split('T')[0];
          if (!salesByDay[day]) {
            salesByDay[day] = 0;
          }
          salesByDay[day] += totalSaleAmount;
        });
        
        // Log the totals
        setTodaySales(todayTotal);
        setWeekSales(weekTotal);
        setMonthSales(monthTotal);
        const salesChartData = Object.keys(salesByDay).map(day => ({
          date: day,
          sales: salesByDay[day]
        }));

        setSales(salesChartData);
      } catch (error) {
        console.error('Error fetching dashboard data: ', error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const collections = ['laptops', 'phones', 'gadgets'];
        const lowStockItems = [];
        
        for (const collectionName of collections) {
          const itemsCollection = collection(db, collectionName);
          const itemsSnapshot = await getDocs(itemsCollection);
          itemsSnapshot.forEach(doc => {
            const item = doc.data();
            if (item.stock < 20) {
              lowStockItems.push({
                brand: item.brand,
                model: item.model,
                category: item.category,
                partName: item.partName,
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
  return (
    <div className='px-3 sm:p-0'>
      <div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow">
            <FaUsers className="text-xl md:text-3xl text-blue-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold">Total Users</h2>
            <p className="text-md md:text-2xl">{totalUsers}</p>
          </div>
          <div className="bg-green-100 p-3 md:p-4 rounded-lg shadow">
            <FaUserTie className="text-xl md:text-3xl text-green-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold ">Total Workers</h2>
            <p className="text-md md:text-2xl">{totalWorkers}</p>
          </div>
          <div className="bg-yellow-100 p-3 md:p-4 rounded-lg shadow">
            <FaChartLine className="text-xl md:text-3xl text-yellow-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold ">Today's Sales</h2>
            <p className="text-md md:text-2xl">${todaySales}</p>
          </div>
          <div className="bg-purple-100 p-3 md:p-4 rounded-lg shadow">
            <FaChartLine className="text-xl md:text-3xl text-purple-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold ">This Month's Sales</h2>
            <p className="text-md md:text-2xl">${monthSales}</p>
          </div>
        </div>

        {/* Logged-in User Card */}
        <div className="bg-indigo-100 p-3 md:p-4 rounded-lg shadow mb-8">
          <div className="md:flex p-3 md:p-4 items-center gap-4">
            <FaUserCircle className="text-3xl md:text-7xl text-indigo-600 mb-2" />
            <div>
              {loggedInUser && (
                <div>
                  <p className="text-md md:text-xl">Name: {loggedInUser.displayName || 'N/A'}</p>
                  <p className="text-md md:text-xl">Email: {loggedInUser.email}</p>
                  <p className="text-md md:text-xl">Role: {role}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <h2 className="text-lg lg:text-2xl font-semibold mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        {/* Users Chart */}
        <h2 className="text-lg lg:text-2xl font-semibold mt-8 mb-4">Users Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[{ name: 'Users', value: totalUsers }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        {/* Low Stock Alert */}
        <div className="bg-yellow-100 p-4 rounded-lg shadow mt-8">
          <h2 className="text-lg md:text-xl font-semibold flex items-center">
            <FaExclamationTriangle className="text-yellow-600 mr-2" />
            Low Stock Alert
          </h2>
          <p className='text-sm md:text-md'>The following items are running low:</p>
          {lowStockItems.length === 0 ? (
            <p className='text-sm md:text-md'>No items are currently low in stock.</p>
          ) : (
            <ul className="list-disc list-inside mt-2">
              {lowStockItems.map((item, index) => (
                <li key={index} className='text-sm md:text-md'>
                {item.brand && item.model ? `${item.brand} ${item.model}` :
                  item.brand ? item.brand :
                  item.model ? item.model :
                  item.partName ? item.partName :
                  item.category} ({item.stock} left)
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
