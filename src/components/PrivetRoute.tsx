import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust import path as needed

interface PrivateRouteProps {
    element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { isAuthenticated } = useAuth(); // Use the custom hook to get auth state
    console.log(isAuthenticated)
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render the passed component if authenticated
    return element;
};

export default PrivateRoute;
