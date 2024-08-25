import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaTv, FaBatteryFull } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const ProductListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('laptops');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, selectedCategory));
        if (searchTerm) {
          q = query(q, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
        }        
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchTerm(''); // Clear search when changing categories
  };

  const handleSearchClick = () => {
    // Trigger fetch based on searchTerm and selectedCategory
    setLoading(true);
    fetchProducts();
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const getCategoryIcon = () => {
    switch (selectedCategory) {
      case 'laptops':
        return <FaLaptop className="w-full h-48 object-cover text-gray-300" />;
      case 'phones':
        return <FaMobileAlt className="w-full h-48 object-cover text-gray-300" />;
      case 'gadgets':
        return <FaTabletAlt className="w-full h-48 object-cover text-gray-300" />;
      case 'screens':
        return <FaTv className="w-full h-48 object-cover text-gray-300" />;
      case 'batteries':
        return <FaBatteryFull className="w-full h-48 object-cover text-gray-300" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Product Listing</h1>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            className="p-3 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            onClick={handleSearchClick}
            className="absolute right-0 top-0 mt-2 mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
        <select
          className="p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="laptops">Laptops</option>
          <option value="phones">Phones</option>
          <option value="gadgets">Gadgets</option>
          <option value="screens">Screens</option>
          <option value="batteries">Batteries</option>
          <option value="phoneParts">Phone Parts</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <ThreeDots className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            products.map(product => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer p-4"
                onClick={() => handleProductClick(product.id)}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  getCategoryIcon()
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.brand}</h2>
                  <p className="text-gray-700 mb-2">{product.model}</p>
                  <p className="text-lg font-bold">${product.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
