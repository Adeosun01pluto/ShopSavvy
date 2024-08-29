import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase/config'; // Ensure you have the correct path
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBoxes, FaChartLine, FaEdit, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

function WorkerDashboardHome() {
  const [goods, setGoods] = useState([
    { id: 1, name: 'Smartphone X', price: 599.99, quantity: 50 },
    { id: 2, name: 'Laptop Pro', price: 1299.99, quantity: 30 },
    { id: 3, name: 'Wireless Earbuds', price: 149.99, quantity: 100 },
  ]);

  const [dailySales, setDailySales] = useState([]);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);

  console.log(lowStockItems, "lowStockItems")
  
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
    const fetchSalesData = async () => {
      if (!loggedInUser || !loggedInUser.uid) {
        console.log('No logged-in user');
        return;
      }

      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        // Log the date range to ensure correctness
        console.log('Start of Day:', startOfDay.toISOString());
        console.log('End of Day:', endOfDay.toISOString());

        // Fetch sales for today by the logged-in worker
        const salesQuery = query(
          collection(db, 'sales'),
          where('timestamp', '>=', startOfDay.toISOString()),
          where('timestamp', '<', endOfDay.toISOString()),
          where('workerId', '==', loggedInUser.uid) // Filter sales by the logged-in worker
        );

        const salesSnapshot = await getDocs(salesQuery);

        if (salesSnapshot.empty) {
          console.log('No sales found for today.');
          setDailySales([]);
          setTotalItemsSold(0);
          return;
        }

        const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log('Sales Data:', sales);
        // Sum up prices and set daily sales
        const totalSales = sales.reduce((acc, sale) => {
          const price = parseFloat(sale.price);
          const quantity = parseInt(sale.quantity, 10);
          return acc + (isNaN(price) ? 0 : price * (isNaN(quantity) ? 1 : quantity)); // Multiply price by quantity and add to accumulator
        }, 0);

        // Set daily sales total
        setDailySales(totalSales);
        setTotalItemsSold(sales.length);

      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [loggedInUser]);
  
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
  
  if (loading) return <div className='flex items-center justify-center w-full min-h-[40vh]'>
    <ThreeDots className="text-center"/>
  </div>;

  return (
    <div className='px-3 sm:p-0'>
      {/* Logged-In User Info */}
        <div className="bg-indigo-100 p-3 md:p-4 rounded-lg shadow mb-8">
          <div className="flex items-center gap-4">
            <FaUser className="text-xl md:text-7xl text-gray-600 mr-4" />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-100 p-3 md:p-4 rounded-lg shadow">
          <FaChartLine className="text-xl md:text-3xl text-green-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold">Today's Sales</h2>
          <p className="text-md md:text-2xl">${dailySales}</p>
        </div>
        <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow">
          <FaBoxes className="text-xl md:text-3xl text-blue-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold">Total Items Sold</h2>
          <p className="text-md md:text-2xl">{totalItemsSold}</p>
        </div>
      </div>

      {/* Sales Chart
      <h2 className="text-lg lg:text-2xl font-semibold mb-4">Sales Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer> */}

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
  );
}

export default WorkerDashboardHome;
