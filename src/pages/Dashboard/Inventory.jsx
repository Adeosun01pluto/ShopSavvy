import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const Inventory = () => {
  const [branches, setBranches] = useState([]); // List of branches from Firebase
  const [selectedBranch, setSelectedBranch] = useState(''); // Selected branch
  const [categories, setCategories] = useState([]); // Categories under the selected branch
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category
  const [formData, setFormData] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Fetch branches from Firebase on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      const branchesCollection = collection(db, 'branches');
      const branchSnapshot = await getDocs(branchesCollection);
      const branchList = branchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBranches(branchList);
    };

    fetchBranches();
  }, []);

  // Fetch categories when a branch is selected
  useEffect(() => {
    if (selectedBranch) {
      const selectedBranchObject = branches.find(branch => branch.name === selectedBranch);
      if (selectedBranchObject) {
        setCategories(selectedBranchObject.categories || []); // Categories are an array of objects with fields
      }
    } else {
      setCategories([]);
    }
  }, [selectedBranch, branches]);

  // Reset form data when category changes
  useEffect(() => {
    setFormData({});
  }, [selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmDialogOpen(true); // Show the confirmation dialog
  };

  // const handleConfirmAddStock = async () => {
  //   try {
  //     if (!selectedCategory) {
  //       alert('Please select a category.');
  //       return;
  //     }

  //     await addDoc(collection(db, selectedCategory), formData); // Store the stock in the selected category collection
  //     alert('New stock added successfully!');
  //     setFormData({});
  //   } catch (error) {
  //     console.error('Error adding document: ', error);
  //     alert('Failed to add stock.');
  //   } finally {
  //     setConfirmDialogOpen(false); // Close the confirmation dialog
  //   }
  // };
  const handleConfirmAddStock = async () => {
    try {
      if (!selectedCategory || !selectedBranch) {
        alert('Please select both a branch and a category.');
        return;
      }
  
      // Find the selected branch object from the branches state
      const selectedBranchObject = branches.find(branch => branch.name === selectedBranch);
  
      if (!selectedBranchObject) {
        alert('Selected branch not found.');
        return;
      }
  
      // The name of the collection will be the selected category
      const collectionPath = `branches/${selectedBranchObject.id}/${selectedCategory}`;
  
      // Add the new product to the collection inside the branch
      await addDoc(collection(db, collectionPath), formData);
  
      alert('New stock added successfully to the selected branch and category!');
      setFormData({}); // Reset the form
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add stock.');
    } finally {
      setConfirmDialogOpen(false); // Close the confirmation dialog
    }
  };
  const renderFormFields = () => {
    if (!selectedCategory) return null;

    const selectedCategoryObject = categories.find((category) => category.name === selectedCategory);
    if (!selectedCategoryObject) return null;

    const inputs = selectedCategoryObject.fields; // Use the 'fields' from the selected category

    return inputs.map((field, index) => (
      <input
        key={index}
        className="outline-none border-gray-100 border-2 p-2 rounded-md"
        type={field.type}
        name={field.name.toLowerCase().replace(/\s+/g, '')} // Sanitize field names
        placeholder={field.name}
        value={formData[field.name.toLowerCase().replace(/\s+/g, '')] || ''}
        onChange={handleInputChange}
      />
    ));
  };

  return (
    <div className="p-2 md:p-5 bg-gray-50 min-h-screen">
      <h2 className="text-xl md:text-3xl font-bold mb-6 text-center text-blue-700">Inventory Management</h2>

      {/* Branch selection */}
      <select
        className="w-full p-3 mb-6 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
      >
        <option value="">Select Branch</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.name}>
            {branch.name}
          </option>
        ))}
      </select>

      {/* Category selection */}
      {selectedBranch && (
        <select
          className="w-full p-3 mb-6 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      {/* Inventory form */}
      <form onSubmit={handleSubmit} className="grid gap-4 bg-white p-3 md:p-6 rounded-lg shadow-lg">
        {renderFormFields()}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Add Stock
        </button>
      </form>

      {confirmDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Add Stock</h2>
            <p>Are you sure you want to add this stock?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddStock}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
