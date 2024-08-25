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

function App() {
  // 435EEF

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route index path='/' element={<Home_/>} />
        <Route path='/products' element={<ProductListing/>} />
        <Route path='/product/:id' element={<ProductDetail/>} />
        <Route path="/owner-dashboard/*" element={<OwnerDashboard />} />
        <Route path="/worker-dashboard/*" element={<WorkerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>


    </Router>
  )
}

export default App
