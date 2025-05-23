import React from 'react';
import { RefreshCw, AlertCircle, Mail, Clock, Package, Check } from 'lucide-react';
import HeadingText from '../components/HeadingText';

const RefundPolicy = () => {
    return (
        <section className="min-h-screen text-sm md:text-lg bg-gray-50 py-16 px-2 sm:px-6 lg:px-8">
            <div className="mx-auto">
                <div className="text-center mb-12">
                    <HeadingText title='Refund & Exchange Policy' />
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Clear guidelines for returns and exchanges
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8  border-gray-100">
                    {/* Return/Exchange Policy */}
                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <div className="p-2 rounded-lg bg-green-50 text-green-600 mr-4">
                                <RefreshCw className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Return & Exchange Policy
                            </h2>
                        </div>

                        <div className="space-y-5 text-gray-700">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                                </div>
                                <p>
                                    Products can only be returned/exchanged if damaged upon receipt or if they don't match your specifications.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                                </div>
                                <div>
                                    <p className="font-medium mb-2">24-Hour Window:</p>
                                    <p>
                                        Contact customer service within <span className="font-semibold text-red-500">24 hours</span> of delivery with:
                                    </p>
                                    <ul className="list-disc list-inside pl-5 mt-2 space-y-1">
                                        <li>Photographic evidence of damage</li>
                                        <li>Picture of the invoice</li>
                                        <li>Your order ID</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                                    <p className="text-red-700">
                                        Note: Online purchases cannot be exchanged at physical stores. Keep all packaging until your case is resolved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Defective Items */}
                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                                <Package className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Defective Items Process
                            </h2>
                        </div>

                        <div className="space-y-5 text-gray-700">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
                                </div>
                                <p>
                                    For defective items, we'll arrange pickup through our courier partner with advance notice.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
                                </div>
                                <div>
                                    <p className="font-medium mb-2">Required Documentation:</p>
                                    <ul className="list-disc list-inside pl-5 space-y-1">
                                        <li>Clear photos of the damage</li>
                                        <li>Copy of the invoice</li>
                                        <li>Courier airway bill (if available)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
                                </div>
                                <p>
                                    Replacement will be issued for the specific item listed on the invoice after verification.
                                </p>
                            </div>

                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <div className="flex">
                                    <Clock className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                                    <p className="text-yellow-700">
                                        The 24-hour complaint window applies. Original packaging must be maintained - repackaging may incur customer charges.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Need Help With a Return?
                            </h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="font-medium text-gray-900 mb-2">Contact Support:</p>
                                <p className="text-gray-600">Email: returns@harbie.com</p>
                                <p className="text-gray-600">Phone: +92 300 1234567</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 mb-2">Business Hours:</p>
                                <p className="text-gray-600">Monday-Saturday: 9AM - 6PM</p>
                                <p className="text-gray-600">Closed on Sundays</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RefundPolicy;