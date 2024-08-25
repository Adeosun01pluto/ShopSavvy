import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthorized, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthorized ? <Component /> : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
