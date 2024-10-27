import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaTv, FaBatteryFull } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const ProductListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Number of items per page
  const navigate = useNavigate();
  const { branchId } = useParams();

  // Fetch branch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const branchRef = doc(db, 'branches', branchId);
        const branchDoc = await getDoc(branchRef);
        const categoriesList = branchDoc.data().categories;
        if (categoriesList.length > 0) {
          setCategories(categoriesList);
          setSelectedCategory(categoriesList[0].name);
        }
      } catch (error) {
        console.error('Error fetching categories: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [branchId]);

  // Fetch products based on selected category and branch
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let items = [];

        if (selectedCategory) {
          const branchRef = doc(db, 'branches', branchId);
          const productsSnapshot = await getDocs(collection(branchRef, selectedCategory));
          items = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        const lowerSearchTerm = searchTerm.trim().toLowerCase();
        const filteredItems = searchTerm
          ? items.filter(item =>
              Object.values(item).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(lowerSearchTerm)
              )
            )
          : items;

        setProducts(filteredItems);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [branchId, selectedCategory, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${branchId}/${selectedCategory}/${id}`);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => {
      if (direction === 'next') {
        return Math.min(prevPage + 1, Math.ceil(products.length / itemsPerPage));
      } else {
        return Math.max(prevPage - 1, 1);
      }
    });
  };

  return (
    <div className="p-3 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-6">Product Listing</h1>
      <div className="md:w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 text-sm md:text-md md:p-3 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <select
          className="p-2 text-sm md:text-md md:p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto md:ml-4"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots color="#3B82F6" height={50} width={50} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto md:w-[80%]">
            {currentItems.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">No products found.</p>
            ) : (
              currentItems.map(product => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{product?.brand}</h2>
                    <p className="text-gray-700 mb-2">{product?.model}</p>
                    <p className="text-lg font-semibold">${product?.price || "No Price"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {products.length > 0 && (
            <div className="flex justify-between items-center mt-6 md:w-[30%] mx-auto">
              <button
                className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {Math.ceil(products.length / itemsPerPage)}
              </span>
              <button
                className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange('next')}
                disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListing;
