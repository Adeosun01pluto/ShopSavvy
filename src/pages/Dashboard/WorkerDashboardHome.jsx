import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase/config'; // Ensure you have the correct path
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBoxes, FaChartLine, FaEdit, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { useAuth } from '../../context/AuthContext';

function WorkerDashboardHome() {
  const [dailySales, setDailySales] = useState([]);
  const [weeklySales, setWeeklySales] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const {user} = useAuth()

  // Fetch daily's and weekly's sales 
  useEffect(() => {
    const fetchSalesData = async () => {
      if (!user || !user.uid) {
        console.log('No logged-in user');
        return;
      }
      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Start date for weekly sales
        // Log the date range to ensure correctness
        // console.log('Start of Day:', startOfDay.toISOString());
        // console.log('End of Day:', endOfDay.toISOString());
        // Fetch sales for today by the logged-in worker
        const salesQuery = query(
          collection(db, 'branches', user.branchId, "sales"),
          where('timestamp', '>=', startOfDay.toISOString()),
          where('timestamp', '<', endOfDay.toISOString()),
          where('workerId', '==', user.uid) // Filter sales by the logged-in worker
        );
        const salesSnapshot = await getDocs(salesQuery);
        if (salesSnapshot.empty) {
          console.log('No sales found for today.');
          setDailySales([]);
          setTotalItemsSold(0);
          return;
        }
        const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log('Sales Data:', sales);
        // Sum up prices and set daily sales
        const totalSales = sales.reduce((acc, sale) => {
          const price = parseFloat(sale.price);
          const quantity = parseInt(sale.quantity, 10);
          return acc + (isNaN(price) ? 0 : price * (isNaN(quantity) ? 1 : quantity)); // Multiply price by quantity and add to accumulator
        }, 0);
        // Set daily sales total
        setDailySales(totalSales);
        setTotalItemsSold(sales.length);
        
        // Fetch weekly sales data
        const weeklySalesQuery = query(
          collection(db, 'branches', user.branchId, 'sales'),
          where('timestamp', '>=', startOfWeek.toISOString()),
          where('timestamp', '<', endOfDay.toISOString()),
          where('workerId', '==', user.uid)
        );
        const weeklySalesSnapshot = await getDocs(weeklySalesQuery);
        
        const weeklySalesData = weeklySalesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Weekly Sales Data:', weeklySalesData);

        // Calculate total weekly sales
        const weeklyTotal = weeklySalesData.reduce((acc, sale) => {
          const price = parseFloat(sale.price);
          const quantity = parseInt(sale.quantity, 10);
          return acc + (isNaN(price) ? 0 : price * (isNaN(quantity) ? 1 : quantity));
        }, 0);

        setWeeklySales(weeklyTotal);


      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally{
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [user]);
  
  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const lowStockItems = [];
        const branchRef = doc(db, 'branches', user.branchId);
        const branchDoc = await getDoc(branchRef);

        // Get the list of categories from the branch document
        const categoriesList = branchDoc.data()?.categories || [];
        console.log('Categories List:', categoriesList);

        // Loop through each category in the categories list
        for (const categoryName of categoriesList) {
          if (typeof categoryName.name !== 'string') {
            console.error('Invalid category name:', categoryName);
            continue;
          }
          // Accessing the collection within the branch based on category name
          const itemsCollection = collection(db, 'branches', user.branchId, categoryName.name);
          const itemsSnapshot = await getDocs(itemsCollection);

          itemsSnapshot.forEach((doc) => {
            const item = doc.data();
            if (item.stock < 5) {
              lowStockItems.push({
                brand: item.brand || 'N/A',
                model: item.model || 'N/A',
                category: categoryName,
                partName: item.partName || 'N/A',
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
  }, [user.branchId]);
  
  if (loading) {
    return (
      <div className="flex justify-center">
        <ThreeDots color="#435EEF" height={50} width={50} />
      </div>
    );
  }


  return (
    <div className='px-3 sm:p-0'>
      {/* Logged-In User Info */}
        <div className="bg-indigo-100 p-3 md:p-4 rounded-lg shadow mb-8">
          <div className="flex items-center gap-4">
            <FaUser className="text-xl md:text-7xl text-gray-600 mr-4" />
            <div>
              {user && (
                <div>
                  {/* <p className="text-md md:text-xl">Name: {user.displayName || 'N/A'}</p> */}
                  <p className="text-md md:text-xl">Email: {user.email}</p>
                  <p className="text-md md:text-xl">Role: {user.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-3 md:p-4 rounded-lg shadow">
          <FaChartLine className="text-xl md:text-3xl text-green-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold">Today's Sales</h2>
          <p className="text-md md:text-2xl">&#8358;{dailySales.toLocaleString()}</p>
          {/* <p className="text-md md:text-2xl">No Available Yet</p> */}
        </div>
        <div className="bg-orange-100 p-3 md:p-4 rounded-lg shadow">
          <FaChartLine className="text-xl md:text-3xl text-green-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold">Weekly's Sales</h2>
          <p className="text-md md:text-2xl">&#8358;{weeklySales.toLocaleString()}</p>
          {/* <p className="text-md md:text-2xl">No Available Yet</p> */}
        </div>
        <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow">
          <FaBoxes className="text-xl md:text-3xl text-blue-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold">Total Items Sold</h2>
          <p className="text-md md:text-2xl">{totalItemsSold}</p>
          {/* <p className="text-md md:text-2xl">No Available Yet</p> */}
        </div>
      </div>

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
