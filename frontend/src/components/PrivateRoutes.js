import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoutes = () => {
  const { user, isLoading } = useAuth(); // Get user and isLoading from auth context

  if (isLoading) {
    return <div>Loading user data...</div>; // Or a loading spinner/component
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes; 