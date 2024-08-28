import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Navbar from './components/Navbar'
import Home_ from './pages/Home/Home_'
import ProductListing from './pages/Products/ProductListing'
import ProductDetail from './pages/Products/ProductDetail'
import WorkerDashboard from './pages/Dashboard/WorkerDashboard'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import OwnerDashboard from './pages/Dashboard/OwnerDashboard'
import ProtectedRoute from './ProtectedRoute';


function App() {
  // 435EEF

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index path="/" element={<Home_ />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:category/:id" element={<ProductDetail />} />
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
  )
}

export default App
