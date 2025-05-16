import { useState } from 'react';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiTruck, FiLock, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import HeadingText from '../components/HeadingText';

export default function Checkout() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Pakistan',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        bankAccount: '',
        easypaisaNumber: '',
        paymentMethod: 'card',
    });

    const [activeSection, setActiveSection] = useState('shipping');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const method = {
            card: 'Credit/Debit Card',
            bank: 'Bank Transfer',
            easypaisa: 'Easypaisa / JazzCash',
            cod: 'Cash on Delivery',
        }[form.paymentMethod];

        setIsProcessing(false);
        alert(`Order placed using ${method}!`);
    };

    const countries = ['Pakistan', 'United States', 'United Kingdom', 'Canada', 'UAE'];
    const subtotal = 42.50; // This would normally come from cart
    const shipping = 4.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen py-12 px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <HeadingText
                    title="Complete Your Order"
                    description="Secure checkout with multiple payment options"
                />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Checkout Steps */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            {/* Checkout Steps Header */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveSection('shipping')}
                                    className={`flex-1 py-4 font-medium text-center ${activeSection === 'shipping' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                                >
                                    Shipping
                                </button>
                                <button
                                    onClick={() => setActiveSection('payment')}
                                    className={`flex-1 py-4 font-medium text-center ${activeSection === 'payment' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
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
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Shipping Details</h3>
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name*</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email*</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number*</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="03XX-XXXXXXX"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address*</label>
                                                <textarea
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    required
                                                    rows={3}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City*</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={form.city}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country*</label>
                                                    <div className="relative">
                                                        <select
                                                            name="country"
                                                            value={form.country}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                                                        >
                                                            {countries.map(country => (
                                                                <option key={country} value={country}>{country}</option>
                                                            ))}
                                                        </select>
                                                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code*</label>
                                                    <input
                                                        type="text"
                                                        name="zip"
                                                        value={form.zip}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    />
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
                                                <div
                                                    className={`p-4 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'card' }))}
                                                >
                                                    <div className="flex items-center">
                                                        <FiCreditCard className="text-xl mr-3 text-gray-700" />
                                                        <span className="font-medium">Credit/Debit Card</span>
                                                    </div>
                                                    {form.paymentMethod === 'card' && (
                                                        <div className="mt-4 space-y-3">
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="cardNumber"
                                                                    value={form.cardNumber}
                                                                    onChange={handleChange}
                                                                    required
                                                                    maxLength={19}
                                                                    placeholder="1234 5678 9012 3456"
                                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                                />
                                                                <div className="absolute right-3 top-3 flex space-x-2">
                                                                    <div className="w-8 h-5 bg-blue-500 rounded-sm"></div>
                                                                    <div className="w-8 h-5 bg-yellow-400 rounded-sm"></div>
                                                                    <div className="w-8 h-5 bg-red-500 rounded-sm"></div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    name="expiry"
                                                                    value={form.expiry}
                                                                    onChange={handleChange}
                                                                    required
                                                                    maxLength={5}
                                                                    placeholder="MM/YY"
                                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                                />
                                                                <div className="relative">
                                                                    <input
                                                                        type="password"
                                                                        name="cvv"
                                                                        value={form.cvv}
                                                                        onChange={handleChange}
                                                                        required
                                                                        maxLength={4}
                                                                        placeholder="CVV"
                                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                                    />
                                                                    <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div
                                                    className={`p-4 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'easypaisa' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'easypaisa' }))}
                                                >
                                                    <div className="flex items-center">
                                                        <FiSmartphone className="text-xl mr-3 text-gray-700" />
                                                        <span className="font-medium">Easypaisa</span>
                                                    </div>
                                                    {form.paymentMethod === 'easypaisa' && (
                                                        <div className="mt-4">
                                                            <input
                                                                type="text"
                                                                name="easypaisaNumber"
                                                                value={form.easypaisaNumber}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="03XX-XXXXXXX"
                                                                maxLength={11}
                                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div
                                                    className={`p-4 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'cod' }))}
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
                                                    className={`w-full ${isProcessing ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center`}
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6">
                            <h3 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200">Order Summary</h3>

                            <div className="p-6 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-semibold mb-6">
                                    <span>Total</span>
                                    <span className="text-green-600">${total.toFixed(2)}</span>
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