import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { FaBan, FaCheck, FaUser } from 'react-icons/fa';

const Workers = () => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      const workersCollection = collection(db, 'users');
      const q = query(workersCollection, where('isWorker', '==', true));
      const workersSnapshot = await getDocs(q);
      const workersList = workersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkers(workersList);
    };
    fetchWorkers();
  }, []);

  const toggleBlockWorker = async (worker) => {
    const workerRef = doc(db, 'users', worker.id);
    await updateDoc(workerRef, {
      isBlocked: !worker.isBlocked,
    });
    setWorkers(workers.map(w => (w.id === worker.id ? { ...w, isBlocked: !w.isBlocked } : w)));
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Workers Management</h2>
      <ul className="grid gap-4">
        {workers.map(worker => (
          <li key={worker.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <FaUser className="text-blue-500 inline mr-2" />
                <span className="font-bold">{worker.name}</span>
              </div>
              <button
                className={`p-2 rounded ${worker.isBlocked ? 'bg-red-500' : 'bg-green-500'} text-white`}
                onClick={() => toggleBlockWorker(worker)}
              >
                {worker.isBlocked ? <FaBan /> : <FaCheck />}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workers;
