import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaMicrochip, FaMobile, FaLaptop, FaHeadphones } from 'react-icons/fa';

const Home_ = () => {
  const featuredProducts = [
    { id: 1, name: 'Smartphone X', price: 599.99, image: 'https://placehold.co/200x200' },
    { id: 2, name: 'Laptop Pro', price: 1299.99, image: 'https://placehold.co/200x200' },
    { id: 3, name: 'Wireless Earbuds', price: 149.99, image: 'https://placehold.co/200x200' },
    { id: 4, name: 'Arduino Kit', price: 49.99, image: 'https://placehold.co/200x200' },
  ];

  const categories = [
    { name: 'Smartphones', icon: <FaMobile /> },
    { name: 'Laptops', icon: <FaLaptop /> },
    { name: 'Audio', icon: <FaHeadphones /> },
    { name: 'Components', icon: <FaMicrochip /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to ElectroStore</h1>
        <p className="text-xl mb-6">Your one-stop shop for electronic gadgets and components</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/products" className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
            Shop Now
          </Link>
          <Link to="/search" className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-400 transition duration-300 flex items-center justify-center">
            <FaSearch className="mr-2" /> Search Products
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} to={`/category/${category.name.toLowerCase()}`} className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition duration-300">
              <div className="text-4xl mb-2 text-blue-600">{category.icon}</div>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
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