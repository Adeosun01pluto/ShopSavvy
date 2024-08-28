import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { FaBan, FaCheck, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [expandedWorker, setExpandedWorker] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const workersCollection = collection(db, 'users');
        const q = query(workersCollection, where('isWorker', '==', true));
        const workersSnapshot = await getDocs(q);
        const workersList = workersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkers(workersList);
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const toggleBlockWorker = async (worker) => {
    const confirmation = window.confirm(`Are you sure you want to ${worker.isBlocked ? 'unblock' : 'block'} this worker?`);
    if (!confirmation) return;

    const workerRef = doc(db, 'users', worker.id);
    await updateDoc(workerRef, {
      isBlocked: !worker.isBlocked,
    });
    setWorkers(workers.map(w => (w.id === worker.id ? { ...w, isBlocked: !w.isBlocked } : w)));
  };

  const toggleExpandWorker = (workerId) => {
    setExpandedWorker(expandedWorker === workerId ? null : workerId);
  };
  if (loading) return <div className='flex items-center justify-center w-full min-h-[40vh]'>
    <ThreeDots className="text-center"/>
  </div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Workers Management</h2>
      <ul className="grid gap-4">
        {workers.map(worker => (
          <li key={worker.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUser className="text-blue-500 inline mr-2" />
                <span className="font-bold">{worker.name}</span>
              </div>
              <div className="flex items-center">
                <button
                  className="p-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 mr-2"
                  onClick={() => toggleExpandWorker(worker.id)}
                >
                  {expandedWorker === worker.id ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <button
                  className={`p-2 rounded ${worker.isBlocked ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  onClick={() => toggleBlockWorker(worker)}
                >
                  {worker.isBlocked ? <FaBan /> : <FaCheck />}
                </button>
              </div>
            </div>
            {expandedWorker === worker.id && (
              <div className="mt-4 bg-gray-100 p-3 rounded">
                <p><strong>Email:</strong> {worker.email || 'No email available'}</p>
                <p><strong>Phone:</strong> {worker.phoneNumber || 'No phone available'}</p>
                {/* <p><strong>Role:</strong> {worker.role || 'Worker'}</p> */}
                <p><strong>Status:</strong> {worker.isBlocked ? 'Blocked' : 'Active'}</p>
                {/* Add more worker details as needed */}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workers;
