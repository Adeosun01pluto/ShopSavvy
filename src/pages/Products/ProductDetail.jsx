import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaTv, FaBatteryFull } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'laptops', id); // Update 'laptops' with dynamic category if needed
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getCategoryIcon = () => {
    switch (product?.category) {
      case 'laptops':
        return <FaLaptop className="w-24 h-24 text-gray-300" />;
      case 'phones':
        return <FaMobileAlt className="w-24 h-24 text-gray-300" />;
      case 'gadgets':
        return <FaTabletAlt className="w-24 h-24 text-gray-300" />;
      case 'screens':
        return <FaTv className="w-24 h-24 text-gray-300" />;
      case 'batteries':
        return <FaBatteryFull className="w-24 h-24 text-gray-300" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back
      </button>
      <h1 className="text-3xl font-bold text-center mb-6">Product Details</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <ThreeDots className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : (
        product ? (
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                {getCategoryIcon()}
              </div>
            )}
            <div className="p-6">
              <h2 className="text-3xl font-semibold mb-2">{product?.brand}</h2>
              <p className="text-gray-700 mb-4">{product?.model}</p>
              <p className="text-gray-700 mb-4">{product?.processor}</p>
              <p className="text-lg font-bold">${product.price}</p>
              <p className="text-lg font-bold">Quantities: {product.stock}</p>
              {/* Add more details here if needed */}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Product not found.</p>
        )
      )}
    </div>
  );
};

export default ProductDetail;
