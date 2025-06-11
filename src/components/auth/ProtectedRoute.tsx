import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // Show nothing or loader while checking auth
  if (loading) {
    return null;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
