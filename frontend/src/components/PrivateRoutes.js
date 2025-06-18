import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoutes = () => {
  const { user } = useAuth(); // Get user from auth context
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes; 