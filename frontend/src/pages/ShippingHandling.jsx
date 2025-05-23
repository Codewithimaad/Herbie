import React from 'react';
import { Truck, Clock, Package, MapPin, Phone } from 'lucide-react';
import HeadingText from '../components/HeadingText';

const ShippingHandling = () => {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-2 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <HeadingText title='Shipping & Handling' />
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Fast, reliable delivery with complete transparency
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Delivery Timeline */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-4">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery Timeline</h2>
                                <p className="text-gray-700 mb-3">
                                    <span className="font-medium text-gray-900">3-6 working days</span> after dispatch
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Orders processed within <span className="font-medium">24 hours</span> of confirmation
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 italic">
                                Note: Delivery may be affected by weather, political situations, or unforeseen events.
                            </p>
                        </div>
                    </div>

                    {/* Delivery Charges */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-4">
                            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery Charges</h2>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                                        <span>Free shipping on orders <span className="font-medium">above PKR 1,399</span></span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                                        <span>Standard fee of <span className="font-medium">PKR 149</span> for smaller orders</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Order Tracking */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-4">
                            <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Track Your Order</h2>
                                <p className="text-gray-700 mb-2">
                                    Once your order is dispatched, you'll receive tracking details via SMS and email.
                                </p>
                                <div className="mt-3 text-sm text-gray-600 space-y-2">
                                    <p className="font-medium text-gray-700">To track your order:</p>
                                    <ol className="list-decimal list-inside space-y-1">
                                        <li>Check your registered email for tracking information</li>
                                        <li>Look for SMS notifications with tracking link</li>
                                        <li>Use the tracking number on our website's order status page</li>
                                        <li>Contact support if you don't receive tracking within 48 hours of order confirmation</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Attempts */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-4">
                            <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery Attempts</h2>
                                <p className="text-gray-700">
                                    <span className="font-medium">3 attempts</span> on consecutive working days
                                </p>
                                <div className="mt-3 text-sm text-gray-600">
                                    Please ensure your contact number is reachable
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Need more help?</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
                            <p className="text-gray-600 text-sm mb-2">Our team is available 24/7</p>
                            <p className="text-sm text-gray-700">
                                Email: support@herbie.com<br />
                                Phone: +92 300 1234567
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Shipping Policy</h4>
                            <p className="text-gray-600 text-sm">
                                For complete details about our shipping procedures, delivery timelines, and policies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ShippingHandling;