// components/ProtectedRoute.jsx
import { useAdmin } from '../context/AdminContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const { token } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Delay slightly to avoid showing warning during redirect to login
        if (!token && location.pathname !== '/login') {
            const timer = setTimeout(() => {
                toast.warning('Not authorized. Please login first.');
                navigate('/login', { replace: true });
            }, 300); // short delay

            return () => clearTimeout(timer); // clean up
        }
    }, [token, navigate, location.pathname]);

    if (!token) {
        return null; // Avoid rendering until redirected
    }

    return children;
};

export default ProtectedRoute;
