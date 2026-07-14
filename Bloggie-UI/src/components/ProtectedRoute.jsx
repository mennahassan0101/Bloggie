import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}