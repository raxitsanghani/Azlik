import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    toast.error('Access Denied. Admin privileges required.', { toastId: 'admin-denied' });
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      toast.error('Access Denied. Only admins can view this page.', { toastId: 'admin-role-denied' });
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
