import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Or use a proper auth context

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
