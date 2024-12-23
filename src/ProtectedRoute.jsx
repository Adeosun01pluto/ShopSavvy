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