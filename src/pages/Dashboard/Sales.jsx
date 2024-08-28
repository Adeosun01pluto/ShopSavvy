import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { FaDollarSign } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
  
        if (!user) throw new Error('User not authenticated');
  
        // Fetch the current user's data from the 'users' collection
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (!userDocSnap.exists()) {
          throw new Error('User document not found');
        }
  
        const userData = userDocSnap.data();
        const isAdmin = userData.isAdmin || false; // Determine if the user is an admin
  
        // Construct the query based on user role
        let salesQuery;
        if (isAdmin) {
          salesQuery = query(collection(db, 'sales')); // Fetch sales for all workers
        } else {
          salesQuery = query(collection(db, 'sales'), where('workerId', '==', user.uid)); // Fetch sales for the current worker
        }
  
        const salesSnapshot = await getDocs(salesQuery);
        const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        // Fetch product details based on productId and category
        const updatedSales = await Promise.all(salesList.map(async (sale) => {
          const productRef = doc(db, sale.category, sale.productId);
          const productSnap = await getDoc(productRef);
          const productData = productSnap.exists() ? productSnap.data() : {};
  
          // Fetch the worker's details using workerId
          const workerRef = doc(db, 'users', sale.workerId);
          const workerSnap = await getDoc(workerRef);
          const workerData = workerSnap.exists() ? workerSnap.data() : {};
          
          return {
            ...sale,
            productBrand: productData?.brand || '',
            productModel: productData.model || 'Unknown Model',
            category: sale.category,
            quantity: sale.quantity,
            productPrice: productData.price,
            workerName: workerData.name,
            amount: productData.price ? sale.quantity * productData.price : 'Unknown Price',
            soldBy: workerData.email || 'Unknown Email', // Include the worker's email
          };
        }));
  
        setSales(updatedSales);
      } catch (error) {
        setError('Error fetching sales data');
        console.error('Error fetching sales: ', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSales();
  }, []);
  

  useEffect(() => {
    const applyFilters = () => {
      let now = new Date();
      let filtered = [...sales];
      let total = 0;

      // Filter by date
      if (filter === 'today') {
        filtered = filtered.filter(sale => {
          const saleDate = new Date(sale.timestamp);
          return saleDate.toDateString() === now.toDateString();
        });
      } else if (filter === 'yesterday') {
        let yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        filtered = filtered.filter(sale => {
          const saleDate = new Date(sale.timestamp);
          return saleDate.toDateString() === yesterday.toDateString();
        });
      } else if (filter === 'lastWeek') {
        let lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filtered = filtered.filter(sale => {
          const saleDate = new Date(sale.timestamp);
          return saleDate >= lastWeek && saleDate <= now;
        });
      } else if (filter === 'lastMonth') {
        let lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = filtered.filter(sale => {
          const saleDate = new Date(sale.timestamp);
          return saleDate >= lastMonth && saleDate <= now;
        });
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(sale => {
          return sale.productId.includes(searchTerm) || sale.category.includes(searchTerm);
        });
      }

      // Calculate total amount
      total = filtered.reduce((sum, sale) => {
        return sum + (typeof sale.amount === 'number' ? sale.amount : 0);
      }, 0);

      setFilteredSales(filtered);
      setTotalAmount(total);
    };

    applyFilters();
  }, [sales, filter, searchTerm]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <div className='flex items-center justify-center w-full min-h-[40vh]'>
    <ThreeDots className="text-center"/>
  </div>;
  if (error) return <p>{error}</p>;
  console.log(filteredSales)
  return (
    <div className="p-3 md:p-0">
      <h2 className="text-lg md:text-2xl font-bold mb-4">Sales Overview</h2>

      <div className="mb-4 w-full flex ">
        <input
          type="text"
          placeholder="Search by product ID or category"
          className="text-sm md:text-lg p-2 border border-gray-300 flex-1 rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="text-sm md:text-lg p-2 border border-gray-300 rounded"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      <div className="mb-4">
        <h3 className="text-md md:text-xl font-semibold">Total Sales Amount: <FaDollarSign className="inline text-green-500" /> {totalAmount.toFixed(2)}</h3>
      </div>

      <ul className="grid gap-4 ">
        {filteredSales.length === 0 ? (
          <p>No sales found.</p>
        ) : (
          filteredSales.map(sale => (
            <li key={sale.id} className="p-2 md:p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div className='sm:flex justify-between w-full'>
                  <div className=''>
                    <div className='flex items-center gap-1'>
                      <h3 className="text-lg font-bold">{sale.productBrand}</h3>
                      <h3 className="text-md font-semibold">{sale.productModel}</h3>
                    </div>
                    <p className="text-gray-600">{sale.category}</p>
                  </div>
                  <div className="">
                    <div>
                      <span>Quantity : {sale.quantity}</span>
                    </div>
                    
                    <div>
                      <span>Price : <FaDollarSign className="text-green-500 inline" />{sale.productPrice}</span>
                    </div>
                    <div>
                      <span>Total Price : <FaDollarSign className="text-green-500 inline" />{sale.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-gray-600">Date: {new Date(sale.timestamp).toLocaleDateString()}</p>
              <p className="text-gray-600">Sold by: {sale.workerName || 'Unknown'}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Sales;
