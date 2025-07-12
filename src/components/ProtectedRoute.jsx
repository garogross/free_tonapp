import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, loadingUser, children }) => {
    if (loadingUser) return <div>Loading...</div>;
    if (allowedRoles && !allowedRoles.includes(user)) {
        return <Navigate to="/" replace />;
    }
    return children;
  };

export default ProtectedRoute;