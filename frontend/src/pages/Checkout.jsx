import { useState } from 'react';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiTruck } from 'react-icons/fi';
import HeadingText from '../components/HeadingText';

export default function Checkout() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        bankAccount: '',
        easypaisaNumber: '',
        paymentMethod: 'card',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = {
            card: 'Credit/Debit Card',
            bank: 'Bank Transfer',
            easypaisa: 'Easypaisa / JazzCash',
            cod: 'Cash on Delivery',
        }[form.paymentMethod];

        alert(`Order placed using ${method}!`);
    };

    return (
        <div className="min-h-screen py-12 sm:px-2 md:px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">


                <HeadingText
                    title='Secure Checkout'
                    description=' Complete your purchase with confidence' />

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="md:flex">
                        {/* Left: Payment Options */}
                        <div className="md:w-1/2 p-8 border-r border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <FiCreditCard className="mr-2" />
                                Payment Method
                            </h2>

                            <div className="space-y-6">
                                {/* Payment Method Cards */}
                                <div
                                    className={`payment-card ${form.paymentMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'card' }))}
                                >
                                    <div className="flex items-center">
                                        <FiCreditCard className="text-xl mr-3" />
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
                                                    maxLength={16}
                                                    placeholder="Card Number"
                                                    className="payment-input"
                                                />
                                                <div className="absolute right-3 top-3">
                                                    <div className="flex space-x-2">
                                                        <div className="w-8 h-5 bg-blue-500 rounded-sm"></div>
                                                        <div className="w-8 h-5 bg-yellow-400 rounded-sm"></div>
                                                        <div className="w-8 h-5 bg-red-500 rounded-sm"></div>
                                                    </div>
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
                                                    className="payment-input"
                                                />
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={form.cvv}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength={4}
                                                    placeholder="CVV"
                                                    className="payment-input"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`payment-card ${form.paymentMethod === 'bank' ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'bank' }))}
                                >
                                    <div className="flex items-center">
                                        <FiDollarSign className="text-xl mr-3" />
                                        <span className="font-medium">Bank Transfer</span>
                                    </div>
                                    {form.paymentMethod === 'bank' && (
                                        <input
                                            type="text"
                                            name="bankAccount"
                                            value={form.bankAccount}
                                            onChange={handleChange}
                                            required
                                            placeholder="Bank Account / IBAN"
                                            className="payment-input mt-4"
                                        />
                                    )}
                                </div>

                                <div
                                    className={`payment-card ${form.paymentMethod === 'easypaisa' ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'easypaisa' }))}
                                >
                                    <div className="flex items-center">
                                        <FiSmartphone className="text-xl mr-3" />
                                        <span className="font-medium">Easypaisa / JazzCash</span>
                                    </div>
                                    {form.paymentMethod === 'easypaisa' && (
                                        <input
                                            type="text"
                                            name="easypaisaNumber"
                                            value={form.easypaisaNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="03XX-XXXXXXX"
                                            maxLength={11}
                                            className="payment-input mt-4"
                                        />
                                    )}
                                </div>

                                <div
                                    className={`payment-card ${form.paymentMethod === 'cod' ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'cod' }))}
                                >
                                    <div className="flex items-center">
                                        <FiTruck className="text-xl mr-3" />
                                        <span className="font-medium">Cash on Delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Customer Info */}
                        <div className="md:w-1/2 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Shipping Information
                            </h2>

                            <div className="space-y-5">
                                {/* Name + Email */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                {/* Phone + Zip Code */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={form.phone || ''}
                                            onChange={handleChange}
                                            required
                                            placeholder="03XX-XXXXXXX"
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={form.zip || ''}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. 54000"
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="form-input resize-none"
                                    />
                                </div>

                                {/* City + Country */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Complete Purchase
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Global Styles */}
            <style jsx global>{`
                .payment-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 0.75rem;
                    padding: 1.25rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .payment-card:hover {
                    border-color: #9ca3af;
                }
                .payment-card.active {
                    border-color: #10b981;
                    background-color: #f0fdf4;
                    box-shadow: 0 0 0 1px #10b981;
                }
                .payment-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    transition: all 0.2s ease;
                }
                .payment-input:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    transition: all 0.2s ease;
                }
                .form-input:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
                }
            `}</style>
        </div>
    );
}