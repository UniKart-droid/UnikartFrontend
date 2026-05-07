import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const AdminRoute = ({ user, isLoading }) => {
  

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  const isAdmin = user && user.role === 'admin' && user.isApproved === true;


  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;