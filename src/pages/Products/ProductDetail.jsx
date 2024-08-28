import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaTv, FaBatteryFull } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const ProductDetail = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState('');
  const [editWarranty, setEditWarranty] = useState('');
  const [editStock, setEditStock] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Example flag for admin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        const user = auth.currentUser;
        // Fetch the current user's data from the 'users' collection
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          throw new Error('User document not found');
        }

        const userData = userDocSnap.data();
        const adminUID = userData.userId; // Determine if the user is an admin

        const docRef = doc(db, category, id);
        const docSnap = await getDoc(docRef);
        console.log(userData.isAdmin)

        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct(productData);
          setEditPrice(productData.price);
          setEditWarranty(productData.warranty);
          setEditStock(productData.stock);
          // Example check for admin
          setIsAdmin(userData.isAdmin); // Replace with actual admin check
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
  }, [category, id]);

  const handleSell = () => {
    if (!product || quantity < 1 || quantity > product.stock) {
      console.error('Invalid quantity');
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSell = async () => {
    setConfirmDialogOpen(false);
    setSellLoading(true);

    try {
      const saleData = {
        productId: id,
        category,
        workerId: auth.currentUser.uid,
        quantity,
        timestamp: new Date().toISOString(),
      };

      // Add sale to sales collection
      const saleRef = await addDoc(collection(db, 'sales'), saleData);

      // Update product stock
      const newStock = product.stock - quantity;
      await updateDoc(doc(db, category, id), { stock: newStock });

      // Update state to reflect new stock
      setProduct((prevProduct) => ({
        ...prevProduct,
        stock: newStock,
      }));

      // Add sale ID to worker's document
      const workerRef = doc(db, 'workers', auth.currentUser.uid);
      const workerDoc = await getDoc(workerRef);

      if (workerDoc.exists()) {
        const workerData = workerDoc.data();
        await updateDoc(workerRef, {
          sales: [...(workerData.sales || []), saleRef.id],
        });
      }

      console.log('Sale successful');
      setQuantity(1);
    } catch (error) {
      console.error('Error processing sale: ', error);
    } finally {
      setSellLoading(false);
    }
  };

  const handleUpdate = async () => {
    setEditLoading(true);
    try {
      await updateDoc(doc(db, category, id), {
        price: editPrice,
        warranty: editWarranty,
        stock: editStock,
      });
      setProduct((prevProduct) => ({
        ...prevProduct,
        price: editPrice,
        warranty: editWarranty,
        stock: editStock,
      }));
      setIsEditing(false);
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product: ', error);
    } finally {
      setEditLoading(false);
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
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
    <div className="p-2 md:p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-2 text-sm md:text-md md:mb-4 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back
      </button>
      <h1 className="text-xl md:text-3xl font-bold text-center mb-6">Product Details</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <ThreeDots className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : (
        product ? (
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                {getCategoryIcon()}
              </div>
            )}
            <div className="p-3 md:p-6 flex flex-col gap-4">
              <h2 className="text-xl md:text-3xl font-semibold md:mb-2">Brand: {product?.brand}</h2>
              <p className="text-gray-700">Model: {product?.model}</p>
              <p className="text-gray-700">Processor: {product?.processor}</p>
              <p className="text-gray-700">Storage: {product?.storage}</p>
              <p className="text-gray-700">Screen Size: {product?.screenSize}</p>
              {isEditing ? (
                <>
                  <div className="flex items-center gap-4 mb-2">
                    <p>Price : </p>
                    <input
                      type="text"
                      className="p-2 border border-gray-300 rounded-lg"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdate()}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <p>Warranty : </p>
                    <input
                      type="text"
                      className="p-2 border border-gray-300 rounded-lg"
                      value={editWarranty}
                      onChange={(e) => setEditWarranty(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdate()}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <p>Stocks : </p>
                    <input
                      type="number"
                      className="p-2 border border-gray-300 rounded-lg"
                      value={editStock}
                      onChange={(e) => setEditStock(Number(e.target.value))}
                      min="0"
                    />
                    <button
                      onClick={() => handleUpdate()}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700">Price: ${product.price}</p>
                  <p className="text-gray-700">Warranty: {product?.warranty}</p>
                  <p className="text-lg font-bold">Quantities: {product.stock}</p>
                  {!isAdmin && (
                    <div className="flex relative items-center w-full">
                      <input
                        type="number"
                        className="outline-red-400 px-5 py-2 flex-1 rounded-lg text-md border-red-400 border-t-[1px] border-b-[1px] border-l-[1px]"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={handleSell}
                        className="bg-red-400 absolute right-0 text-white w-[30%] flex items-center justify-center px-5 py-2 rounded-tr-lg rounded-br-lg gap-3"
                      >
                        <span>Sell</span>
                        <span>
                          {sellLoading? <ThreeDots  color='#fff' height={30} width={30} className="" /> : null}
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
              {isAdmin && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-3"
                >
                  <span>{isEditing ? 'Cancel' : 'Edit Details'}</span>
                  <span>
                    {editLoading ? <ThreeDots  color='#fff' height={30} width={30} className="" /> : null}
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Product not found.</p>
        )
      )}
      {confirmDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Sale</h2>
            <p>Are you sure you want to sell {quantity} units?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmSell}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {(loading) && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <ThreeDots className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      )} */}
    </div>
  );
};

export default ProductDetail;
