import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaMicrochip, FaMobile, FaLaptop, FaHeadphones, FaMapMarkerAlt, FaInfoCircle, FaPhone, FaCodeBranch } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

const Home_ = () => {
  const categories = [
    { name: 'Smartphones', icon: <FaMobile />, link: "phones" },
    { name: 'Laptops', icon: <FaLaptop />, link: "laptops" },
    { name: 'Audio', icon: <FaHeadphones />, link: "gadgets" },
    { name: 'Components', icon: <FaMicrochip />, link: "phoneParts" },
  ];
  const { user } = useAuth(); // Access user from context

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Fetch the branches from Firestore
        const branchCollectionRef = collection(db, 'branches'); // 'branches' is the collection name in Firestore
        const branchSnapshot = await getDocs(branchCollectionRef);

        // Map through the documents and extract id and name
        const branchList = branchSnapshot.docs.map((doc) => ({
          id: doc.id, // Document ID (Firestore auto-generated ID)
          ...doc.data(), // All the other data in the document (e.g., name)
        }));

        setBranches(branchList.reverse()); // Set the fetched branches into state
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false); // Ensure loading is turned off once data is fetched
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="container mx-auto p-3 sm:px-4 sm:py-8">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 sm:p-8 mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4">Welcome to Royal Band</h1>
        <p className="text-lg sm:text-xl mb-6">Your one-stop shop for electronic gadgets and components</p>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* <Link to="/products" className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
            Shop Now
          </Link> */}
          <Link to={`/products/${user?.branchId}`} className="bg-blue-500 text-white py-1 px-4 text-sm sm:text-md sm:px-6 sm:py-2 rounded-full font-semibold hover:bg-blue-400 transition duration-300 flex items-center justify-center">
            <FaSearch className="mr-2" /> Search Products
          </Link>
        </div>
      </div>

      {/* Categories
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} to="/products" className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition duration-300 flex flex-col items-center">
              <div className="text-4xl mb-2 text-blue-600">{category.icon}</div>
              <span className="text-sm sm:text-md font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div> */}


      {/* Branches */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Branches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {branches.map((branch, index) => (
            <Link key={index} to={`/products/${branch.id}`} className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition duration-300 flex flex-col items-center">
              <div className="text-4xl mb-2 text-blue-600"><FaCodeBranch/> </div>
              <span className="text-sm sm:text-md font-medium">{branch.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Us, About Us, Location */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Us */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2"><FaPhone className="inline-block mr-2" /> Contact Us</h3>
            <p className="text-gray-600">Feel free to reach out to us at:</p>
            <p className="text-blue-600">support@electrostore.com</p>
            <p className="text-gray-600">+1 234 567 890</p>
          </div>

          {/* About Us */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2"><FaInfoCircle className="inline-block mr-2" /> About Us</h3>
            <p className="text-gray-600">We are dedicated to providing the best electronic products at great prices. Our mission is to deliver high-quality gadgets and components with exceptional customer service.</p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2"><FaMapMarkerAlt className="inline-block mr-2" /> Location</h3>
            <p className="text-gray-600">Visit us at:</p>
            <p className="text-blue-600">123 Electro St, Tech City, TX 12345</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to upgrade your tech?</h2>
        <p className="text-gray-600 mb-6">Explore our wide range of electronic gadgets and components.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-500 transition duration-300 inline-flex items-center">
          <FaShoppingCart className="mr-2" /> Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default Home_;
