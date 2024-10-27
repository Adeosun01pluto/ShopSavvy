import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { FaBan, FaCheck, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [expandedWorker, setExpandedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedRole, setSelectedRole] = useState('worker');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkers(usersList);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBranches = async () => {
      try {
        const branchesCollection = collection(db, 'branches');
        const branchesSnapshot = await getDocs(branchesCollection);
        const branchesList = branchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBranches(branchesList);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchUsers();
    fetchBranches();
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

  const handleRoleChange = async (workerId) => {
    const confirmation = window.confirm(`Are you sure you want to make this user a ${selectedRole}${selectedRole === 'worker' ? ` in branch ${selectedBranch}` : ''}?`);
    if (!confirmation) return;

    const workerRef = doc(db, 'users', workerId);
    const branchName = branches.find(branch => branch.id === selectedBranch)?.name || null;

    // Update the Firestore document
    await updateDoc(workerRef, {
      role: selectedRole,
      branchId: selectedRole === 'worker' ? selectedBranch : null,
      branchName: branchName, // Store branch name
      isWorker: selectedRole === 'worker',
    });

    // Update the workers state immediately for real-time UI feedback
    setWorkers(workers.map(worker => 
      worker.id === workerId 
        ? { ...worker, role: selectedRole, branchId: selectedRole === 'worker' ? selectedBranch : null, branchName: branchName, isWorker: selectedRole === 'worker' } 
        : worker
    ));

    alert(`User role updated to ${selectedRole}${selectedRole === 'worker' ? ` in branch ${branchName}` : ''}`);
  };

  if (loading) return (
    <div className='flex items-center justify-center w-full'>
      <ThreeDots color='#435EEF'  height={50} width={50} className="text-center" />
    </div>
  );

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
                <p><strong>Role:</strong> {worker.role || 'User'}</p>
                <p><strong>Branch:</strong> {worker.isWorker ? worker.branchName : 'N/A'}</p>
                <p><strong>Account Created:</strong> {worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Status:</strong> {worker.isBlocked ? 'Blocked' : 'Active'}</p>

                {/* Role and Branch Selection */}
                <div className="mt-3">
                  <select 
                    value={selectedRole} 
                    onChange={(e) => setSelectedRole(e.target.value)} 
                    className="mr-2 p-1 border rounded"
                  >
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>

                  {selectedRole === 'worker' && (
                    <select 
                      value={selectedBranch} 
                      onChange={(e) => setSelectedBranch(e.target.value)} 
                      className="mr-2 p-1 border rounded"
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  )}

                  <button 
                    className="p-2 bg-blue-500 text-white rounded" 
                    onClick={() => handleRoleChange(worker.id)}
                  >
                    Update Role
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workers;
