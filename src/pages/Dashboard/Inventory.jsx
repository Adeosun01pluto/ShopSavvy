import React, { useState, useEffect } from 'react';
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaTv, FaBatteryFull } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { addDoc, collection } from 'firebase/firestore';

const Inventory = () => {
  const [selectedCollection, setSelectedCollection] = useState('laptops');
  const [formData, setFormData] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    setFormData({}); // Reset form data when collection changes
  }, [selectedCollection]);

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
  const handleConfirmAddStock = async () => {
    try {
      await addDoc(collection(db, selectedCollection), formData);
      alert('New stock added successfully!');
      setFormData({});
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add stock.');
    } finally {
      setConfirmDialogOpen(false); // Close the confirmation dialog
    }
  };

  const renderFormFields = () => {
    switch (selectedCollection) {
      case 'laptops':
        return (
          <>
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="brand" placeholder="Brand" value={formData.brand || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="model" placeholder="Model" value={formData.model || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="processor" placeholder="Processor" value={formData.processor || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="ram" placeholder="RAM" value={formData.ram || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="storage" placeholder="Storage" value={formData.storage || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="screenSize" placeholder="Screen Size" value={formData.screenSize || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="warranty" placeholder="Warranty" value={formData.warranty || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleInputChange} required />
          </>
        );
      case 'phones':
        return (
          <>
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="brand" placeholder="Brand" value={formData.brand || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="model" placeholder="Model" value={formData.model || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="storage" placeholder="Storage" value={formData.storage || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="color" placeholder="Color" value={formData.color || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="warranty" placeholder="Warranty" value={formData.warranty || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleInputChange} required />
          </>
        );
      case 'gadgets':
        return (
          <>
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="brand" placeholder="Brand" value={formData.brand || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="model" placeholder="Model" value={formData.model || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="features" placeholder="Features (comma-separated)" value={formData.features || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="warranty" placeholder="Warranty" value={formData.warranty || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleInputChange} required />
          </>
        );
      case 'screens':
        return (
          <>
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="brand" placeholder="Brand" value={formData.brand || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="model" placeholder="Model" value={formData.model || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="size" placeholder="Size" value={formData.size || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="resolution" placeholder="Resolution" value={formData.resolution || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="warranty" placeholder="Warranty" value={formData.warranty || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleInputChange} required />
          </>
        );
      case 'batteries':
        return (
          <>
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="type" placeholder="Type" value={formData.type || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="model" placeholder="Model" value={formData.model || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="capacity" placeholder="Capacity" value={formData.capacity || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="compatibleWith" placeholder="Compatible With (comma-separated)" value={formData.compatibleWith || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleInputChange} required />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="text" name="warranty" placeholder="Warranty" value={formData.warranty || ''} onChange={handleInputChange} />
            <input className='outline-none border-blue-700 border-b-[1.5px] p-1' type="number" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleInputChange} required />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Inventory Management</h2>
      <select
        className="w-full p-3 mb-6 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedCollection}
        onChange={(e) => setSelectedCollection(e.target.value)}
      >
        <option value="laptops">Laptops</option>
        <option value="phones">Phones</option>
        <option value="gadgets">Gadgets</option>
        <option value="screens">Screens</option>
        <option value="batteries">Batteries</option>
      </select>
      <form onSubmit={handleSubmit} className="grid gap-4 bg-white p-6 rounded-lg shadow-lg">
        {renderFormFields()}
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">Add Stock</button>
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
