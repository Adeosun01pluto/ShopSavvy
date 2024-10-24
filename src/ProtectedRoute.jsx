// import { Navigate } from 'react-router-dom';
// import { auth, db } from './firebase/config'; // Adjust the import based on your setup
// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { ThreeDots } from 'react-loader-spinner';


// const ProtectedRoute = ({ children, requiredRole }) => {
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const userDoc = await getDoc(doc(db, 'users', user.uid)); // Adjust path as needed
//         if (userDoc.exists()) {
//           setRole(userDoc.data().isWorker ? 'worker' : userDoc.data().isAdmin ? 'admin' : 'none');
//         }
//       }
//       setLoading(false);
//     };
//     fetchUserRole();
//   }, []);

//   if (loading) return <div className='flex items-center justify-center w-full min-h-[40vh]'>
//     <ThreeDots className="text-center"/>
//   </div>;

//   if (role !== requiredRole) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import { Navigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[40vh]">
        <ThreeDots className="text-center" />
      </div>
    );
  }

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;