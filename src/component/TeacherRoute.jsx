import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const TeacherRoute = ({ user, isLoading }) => {
  

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <h1>Verifying Teacher Access...</h1>
      </div>
    );
  }

  const isTeacher = user && user.role === 'teacher' && user.isApproved === true;


  return isTeacher ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default TeacherRoute;