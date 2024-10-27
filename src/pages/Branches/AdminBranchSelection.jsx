import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ThreeDots } from 'react-loader-spinner';

const AdminBranchSelection = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Fetch the branches from Firestore
        const branchCollectionRef = collection(db, 'branches');
        const branchSnapshot = await getDocs(branchCollectionRef);

        // Map through the documents and extract id and name
        const branchList = branchSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBranches(branchList.reverse());
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchSelect = (branchId) => {
    // Redirect to the product listing page for the selected branch
    navigate(`/products/${branchId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#3B82F6" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Select a Branch</h1>
        <ul className="space-y-4">
          {branches.map((branch) => (
            <li
              key={branch.id}
              onClick={() => handleBranchSelect(branch.id)}
              className="cursor-pointer p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              {branch.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminBranchSelection;
