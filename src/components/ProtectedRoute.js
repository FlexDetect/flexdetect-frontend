import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/auth';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token.replace('Bearer ', ''));
    const now = Date.now() / 1000; // in seconds

    if (decoded.exp < now) {
      // Token expired
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Token invalid or cannot be decoded
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
