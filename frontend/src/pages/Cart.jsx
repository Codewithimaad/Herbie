import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

export default function Cart() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const {
        cartItems,
        isLoading,
        error,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        currency
    } = useCart();

    const [localLoading, setLocalLoading] = useState(false);
    const [currentlyUpdating, setCurrentlyUpdating] = useState(null);

    // Redirect to login if no token
    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: '/cart' } });
            toast.info('Please login to view your cart');

        }
    }, [token, navigate]);

    // Verify cart state on load
    useEffect(() => {
        if (token && cartItems.length === 0 && isLoading) {
            fetchCart();
        }
    }, [cartItems, isLoading, fetchCart, token]);

    const handleRemove = async (productId) => {
        if (!token) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        setLocalLoading(false);
        setCurrentlyUpdating(productId);
        try {
            const { success, message } = await removeFromCart(productId);
            if (!success) throw new Error(message);
            toast.success('Item removed from cart');
        } catch (error) {
            console.error("Failed to remove item:", error);
            toast.error(error.message);
        } finally {
            setLocalLoading(false);
            setCurrentlyUpdating(null);
        }
    };

    const handleQuantityChange = async (productId, newQty) => {
        if (!token) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        if (newQty < 1) return;
        setLocalLoading(true);
        setCurrentlyUpdating(productId);
        try {
            const { success, message } = await updateQuantity(productId, newQty);
            if (!success) throw new Error(message);
            toast.success('Quantity updated');
        } catch (error) {
            console.error("Failed to update quantity:", error);
            toast.error(error.message);
        } finally {
            setLocalLoading(false);
            setCurrentlyUpdating(null);
        }
    };

    const handleClearCart = async () => {
        if (!token) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        setLocalLoading(true);
        try {
            await clearCart();
        } catch (error) {
            console.error("Failed to clear cart:", error);
        } finally {
            setLocalLoading(false);
        }
    };

    // Calculate cart totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 50 ? 0 : 4.99;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + shippingFee + tax;

    if (!token) {
        // Show loading while redirect happens
        return <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>;
    }

    if (isLoading && cartItems.length === 0) {
        return <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>;
    }

    if (error) {
        return (
            <section className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
                <div className="text-red-500 bg-red-50 p-4 rounded-lg max-w-md">
                    Error loading cart: {error}
                </div>
                <button
                    onClick={fetchCart}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Retry
                </button>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-0 md:px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FiShoppingCart className="text-green-600 w-20 h-20 mx-auto" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 max-w-md">Looks like you haven't added any herbs to your cart yet</p>
                <Link
                    to="/products"
                    className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full hover:from-green-700 hover:to-green-800 transition-all text-lg font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                >
                    Browse Products <FiArrowRight />
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-0 sm:px-6 py-12">
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-10 tracking-tight"
            >
                Your Shopping Cart
            </motion.h2>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="flex-1 space-y-6">
                    <AnimatePresence>
                        {cartItems.map(item => {
                            const isUpdating = currentlyUpdating === item.id;
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                                    className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 relative"
                                >
                                    {isUpdating && (
                                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                                        </div>
                                    )}

                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full rounded-xl object-cover border border-gray-200"
                                            onError={(e) => e.target.src = '/herbs/placeholder.jpg'}
                                        />
                                        <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {item.quantity}
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                                <p className="text-green-700 text-lg font-bold mt-1">
                                                    {currency}{item.price.toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border rounded-full overflow-hidden bg-gray-50">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                        className="p-2 px-3 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                                                        disabled={item.quantity <= 1 || localLoading}
                                                    >
                                                        <FiMinus size={16} />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                        className="p-2 px-3 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                                                        disabled={localLoading}
                                                    >
                                                        <FiPlus size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.productId)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition disabled:opacity-50"
                                                    disabled={localLoading}
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleClearCart}
                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                            disabled={localLoading || cartItems.length === 0}
                        >
                            {localLoading ? 'Clearing...' : (
                                <>
                                    <FiTrash2 size={16} />
                                    Clear Cart
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <motion.aside
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full lg:w-96 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6 h-fit"
                >
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                        Order Summary
                    </h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                            <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                                {shippingFee === 0 ? 'FREE' : `${currency}${shippingFee.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax ({(taxRate * 100)}%)</span>
                            <span className="font-medium">{currency}{tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-lg font-semibold border-t pt-4 mb-6">
                        <span>Total</span>
                        <span className="text-green-700">{currency}{grandTotal.toFixed(2)}</span>
                    </div>

                    <Link
                        to="/checkout"
                        className="flex w-full text-center py-2 sm:py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm sm:text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg items-center justify-center gap-2 disabled:opacity-50"
                        disabled={localLoading}
                    >
                        {localLoading ? 'Processing...' : 'Proceed to Checkout'} {!localLoading && <FiArrowRight />}
                    </Link>

                    {subtotal < 50 && (
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Spend {currency}{(50 - subtotal).toFixed(2)} more for free shipping
                        </p>
                    )}
                </motion.aside>
            </div>
        </section>
    );
}