import React from 'react'; // 👈 This is required for JSX types
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

interface Props {
  children: React.ReactElement; // ✅ use React.ReactElement instead of JSX.Element
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
