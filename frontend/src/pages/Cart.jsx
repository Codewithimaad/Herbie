import { useState } from 'react';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import image from '../assets/images/Herb1.webp'

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'Organic Chamomile Flowers', price: 5.99, quantity: 2, image: image, category: 'Tea Herbs' },
        { id: '2', name: 'Peppermint Leaves', price: 3.49, quantity: 1, image: image, category: 'Culinary Herbs' },
    ]);

    const handleRemove = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(items =>
            items.map(item => (item.id === id ? { ...item, quantity: newQty } : item))
        );
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = 4.99;
    const tax = totalPrice * 0.08;
    const grandTotal = totalPrice + shippingFee + tax;

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
        <section className="max-w-7xl mx-auto px-0 md:px-6 py-12">
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10 tracking-tight"
            >
                Your Shopping Cart
            </motion.h2>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Cart Items */}
                <div className="flex-1 space-y-6">
                    <AnimatePresence>
                        {cartItems.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                                className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                            >
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        onError={(e) => (e.target.src = '/herbs/placeholder.jpg')}
                                        className="w-full h-full rounded-xl object-cover border border-gray-200"
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
                                                ${item.price.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Control */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border rounded-full overflow-hidden bg-gray-50">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="p-2 px-3 text-green-600 hover:bg-green-100 transition"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <FiMinus size={16} />
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="p-2 px-3 text-green-600 hover:bg-green-100 transition"
                                                    aria-label="Increase quantity"
                                                >
                                                    <FiPlus size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
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
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-lg font-semibold border-t pt-4 mb-6">
                        <span>Total</span>
                        <span className="text-green-700">${grandTotal.toFixed(2)}</span>
                    </div>

                    <Link
                        to="/checkout"
                        className="block w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        Proceed to Checkout <FiArrowRight />
                    </Link>

                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Free shipping on orders over $50
                    </p>
                </motion.aside>
            </div>
        </section>
    );
}