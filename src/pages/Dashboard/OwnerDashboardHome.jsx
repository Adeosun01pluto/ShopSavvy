import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaUsers, FaChartLine, FaUserTie, FaUserCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';

function OwnerDashboardHome() {
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [monthSales, setMonthSales] = useState(0);
  const [allBranchesSales , setAllBranchesSales] = useState(0);
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
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
        // Check if the user is an admin
        if (user.role === 'admin') {
          const branchCollectionRef = collection(db, 'branches');
          const branchSnapshot = await getDocs(branchCollectionRef);
          const branches = branchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
          const allBranchesSales = await Promise.all(branches.map(async (branch) => {
            // Daily sales for each branch
            const dailySalesQuery = query(
              collection(db, 'branches', branch.id, 'sales'),
              where('timestamp', '>=', startOfDay.toISOString()),
              where('timestamp', '<', endOfDay.toISOString())
            );
            const dailySalesSnapshot = await getDocs(dailySalesQuery);
            const dailySalesData = dailySalesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const dailyTotal = dailySalesData.reduce((acc, sale) => {
              const price = parseFloat(sale.price);
              const quantity = parseInt(sale.quantity, 10);
              return acc + (isNaN(price) ? 0 : price * (isNaN(quantity) ? 1 : quantity));
            }, 0);
  
            // Weekly sales for each branch
            const weeklySalesQuery = query(
              collection(db, 'branches', branch.id, 'sales'),
              where('timestamp', '>=', startOfWeek.toISOString()),
              where('timestamp', '<', endOfDay.toISOString())
            );
            const weeklySalesSnapshot = await getDocs(weeklySalesQuery);
            const weeklySalesData = weeklySalesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const weeklyTotal = weeklySalesData.reduce((acc, sale) => {
              const price = parseFloat(sale.price);
              const quantity = parseInt(sale.quantity, 10);
              return acc + (isNaN(price) ? 0 : price * (isNaN(quantity) ? 1 : quantity));
            }, 0);
  
            return {
              branchName: branch.name,
              branchId: branch.id,
              dailySalesTotal: dailyTotal,
              weeklySalesTotal: weeklyTotal,
            };
          }));
          console.log("check", allBranchesSales)
          setAllBranchesSales(allBranchesSales);
        }

      } catch (error) {
        console.error('Error fetching dashboard data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    const fetchLowStockItemsAcrossBranches = async () => {
      try {
        const branchesWithLowStockItems = [];
  
        // Fetch the list of branches
        const branchCollectionRef = collection(db, 'branches');
        const branchSnapshot = await getDocs(branchCollectionRef);
        const branchList = branchSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Loop through each branch and fetch low-stock items
        for (const branch of branchList) {
          const lowStockItems = [];
          const categoriesList = branch.categories || [];
          
          console.log(`Fetching low stock items for branch: &#8358; {branch.id}`);
  
          // Loop through each category in the branch
          for (const category of categoriesList) {
            if (typeof category.name !== 'string') {
              console.error('Invalid category name:', category);
              continue;
            }
  
            const itemsCollection = collection(db, 'branches', branch.id, category.name);
            const itemsSnapshot = await getDocs(itemsCollection);
  
            itemsSnapshot.forEach((doc) => {
              const item = doc.data();
              if (item.stock < 5) {
                lowStockItems.push({
                  branchId: branch.id,
                  branchName: branch.name,
                  brand: item.brand || 'N/A',
                  model: item.model || 'N/A',
                  category: category.name,
                  partName: item.partName || 'N/A',
                  stock: item.stock,
                });
              }
            });
          }
  
          if (lowStockItems.length > 0) {
            branchesWithLowStockItems.push({
              branchId: branch.id,
              branchName: branch.name,
              lowStockItems,
            });
          }
        }
  
        // Set the aggregated low stock items across branches
        setLowStockItems(branchesWithLowStockItems);
        console.log('Branches with Low Stock Items:', branchesWithLowStockItems);
  
      } catch (error) {
        console.error('Error fetching low stock items across branches:', error);
      }
    };
  
    fetchLowStockItemsAcrossBranches();
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users Card */}
          <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow">
            <FaUsers className="text-xl md:text-3xl text-blue-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold">Total Users</h2>
            <p className="text-md md:text-2xl">{totalUsers}</p>
          </div>

          {/* Total Workers Card */}
          <Link to={`/owner-dashboard/workers`} className="bg-green-100 p-3 md:p-4 rounded-lg shadow">
            <FaUserTie className="text-xl md:text-3xl text-green-600 mb-2" />
            <h2 className="text-lg md:text-xl font-semibold">Total Workers</h2>
            <p className="text-md md:text-2xl">{totalWorkers}</p>
          </Link>
          
          {/* Branch-specific sales cards */}
          {allBranchesSales && allBranchesSales.map((branch, index) => (
            <Link to={`/owner-dashboard/sales`} key={index} className="flex flex-col justify-center bg-gray-100 p-3 md:p-4 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
              <h2 className="text-lg md:text-xl font-semibold text-gray-700">{branch.branchName}</h2>
              <p className="text-md md:text-lg  text-gray-600 mt-2">
                <strong>Today's Sales:</strong> &#8358; {branch.dailySalesTotal.toLocaleString()}
              </p>
              <p className="text-md md:text-lg  text-gray-600 mt-1">
                <strong>Week's Sales:</strong> &#8358; {branch.weeklySalesTotal.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg shadow mt-8">
          <h2 className="text-lg md:text-xl font-semibold flex items-center">
            <FaExclamationTriangle className="text-yellow-600 mr-2" />
            Low Stock Alert
          </h2>
          {lowStockItems.length === 0 ? (
            <p>No items are currently low in stock.</p>
          ) : (
            <div className="mt-2">
              {lowStockItems.map((branch, branchIndex) => (
                <div key={branchIndex} className="mb-4">
                  <h3 className="text-md font-bold text-gray-800">
                    {branch.branchName} (Branch ID: {branch.branchId})
                  </h3>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {branch.lowStockItems.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.brand} {item.model} ({item.stock} left)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardHome;
