// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
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
    }, [token]);

    const login = (userData, jwtToken) => {
        setUser(userData);
        if (jwtToken) {
            setToken(jwtToken);
            localStorage.setItem('token', jwtToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, { withCredentials: true });
    };

    // ✅ Add to Cart Function
    const addToCart = async (productId, quantity) => {
        try {
            const res = await fetch(`${backendUrl}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Add to cart failed');
            alert('Added to cart!');
        } catch (err) {
            alert(err.message);
        }
    };


    const handleRemoveFromCart = async (productId) => {
        try {
            const res = await fetch(`${backendUrl}/api/cart/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to remove from cart');
            alert('Product removed from cart');
            // Refresh cart UI here...
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateCartItem = async (productId, quantity) => {
        try {
            const res = await fetch(`${backendUrl}/api/cart/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update cart');
            alert('Cart updated');
            // Refresh cart UI here...
        } catch (err) {
            alert(err.message);
        }
    };




    return (
        <AuthContext.Provider value={{
            user,
            token,
            login, logout,
            loading, backendUrl,

        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
