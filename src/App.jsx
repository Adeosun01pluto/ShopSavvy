// import { useState } from 'react'
// import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
// import Navbar from './components/Navbar'
// import Home_ from './pages/Home/Home_'
// import ProductListing from './pages/Products/ProductListing'
// import ProductDetail from './pages/Products/ProductDetail'
// import WorkerDashboard from './pages/Dashboard/WorkerDashboard'
// import Login from './pages/Auth/Login'
// import Signup from './pages/Auth/Signup'
// import OwnerDashboard from './pages/Dashboard/OwnerDashboard'
// import ProtectedRoute from './ProtectedRoute';
// import AdminBranchSelection from './pages/Branches/AdminBranchSelection'
// import { AuthProvider } from './context/AuthContext'


// function App() {
//   // 435EEF

//   return (
//     <AuthProvider>
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home_ />} />
//         <Route index path="/products/:branchId" element={<ProductListing />} />
//         {/* <Route index path="/products" element={<ProductListing />} /> */}
//         <Route path="/product/:branchId/:category/:id" element={<ProductDetail />} />
//         {/* Branch selection for admins before seeing products */}
//         <Route
//           path="/branch-selection"
//           element={
//             <ProtectedRoute requiredRole="admin">
//               <AdminBranchSelection />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/owner-dashboard/*"
//           element={
//             <ProtectedRoute requiredRole="admin">
//               <OwnerDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/worker-dashboard/*"
//           element={
//             <ProtectedRoute requiredRole="worker">
//               <WorkerDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </Router>
//     </AuthProvider>
//   )
// }

// export default App


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home_ from './pages/Home/Home_';
import ProductListing from './pages/Products/ProductListing';
import ProductDetail from './pages/Products/ProductDetail';
import WorkerDashboard from './pages/Dashboard/WorkerDashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import OwnerDashboard from './pages/Dashboard/OwnerDashboard';
import ProtectedRoute from './ProtectedRoute';
import AdminBranchSelection from './pages/Branches/AdminBranchSelection';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home_ />} />
          <Route path="/products/:branchId" element={<ProductListing />} />
          <Route path="/product/:branchId/:category/:id" element={<ProductDetail />} />
          <Route
            path="/branch-selection"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminBranchSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner-dashboard/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker-dashboard/*"
            element={
              <ProtectedRoute requiredRole="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
