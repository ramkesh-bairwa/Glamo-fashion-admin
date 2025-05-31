import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;