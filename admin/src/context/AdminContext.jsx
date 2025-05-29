import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    const [orderById, setOrderById] = useState(null);
    const [loadingOrderById, setLoadingOrderById] = useState(false);
    const [orderByIdError, setOrderByIdError] = useState(null);

    const [categories, setCategories] = useState([]);

    const [admins, setAdmins] = useState([]);
    const [loadingAdmins, setLoadingAdmins] = useState(true);
    const [adminsError, setAdminsError] = useState(null);

    const [faqs, setFaqs] = useState([]);
    const [loadingFaqs, setLoadingFaqs] = useState(true);
    const [faqsError, setFaqsError] = useState(null);

    const currency = 'Rs';

    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [loadingAuth, setLoadingAuth] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoadingOrders(true);
                setOrdersError(null);
                const response = await axios.get(`${backendUrl}/api/admin`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/category`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(data);
            } catch (error) {
                toast.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, [backendUrl]);

    const fetchAllAdmins = useCallback(async () => {
        if (!token) {
            setAdmins([]);
            setLoadingAdmins(false);
            return;
        }

        try {
            setLoadingAdmins(true);
            setAdminsError(null);
            const response = await axios.get(`${backendUrl}/api/admins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const adminsData = response.data.admins || response.data;
            if (!Array.isArray(adminsData)) {
                throw new Error('Invalid response format: admins is not an array');
            }
            setAdmins(adminsData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to load admins';
            setAdminsError(errorMessage);
            console.error('Fetch admins error:', error);
            toast.error(errorMessage);
        } finally {
            setLoadingAdmins(false);
        }
    }, [backendUrl, token]);

    useEffect(() => {
        fetchAllAdmins();
    }, [fetchAllAdmins]);

    const fetchAllFAQs = useCallback(async () => {
        try {
            setLoadingFaqs(true);
            setFaqsError(null);

            const response = await axios.get(`${backendUrl}/api/faqs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            const faqsData = response.data.faqs || response.data;
            if (!Array.isArray(faqsData)) {
                throw new Error('Invalid response format: FAQs is not an array');
            }
            setFaqs(faqsData);
        } catch (error) {
            console.error('Full FAQ fetch error:', error); // More detailed error
            console.error('Error response:', error.response); // Response if exists

            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to load FAQs';
            setFaqsError(errorMessage);
            toast.error(errorMessage);

            // If unauthorized, clear token
            if (error.response?.status === 401) {
                logoutAdmin();
            }
        } finally {
            setLoadingFaqs(false);
        }
    }, [backendUrl, token]);



    const addFAQ = async (faqData) => {
        if (!token) {
            toast.error('Please log in to add FAQs');
            return { success: false, error: 'Authentication required' };
        }

        try {
            setLoadingAuth(true);
            const { data } = await axios.post(`${backendUrl}/api/faqs`, faqData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFaqs((prevFaqs) => [...prevFaqs, data.faq]);
            toast.success('FAQ added successfully');
            return { success: true, faq: data.faq };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add FAQ';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoadingAuth(false);
        }
    };

    const deleteFAQ = async (id) => {
        if (!token) {
            toast.error('Please log in to delete FAQs');
            return { success: false, error: 'Authentication required' };
        }

        try {
            setLoadingAuth(true);
            await axios.delete(`${backendUrl}/api/faqs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== id));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete FAQ';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoadingAuth(false);
        }
    };

    const fetchOrderById = async (id) => {
        try {
            setLoadingOrderById(true);
            setOrderByIdError(null);
            const response = await axios.get(`${backendUrl}/api/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

    const deleteOrder = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
            toast.success('Order deleted');
            return { success: true };
        } catch (error) {
            console.error('Delete order error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.message || 'Failed to delete order' };
        }
    };

    const loginAdmin = async (email, password) => {
        try {
            setLoadingAuth(true);
            const { data } = await axios.post(`${backendUrl}/api/admins/login`, { email, password });
            setToken(data.token);
            localStorage.setItem('adminToken', data.token);
            setAdmin(data.admin);
            return { success: true };
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            return { success: false, error: err.response?.data?.message || 'Login failed' };
        } finally {
            setLoadingAuth(false);
        }
    };

    const logoutAdmin = () => {
        setAdmin(null);
        setToken('');
        setAdmins([]);
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    const addAdmin = async (adminData) => {
        try {
            setLoadingAuth(true);
            const { data } = await axios.post(`${backendUrl}/api/admins`, adminData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdmins((prevAdmins) => [...prevAdmins, data.admin]);
            return { success: true, admin: data.admin };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add admin');
            return { success: false, error: error.response?.data?.message || 'Failed to add admin' };
        } finally {
            setLoadingAuth(false);
        }
    };



    const deleteAdmin = async (id) => {
        try {
            setLoadingAuth(true);
            await axios.delete(`${backendUrl}/api/admins/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
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

    const fetchAdmin = async () => {
        if (!token) {
            setAdmin(null);
            return;
        }

        try {
            const res = await axios.get(`${backendUrl}/api/admins/get-admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdmin(res.data.admin);
        } catch (err) {
            console.error('Failed to fetch admin:', err);
            setAdmin(null);
            localStorage.removeItem('adminToken');
            setToken('');
        }
    };


    return (
        <AdminContext.Provider
            value={{
                backendUrl,
                frontendUrl,
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
                admins,
                loadingAdmins,
                adminsError,
                faqs,
                loadingFaqs,
                faqsError,
                fetchAllFAQs,
                addFAQ,
                deleteFAQ,
                token,
                loadingAuth,
                loginAdmin,
                logoutAdmin,
                addAdmin,
                deleteAdmin,
                fetchAllAdmins,
                fetchAdmin,

            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export const useAdmin = () => useContext(AdminContext);

export default AdminContext;