import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(true);
    const [productError, setProductError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch authenticated user on mount
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${backendUrl}/api/auth/get-user`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('User:', res.data.user);
                setUser(res.data.user);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setUser(null);
                localStorage.removeItem('token');
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token, backendUrl]);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductLoading(true);
                setProductError(null);
                const res = await axios.get(`${backendUrl}/api/products`);
                console.log('Raw product response:', res.data);

                let fetchedProducts = [];

                // Handle two common response formats
                if (Array.isArray(res.data)) {
                    fetchedProducts = res.data;
                } else if (Array.isArray(res.data.products)) {
                    fetchedProducts = res.data.products;
                } else {
                    console.warn('Expected "products" to be an array.');
                    throw new Error('Invalid product data format');
                }

                setProducts(fetchedProducts);
            } catch (err) {
                console.error('Failed to load products:', err);
                setProductError('Unable to load products. Please try again later.');
                setProducts([]);
            } finally {
                setProductLoading(false);
            }
        };

        fetchProducts();
    }, [backendUrl]);

    const login = (userData, jwtToken) => {
        setUser(userData);
        if (jwtToken) {
            setToken(jwtToken);
            localStorage.setItem('token', jwtToken);
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${backendUrl}/api/auth/logout`, { withCredentials: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                loading,
                backendUrl,
                products,
                productLoading,
                productError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);