import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { FaDollarSign } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { useAuth } from '../../context/AuthContext';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx';
import { saveAs } from 'file-saver';


const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [userRole, setUserRole] = useState(null); // Admin or Worker
  const [workerBranch, setWorkerBranch] = useState('');
  const { user } = useAuth(); // Access user from context

  useEffect(() => {
    const fetchUserDetails = async () => {
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

        setUserRole(isAdmin ? 'admin' : 'worker');
        setWorkerBranch(userData.branchId); // Set the worker's branch

        if (isAdmin) {
          // Fetch all branches for the admin to select
          const branchesSnapshot = await getDocs(collection(db, 'branches'));
          const branchList = branchesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
          setBranches(branchList.reverse());
          setSelectedBranch(branchList[0]?.id || ''); // Default to first branch
        } else {
          setSelectedBranch(userData.branchId); // Default to worker's branch
        }
      } catch (error) {
        setError('Error fetching user data');
        console.error('Error fetching user data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      if (!selectedBranch) return;
      setLoading(true);
      setError(null);
      try {
        let salesQuery;
        if (userRole === 'admin') {
          salesQuery = query(collection(db, "branches", selectedBranch, 'sales'), where('branchId', '==', selectedBranch)); // Admin can see all branch sales
        } else {
          salesQuery = query(collection(db, "branches", selectedBranch, 'sales'), where('workerId', '==', auth.currentUser.uid)); // Worker sees only their sales
        }

        const salesSnapshot = await getDocs(salesQuery);
        const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const updatedSales = await Promise.all(salesList.map(async (sale) => {
          const productRef = doc(db, "branches", selectedBranch, sale.category, sale.productId);
          const productSnap = await getDoc(productRef);
          const productData = productSnap.exists() ? productSnap.data() : {};

          console.log(salesList, productData)
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
            soldBy: workerData.email || 'Unknown Email',
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
  }, [selectedBranch, userRole]);

  useEffect(() => {
    const applyFilters = () => {
      let now = new Date();
      let filtered = [...sales];
      let total = 0;

      // Filter by date
      if (filter === 'today') {
        filtered = filtered.filter(sale => new Date(sale.timestamp).toDateString() === now.toDateString());
      } else if (filter === 'yesterday') {
        let yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        filtered = filtered.filter(sale => new Date(sale.timestamp).toDateString() === yesterday.toDateString());
      } else if (filter === 'lastWeek') {
        let lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filtered = filtered.filter(sale => new Date(sale.timestamp) >= lastWeek && new Date(sale.timestamp) <= now);
      } else if (filter === 'lastMonth') {
        let lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = filtered.filter(sale => new Date(sale.timestamp) >= lastMonth && new Date(sale.timestamp) <= now);
      }
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase(); // Convert the search term to lowercase
        filtered = filtered.filter(sale => {
          // Check if any of the specified fields include the lowercase search term
          return (
            sale.productId.toLowerCase().includes(lowerCaseSearchTerm) || 
            sale.category.toLowerCase().includes(lowerCaseSearchTerm) ||
            sale.productBrand.toLowerCase().includes(lowerCaseSearchTerm) ||
            sale.productModel.toLowerCase().includes(lowerCaseSearchTerm) ||
            sale.workerName.toLowerCase().includes(lowerCaseSearchTerm) ||
            sale.soldBy.toLowerCase().includes(lowerCaseSearchTerm)
          );
        });
        console.log(filtered, searchTerm);
      }

      total = filtered.reduce((sum, sale) => sum + (typeof sale.amount === 'number' ? sale.amount : 0), 0);

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

  const generateReport = () => {
    // Map the sales data to include necessary fields
    const filteredSalesData = filteredSales.map(sale => ({
      productModel: sale.productModel,
      category: sale.category,
      quantity: sale.quantity,
      amount: sale.amount,
      soldBy: sale.soldBy,
      timestamp: new Date(sale.timestamp).toLocaleString(),
    }));
  
    // Calculate total amount and quantity
    const totalQuantity = filteredSalesData.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalAmount = filteredSalesData.reduce((sum, sale) => sum + sale.amount, 0);
  
    // Create a table row for each sale
    const salesTableRows = filteredSalesData.map((sale, index) => (
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: (index + 1).toString() })] }), // Index
          new TableCell({ children: [new Paragraph({ text: sale.productModel })] }),     // Product Model
          new TableCell({ children: [new Paragraph({ text: sale.category })] }),         // Category
          new TableCell({ children: [new Paragraph({ text: sale.quantity.toString() })] }), // Quantity
          new TableCell({ children: [new Paragraph({ text: `${sale.amount.toLocaleString()}` })] }), // Amount
          new TableCell({ children: [new Paragraph({ text: sale.soldBy })] }),           // Sold By
          new TableCell({ children: [new Paragraph({ text: sale.timestamp })] }),        // Date
        ],
      })
    ));
  
    // Add a totals row at the bottom
    const totalsRow = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: 'Totals', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: '' })] }), // Empty cell
        new TableCell({ children: [new Paragraph({ text: '' })] }), // Empty cell
        new TableCell({ children: [new Paragraph({ text: totalQuantity.toString(), bold: true })] }), // Total Quantity
        new TableCell({ children: [new Paragraph({ text: `${totalAmount.toLocaleString()}`, bold: true })] }), // Total Amount
        new TableCell({ children: [new Paragraph({ text: '' })] }), // Empty cell
        new TableCell({ children: [new Paragraph({ text: '' })] }), // Empty cell
      ],
    });
  
    // Create the document structure with a table and totals
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Sales Report for ${filter} Sales for Branch ${selectedBranch}`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 300 }, // Space after the title
            }),
            new Table({
              rows: [
                // Table Header
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Index', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Product Model', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Category', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Quantity', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Amount in ₦', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Sold By', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Date', bold: true })] }),
                  ],
                }),
                ...salesTableRows, // Sales data rows
                totalsRow,         // Totals row at the bottom
              ],
            }),
          ],
        },
      ],
    });
  
    // Create the document and trigger the download
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `SalesReport_${filter}_${selectedBranch}.docx`);
    });
  };

  if (loading) return (
    <div className='flex items-center justify-center w-full'>
      <ThreeDots color='#435EEF'  height={50} width={50} className="text-center" />
    </div>
  );
  if (error) return <p>{error}</p>;

  return (
    <div className="p-3 md:p-0">
      <h2 className="text-lg md:text-2xl font-bold mb-4">Sales Overview</h2>

      {/* Branch selection for admin */}
      {userRole === 'admin' && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Select Branch:</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-sm md:text-lg p-2 border border-gray-300 rounded w-full"
          >
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4 w-full flex flex-col gap-1 sm:flex-row">
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
        <h3 className="text-md md:text-xl font-semibold">Total Sales Amount: &#8358; {totalAmount.toLocaleString()}</h3>
      </div>

      <button
        onClick={generateReport}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Generate Report
      </button>

      <ul className="grid gap-4">
        {filteredSales.length === 0 ? (
          <p>No sales found.</p>
        ) : (
          filteredSales.map(sale => (
            <li key={sale.id} className="p-2 md:p-4 rounded shadow">
              <h4 className="text-md font-semibold">{sale.productModel} - {sale.category}</h4>
              <p className="text-sm">Quantity: {sale.quantity}</p>
              <p className="text-sm">Price: &#8358;{sale.productPrice.toLocaleString()}</p>
              <p className="text-sm">Sold by: {sale.soldBy}</p>
              <p className="text-sm">Date: {new Date(sale.timestamp).toLocaleDateString()}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Sales;
