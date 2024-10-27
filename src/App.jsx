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
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThreeDots } from 'react-loader-spinner';
import NotFound from './NotFOund';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots color="#435EEF" height={80} width={80} />
      </div>
    );
  }

  return (
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
       {/* Add the NotFound route at the end */}
       <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
