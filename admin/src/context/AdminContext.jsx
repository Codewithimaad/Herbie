import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    const [orderById, setOrderById] = useState(null);
    const [loadingOrderById, setLoadingOrderById] = useState(false);
    const [orderByIdError, setOrderByIdError] = useState(null);
    const [categories, setCategories] = useState([]);

    const currency = 'Rs';

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

    // Function to fetch order by ID
    const fetchOrderById = async (id) => {
        try {
            setLoadingOrderById(true);
            setOrderByIdError(null);
            const response = await axios.get(`${backendUrl}/api/admin/${id}`);
            console.log('order by Id:', response.data); // Inspect the response
            if (!response.data.items) {
                console.warn('Items missing in response:', response.data);
                response.data.items = []; // Fallback to empty array
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
            console.log(`Deleting order with ID: ${id}`);
            await axios.delete(`${backendUrl}/api/admin/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            console.log('Order deleted:', id);
            // Update orders state by removing the deleted order
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
            return { success: true };
        } catch (error) {
            console.error('Delete order error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.message || 'Failed to delete order' };
        }
    };


    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/category`);
                console.log('categories', data.data);

                setCategories(data);
            } catch (error) {
                toast.error('Failed to load categories');
            }
        };

        fetchCategories();
    }, []);


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
                categories
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);

export default AdminContext;