import { useState, useEffect } from 'react';
import { FiCreditCard, FiSmartphone, FiTruck, FiLock, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import HeadingText from '../components/HeadingText';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Checkout() {
    const { cartItems, currency, clearCart, isLoading, error, fetchCart } = useCart();
    const { token, backendUrl } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Pakistan',
        zip: '',
        paymentMethod: 'cod', // Default to COD since others are disabled
    });
    const [formErrors, setFormErrors] = useState({});
    const [activeSection, setActiveSection] = useState('shipping');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: '/checkout' } });
            toast.info('Please login to proceed with checkout');
        }
    }, [token, navigate]);

    // Fetch cart if empty and not loading
    useEffect(() => {
        if (token && cartItems.length === 0 && !isLoading && !isOrderPlaced) {
            fetchCart();
        }
    }, [cartItems, isLoading, fetchCart, token, isOrderPlaced]);

    // Redirect to cart if cart is empty (skip if order was just placed)
    useEffect(() => {
        if (!isLoading && cartItems.length === 0 && !error && !isOrderPlaced) {
            navigate('/cart');
            toast.info('Your cart is empty. Please add items to proceed.');
        }
    }, [cartItems, isLoading, error, navigate, isOrderPlaced]);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 50 ? 0 : 4.99;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + shippingFee + tax;

    const validateForm = () => {
        const errors = {};
        if (!form.name.trim()) errors.name = 'Full name is required';
        if (!form.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Invalid email format';
        }
        if (!form.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^03[0-4][0-9]-[0-9]{7}$/.test(form.phone)) {
            errors.phone = 'Phone format: 03XX-XXXXXXX';
        }
        if (!form.address.trim()) errors.address = 'Address is required';
        if (!form.city.trim()) errors.city = 'City is required';
        if (!form.zip.trim()) {
            errors.zip = 'ZIP code is required';
        } else if (!/^\d{5}$/.test(form.zip)) {
            errors.zip = 'ZIP code must be 5 digits';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'phone') {
            formattedValue = value
                .replace(/\D/g, '')
                .slice(0, 11)
                .replace(/^(03\d{2})(\d{0,7})/, '$1-$2');
        } else if (name === 'zip') {
            formattedValue = value.replace(/\D/g, '').slice(0, 5);
        }

        setForm((prev) => ({ ...prev, [name]: formattedValue }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        setIsProcessing(true);
        try {
            const orderData = {
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    country: form.country,
                    zip: form.zip,
                },
                paymentMethod: form.paymentMethod,
                paymentDetails: {},
                totals: {
                    subtotal,
                    shipping: shippingFee,
                    tax,
                    grandTotal,
                },
            };

            const response = await axios.post(
                `${backendUrl}/api/orders`,
                orderData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            setIsOrderPlaced(true);
            await clearCart();
            toast.success('Order placed successfully!');
            navigate('/orders', { state: { order: response.data.order } });
        } catch (err) {
            console.error('Checkout error:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };

    const countries = ['Pakistan', 'United States', 'United Kingdom', 'Canada', 'UAE'];

    if (!token || (isLoading && cartItems.length === 0)) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
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

    return (
        <div className="min-h-screen py-12 px-0 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <HeadingText
                    title="Complete Your Order"
                    description="Secure checkout with multiple payment options"
                />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Checkout Steps */}
                    <div className="lg:w-2/3">
                        <div className="bg-white md:rounded-xl md:shadow-lg overflow-hidden mb-6">
                            {/* Checkout Steps Header */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveSection('shipping')}
                                    className={`flex-1 py-4 font-medium text-center ${activeSection === 'shipping'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    Shipping
                                </button>
                                <button
                                    onClick={() => setActiveSection('payment')}
                                    className={`flex-1 py-4 font-medium text-center ${activeSection === 'payment'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    Payment
                                </button>
                            </div>

                            {/* Shipping Information */}
                            <AnimatePresence mode="wait">
                                {activeSection === 'shipping' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-6 sm:p-8"
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                            Shipping Details
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Full Name*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2.5 bg-gray-50  ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                                    />
                                                    {formErrors.name && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Email*
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2.5 bg-gray-50 ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                                    />
                                                    {formErrors.email && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Phone Number*
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="03XX-XXXXXXX"
                                                    className={`w-full px-4 py-2.5 bg-gray-50  ${formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                                />
                                                {formErrors.phone && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Address*
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className={`w-full px-4 py-2.5 bg-gray-50  ${formErrors.address ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none`}
                                                />
                                                {formErrors.address && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        City*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={form.city}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2.5 bg-gray-50  ${formErrors.city ? 'border-red-500' : 'border-gray-300'
                                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                                    />
                                                    {formErrors.city && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Country*
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            name="country"
                                                            value={form.country}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2.5 bg-gray-50  border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                                                        >
                                                            {countries.map((country) => (
                                                                <option key={country} value={country}>
                                                                    {country}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        ZIP Code*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="zip"
                                                        value={form.zip}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2.5 bg-gray-50  ${formErrors.zip ? 'border-red-500' : 'border-gray-300'
                                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                                    />
                                                    {formErrors.zip && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.zip}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={() => setActiveSection('payment')}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                                                >
                                                    Continue to Payment
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Payment Information */}
                            <AnimatePresence mode="wait">
                                {activeSection === 'payment' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-6 sm:p-8"
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h3>
                                        <div className="space-y-4">
                                            {/* Payment Options */}
                                            <div className="space-y-4">
                                                {/* Disabled Card Payment */}
                                                <div
                                                    className={`p-4 border rounded-xl cursor-not-allowed bg-gray-100 opacity-75`}
                                                >
                                                    <div className="flex items-center">
                                                        <FiCreditCard className="text-xl mr-3 text-gray-500" />
                                                        <span className="font-medium text-gray-500">Credit/Debit Card (Temporarily Unavailable)</span>
                                                    </div>
                                                </div>

                                                {/* Disabled Easypaisa Payment */}
                                                <div
                                                    className={`p-4 border rounded-xl cursor-not-allowed bg-gray-100 opacity-75`}
                                                >
                                                    <div className="flex items-center">
                                                        <FiSmartphone className="text-xl mr-3 text-gray-500" />
                                                        <span className="font-medium text-gray-500">Easypaisa (Temporarily Unavailable)</span>
                                                    </div>
                                                </div>

                                                {/* Only COD enabled */}
                                                <div
                                                    className={`p-4 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'cod'
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setForm((prev) => ({ ...prev, paymentMethod: 'cod' }))}
                                                >
                                                    <div className="flex items-center">
                                                        <FiTruck className="text-xl mr-3 text-gray-700" />
                                                        <span className="font-medium">Cash on Delivery</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={isProcessing}
                                                    className={`w-full ${isProcessing
                                                        ? 'bg-green-700'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                        } text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center`}
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        'Complete Purchase'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
                            <h3 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200">
                                Order Summary
                            </h3>

                            <div className="p-6 space-y-4 text-sm md:text-base">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                                    </span>
                                    <span className="font-medium">
                                        {currency}
                                        {subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {shippingFee === 0 ? 'FREE' : `${currency}${shippingFee.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax ({taxRate * 100}%)</span>
                                    <span className="font-medium">
                                        {currency}
                                        {tax.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-semibold mb-6">
                                    <span>Total</span>
                                    <span className="text-green-600">
                                        {currency}
                                        {grandTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm text-gray-500">
                                    <FiLock className="mr-2" />
                                    <span>Secure SSL encrypted payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}