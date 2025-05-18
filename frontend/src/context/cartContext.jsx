import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { token } = useAuth();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const api = axios.create({
        baseURL: backendUrl,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
        }
    });

    const transformCartItems = (items) => {
        return items.map(item => ({
            id: item._id,
            productId: item.product?._id,
            _id: item._id,
            name: item.product?.name || 'Unknown Product',
            price: item.product?.price || 0,
            quantity: item.quantity,
            image: item.product?.images?.[0] || '/herbs/placeholder.jpg',
            category: item.product?.category || 'Uncategorized'
        }));
    };

    const fetchCart = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/cart');
            const items = Array.isArray(response.data) ? response.data : [];
            setCartItems(transformCartItems(items));
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setError(err.response?.data?.message || 'Failed to load cart');
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setCartItems([]);
            return;
        }
        fetchCart();
    }, [token]);

    const addToCart = async (productId, quantity) => {
        try {
            await api.post('/api/cart/add', { productId, quantity });
            await fetchCart();
            toast.success('Added to cart!');
            return { success: true };
        } catch (err) {
            console.error("Add to cart error:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Add to cart failed';
            toast.error(errorMsg);
            return { success: false, message: errorMsg };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await api.post('/api/cart/remove', { productId });
            await fetchCart();
            return { success: true, message: 'Product removed from cart' };
        } catch (err) {
            console.error("Remove from cart error:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to remove from cart';
            return { success: false, message: errorMsg };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            await api.post('/api/cart/update', { productId, quantity });
            await fetchCart();
            return { success: true, message: 'Cart updated' };
        } catch (err) {
            console.error("Update quantity error:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to update cart';
            return { success: false, message: errorMsg };
        }
    };



    const clearCart = async () => {
        try {
            await api.post('/api/cart/clear');
            setCartItems([]); // Immediately set empty array
            toast.success('Cart cleared successfully');
        } catch (err) {
            console.error("Clear cart error:", err);
            toast.error('Failed to clear cart');
        } finally {
            await fetchCart(); // Then verify with server
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isLoading,
                error,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}