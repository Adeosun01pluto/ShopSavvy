import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { FaUser, FaDollarSign } from 'react-icons/fa';

const Sales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const salesCollection = collection(db, 'sales');
      const salesSnapshot = await getDocs(salesCollection);
      const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(salesList);
    };
    fetchSales();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
      <ul className="grid gap-4">
        {sales.map(sale => (
          <li key={sale.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{sale.productName}</h3>
                <p className="text-gray-600">Sold by: {sale.workerName}</p>
              </div>
              <div className="text-right">
                <FaDollarSign className="text-green-500 inline" /> {sale.amount}
              </div>
            </div>
            <p className="mt-2 text-gray-600">Date: {new Date(sale.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
