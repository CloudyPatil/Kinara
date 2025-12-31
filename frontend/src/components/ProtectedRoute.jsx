import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 1. Check if logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if role is allowed (if specific roles are required)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert("Access Denied: You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  // 3. Render the child component (The Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;