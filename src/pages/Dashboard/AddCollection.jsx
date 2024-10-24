import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';

const AddCollection = () => {
  const [collectionName, setCollectionName] = useState('');
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [loading, setLoading] = useState(false); // State for loading
  const [branches, setBranches] = useState([]); // State to store branches
  const [selectedBranch, setSelectedBranch] = useState(''); // State for selected branch

  // Function to fetch branches from Firebase
  const fetchBranches = async () => {
    const branchesCollection = collection(db, 'branches'); // Assuming 'branches' collection stores the shops
    const branchSnapshot = await getDocs(branchesCollection);
    const branchList = branchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBranches(branchList);
  };

  useEffect(() => {
    fetchBranches(); // Fetch branches when the component loads
  }, []);

  const handleAddField = () => {
    // Check if the field already exists in the fields array
    const existingField = fields.find(field => field.name.toLowerCase() === newField.toLowerCase());
  
    if (existingField) {
      // If the field exists, check if the type is different
      if (existingField.type !== fieldType) {
        // Update the field type if different
        const updatedFields = fields.map(field =>
          field.name.toLowerCase() === newField.toLowerCase()
            ? { ...field, type: fieldType } // Update the type
            : field
        );
        setFields(updatedFields);
        alert('Field type updated successfully!');
      } else {
        alert('Field with the same name and type already exists.');
      }
    } else {
      // If the field doesn't exist, add a new one
      setFields([...fields, { name: newField, type: fieldType }]);
    }
    setNewField(''); // Clear the new field input
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBranch) {
      alert('Please select a branch');
      return;
    }
  
    setLoading(true); // Set loading to true when the request is made
  
    try {
      // Reference to the branch document
      const branchDocRef = doc(db, 'branches', selectedBranch);
  
      // Fetch the current branch document to get its existing categories
      const branchDoc = await getDoc(branchDocRef);
  
      if (branchDoc.exists()) {
        // Get the current categories array or initialize an empty array
        const currentCategories = branchDoc.data().categories || [];
  
        // Check if the category already exists
        const existingCategory = currentCategories.find(cat => cat.name.toLowerCase() === collectionName.toLowerCase());
  
        if (existingCategory) {
          // Notify the admin that the category exists and update the category
          if (window.confirm(`The category "${collectionName}" already exists. Do you want to update it?`)) {
            // Check if the fields already exist, update their types if necessary
            fields.forEach((newField) => {
              const existingField = existingCategory.fields.find(field => field.name.toLowerCase() === newField.name.toLowerCase());
  
              if (existingField) {
                if (existingField.type !== newField.type) {
                  // Update the field type if different
                  existingField.type = newField.type;
                }
              } else {
                // If the field doesn't exist, add it
                existingCategory.fields.push(newField);
              }
            });
  
            // Update the branch document with the modified categories array
            await updateDoc(branchDocRef, {
              categories: currentCategories,
            });
  
            alert('Category updated successfully!');
          }
        } else {
          // Add the new category as an object with a name and fields array
          const newCategory = {
            name: collectionName,
            fields: fields, // Fields array contains objects with field name and type
          };
  
          // Update the branch document with the new categories array
          const updatedCategories = [...currentCategories, newCategory];
  
          await updateDoc(branchDocRef, {
            categories: updatedCategories,
          });
  
          alert('New category added successfully!');
        }
  
        // Clear the form fields after adding
        setCollectionName('');
        setFields([]);
        setSelectedBranch('');
      } else {
        alert('Branch does not exist.');
      }
    } catch (error) {
      console.error('Error adding/updating category: ', error);
      alert('Failed to add/update category.');
    } finally {
      setLoading(false); // Reset loading to false when request completes
    }
  };

  return (
    <div className="p-2 md:p-5 bg-gray-50 min-h-screen">
      <h2 className="text-xl md:text-3xl font-bold mb-6 text-center text-blue-700">Add or Update Category in a Branch</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 bg-white p-3 md:p-6 rounded-lg shadow-lg">
        
        {/* Branch Selection */}
        <select
          className="outline-none border-gray-100 border-2 p-2 rounded-md"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          required
        >
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} {/* Assuming each branch has a 'name' field */}
            </option>
          ))}
        </select>

        <input
          className="outline-none border-gray-100 border-2 p-2 rounded-md"
          type="text"
          placeholder="Category Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          required
        />

        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            className="outline-none border-gray-100 border-2 p-2 rounded-md"
            type="text"
            placeholder="New Field Name"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
          />
          <select
            className="outline-none border-gray-100 border-2 p-2 rounded-md"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            onClick={handleAddField}
          >
            Add Field
          </button>
        </div>

        {/* Display added fields */}
        {fields.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">Fields:</h3>
            <ul className="list-disc pl-5">
              {fields.map((field, index) => (
                <li key={index} className="text-gray-700">
                  {field.name} ({field.type})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show loading state on the button */}
        <button
          type="submit"
          className={`py-2 px-4 rounded transition duration-200 text-white ${
            loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : 'Create/Update Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCollection;
