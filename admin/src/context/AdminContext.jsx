import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();


    // Orders states (your existing)
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    const [orderById, setOrderById] = useState(null);
    const [loadingOrderById, setLoadingOrderById] = useState(false);
    const [orderByIdError, setOrderByIdError] = useState(null);
    const [categories, setCategories] = useState([]);

    const currency = 'Rs';

    // Auth states
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [loadingAuth, setLoadingAuth] = useState(false);

    // Set axios Authorization header when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Fetch all orders on mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoadingOrders(true);
                setOrdersError(null);
                const response = await axios.get(`${backendUrl}/api/admin`);
                setOrders(response.data.orders || response.data);
            } catch (error) {
                setOrdersError('Failed to load orders.');
                console.error(error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [backendUrl]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/category`);
                setCategories(data);
            } catch (error) {
                toast.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    // Function to fetch order by ID
    const fetchOrderById = async (id) => {
        try {
            setLoadingOrderById(true);
            setOrderByIdError(null);
            const response = await axios.get(`${backendUrl}/api/admin/${id}`);
            if (!response.data.items) {
                response.data.items = [];
            }
            setOrderById(response.data);
        } catch (error) {
            setOrderByIdError('Failed to load order.');
            setOrderById(null);
            console.error(error);
        } finally {
            setLoadingOrderById(false);
        }
    };

    // Delete an order by ID
    const deleteOrder = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
            toast.success('Order deleted');
            return { success: true };
        } catch (error) {
            console.error('Delete order error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.message || 'Failed to delete order' };
        }
    };

    // ===== Admin Login =====
    const loginAdmin = async (email, password) => {
        try {
            setLoadingAuth(true);
            const { data } = await axios.post(`${backendUrl}/api/admins/login`, { email, password });
            setAdmin(data.admin);
            setToken(data.token);
            localStorage.setItem('adminToken', data.token);
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        } finally {
            setLoadingAuth(false);
        }
    };

    // ===== Admin Logout =====
    const logoutAdmin = () => {
        setAdmin(null);
        setToken('');
        localStorage.removeItem('adminToken');
        navigate('/login');
        toast.info('Logged out');
    };

    // ===== Add New Admin =====
    const addAdmin = async (adminData) => {
        try {
            setLoadingAuth(true);
            const { data } = await axios.post(`${backendUrl}/api/admins`, adminData);
            toast.success('Admin added successfully');
            return { success: true, admin: data.admin };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add admin');
            return { success: false, error: error.response?.data?.message || 'Failed to add admin' };
        } finally {
            setLoadingAuth(false);
        }
    };

    // ===== Update Admin =====
    const updateAdmin = async (id, updatedData) => {
        try {
            setLoadingAuth(true);
            const { data } = await axios.put(`${backendUrl}/api/admins/${id}`, updatedData);
            toast.success('Admin updated successfully');
            if (admin && admin._id === id) {
                setAdmin(data.admin);
            }
            return { success: true, admin: data.admin };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update admin');
            return { success: false, error: error.response?.data?.message || 'Failed to update admin' };
        } finally {
            setLoadingAuth(false);
        }
    };

    // ===== Delete Admin =====
    const deleteAdmin = async (id) => {
        try {
            setLoadingAuth(true);
            await axios.delete(`${backendUrl}/api/admins/${id}`);
            toast.success('Admin deleted successfully');
            if (admin && admin._id === id) {
                logoutAdmin();
            }
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete admin');
            return { success: false, error: error.response?.data?.message || 'Failed to delete admin' };
        } finally {
            setLoadingAuth(false);
        }
    };

    return (
        <AdminContext.Provider
            value={{
                backendUrl,
                orders,
                loadingOrders,
                ordersError,
                setOrders,
                orderById,
                loadingOrderById,
                orderByIdError,
                fetchOrderById,
                currency,
                deleteOrder,
                categories,
                admin,
                token,
                loadingAuth,
                loginAdmin,
                logoutAdmin,
                addAdmin,
                updateAdmin,
                deleteAdmin,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);

export default AdminContext;
