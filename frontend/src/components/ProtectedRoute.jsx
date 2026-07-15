import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <p style={{ color: '#1a3a6b' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;