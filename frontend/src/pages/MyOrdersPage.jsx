import { Calendar, Package, CheckCircle, Truck, RefreshCw, XCircle, Search, ChevronDown, ChevronRight, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const MyOrdersPage = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const orders = [
        {
            id: 'ORD-78451',
            date: '2023-11-15',
            status: 'Delivered',
            items: 3,
            total: 89.97,
            deliveryDate: '2023-11-18',
            trackingNumber: 'UPS-9345-9876',
            paymentMethod: 'Visa •••• 4242',
            shippingAddress: '1456 Greenview Dr, Apt 302, San Francisco, CA 94123',
            itemsDetails: [
                {
                    id: 1,
                    name: 'Organic Turmeric Root Powder (500g)',
                    image: '/products/turmeric.jpg',
                    price: 24.99,
                    quantity: 2,
                    status: 'Delivered',
                    returnEligible: true
                },
                {
                    id: 2,
                    name: 'Premium Ashwagandha Capsules (120ct)',
                    image: '/products/ashwagandha.jpg',
                    price: 39.99,
                    quantity: 1,
                    status: 'Delivered',
                    returnEligible: true
                }
            ]
        },
        {
            id: 'ORD-78236',
            date: '2023-11-10',
            status: 'Shipped',
            items: 2,
            total: 54.98,
            deliveryDate: '2023-11-16',
            trackingNumber: 'FEDEX-7823-4512',
            paymentMethod: 'Mastercard •••• 9876',
            shippingAddress: '1456 Greenview Dr, Apt 302, San Francisco, CA 94123',
            itemsDetails: [
                {
                    id: 3,
                    name: 'Holy Basil (Tulsi) Tea (50 bags)',
                    image: '/products/tulsi-tea.jpg',
                    price: 14.99,
                    quantity: 1,
                    status: 'Shipped',
                    returnEligible: false
                },
                {
                    id: 4,
                    name: 'Triphala Powder (200g)',
                    image: '/products/triphala.jpg',
                    price: 39.99,
                    quantity: 1,
                    status: 'Shipped',
                    returnEligible: false
                }
            ]
        },
        {
            id: 'ORD-77984',
            date: '2023-10-28',
            status: 'Cancelled',
            items: 1,
            total: 29.99,
            deliveryDate: null,
            trackingNumber: null,
            paymentMethod: 'PayPal',
            shippingAddress: '1456 Greenview Dr, Apt 302, San Francisco, CA 94123',
            itemsDetails: [
                {
                    id: 5,
                    name: 'Moringa Leaf Powder (250g)',
                    image: '/products/moringa.jpg',
                    price: 29.99,
                    quantity: 1,
                    status: 'Cancelled',
                    returnEligible: false
                }
            ]
        }
    ];

    const statusStyles = {
        Delivered: { bg: 'bg-green-50', text: 'text-green-800', icon: CheckCircle },
        Shipped: { bg: 'bg-blue-50', text: 'text-blue-800', icon: Truck },
        Processing: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: RefreshCw },
        Cancelled: { bg: 'bg-red-50', text: 'text-red-800', icon: XCircle }
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const filteredOrders = activeFilter === 'All'
        ? orders
        : orders.filter(order => {
            if (activeFilter === 'To Ship') return order.status === 'Processing';
            if (activeFilter === 'To Receive') return order.status === 'Shipped';
            if (activeFilter === 'Completed') return order.status === 'Delivered';
            return true;
        });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order History</h1>
                        <p className="text-gray-600 mt-1">View and manage your recent purchases</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Search by order ID or product..."
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['All', 'To Ship', 'To Receive', 'Completed'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeFilter === filter
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        const StatusIcon = statusStyles[order.status].icon;
                        return (
                            <div key={order.id} className="border-b border-gray-100 last:border-b-0">
                                {/* Order Summary */}
                                <div
                                    className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleOrderExpand(order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${statusStyles[order.status].bg}`}>
                                            <StatusIcon className={`h-5 w-5 ${statusStyles[order.status].text}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">Order #{order.id}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(order.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                <span className="mx-2">•</span>
                                                {order.items} {order.items > 1 ? 'items' : 'item'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                                            <p className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-flex items-center ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
                                                {order.status}
                                            </p>
                                        </div>
                                        <ChevronRight
                                            className={`h-5 w-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* Expanded Order Details */}
                                {expandedOrder === order.id && (
                                    <div className="px-5 py-4 md:px-6 md:py-5 bg-gray-50 border-t border-gray-100">
                                        {/* Order Timeline */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Order Status</h4>
                                            <div className="relative pl-8">
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                                <div className="relative pb-6">
                                                    <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-green-500 border-4 border-white"></div>
                                                    <div className="pl-2">
                                                        <p className="text-sm font-medium text-gray-900">Order confirmed</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(order.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {order.status !== 'Cancelled' && (
                                                    <>
                                                        <div className="relative pb-6">
                                                            <div className={`absolute -left-8 top-0 h-4 w-4 rounded-full ${order.status === 'Processing' ? 'bg-gray-300 border-4 border-white' : 'bg-green-500 border-4 border-white'}`}></div>
                                                            <div className="pl-2">
                                                                <p className="text-sm font-medium text-gray-900">Processing</p>
                                                                {order.status !== 'Processing' && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {new Date(order.date).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="relative pb-6">
                                                            <div className={`absolute -left-8 top-0 h-4 w-4 rounded-full ${['Processing', 'Cancelled'].includes(order.status) ? 'bg-gray-300 border-4 border-white' : 'bg-green-500 border-4 border-white'}`}></div>
                                                            <div className="pl-2">
                                                                <p className="text-sm font-medium text-gray-900">Shipped</p>
                                                                {order.status === 'Shipped' && order.trackingNumber && (
                                                                    <div className="mt-1 flex items-center">
                                                                        <span className="text-xs text-gray-500 mr-2">
                                                                            Tracking #{order.trackingNumber}
                                                                        </span>
                                                                        <button className="text-xs font-medium text-green-600 hover:text-green-800">
                                                                            Track package
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {order.status === 'Delivered' && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Delivered on {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Order Details</h4>
                                            <div className="space-y-4">
                                                {order.itemsDetails.map((item) => (
                                                    <div key={item.id} className="flex p-3 bg-white rounded-lg border border-gray-100">
                                                        <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-100">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex-1">
                                                            <div className="flex justify-between">
                                                                <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                                                                <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>

                                                            <div className="mt-3 flex flex-wrap gap-2">
                                                                <button className="text-xs font-medium text-green-600 hover:text-green-800 px-2.5 py-1 border border-green-100 rounded-full bg-green-50">
                                                                    Buy it again
                                                                </button>
                                                                {item.returnEligible && (
                                                                    <button className="text-xs font-medium text-gray-600 hover:text-gray-800 px-2.5 py-1 border border-gray-200 rounded-full bg-white">
                                                                        Return or replace
                                                                    </button>
                                                                )}
                                                                <button className="text-xs font-medium text-gray-600 hover:text-gray-800 px-2.5 py-1 border border-gray-200 rounded-full bg-white">
                                                                    Write a review
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Shipping Information</h4>
                                                <div className="bg-white p-4 rounded-lg border border-gray-100">
                                                    <p className="text-sm text-gray-900">{order.shippingAddress}</p>
                                                    {order.trackingNumber && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <p className="text-xs text-gray-500">Tracking number</p>
                                                            <p className="text-sm font-medium text-gray-900 mt-1">{order.trackingNumber}</p>
                                                            <button className="mt-2 text-sm font-medium text-green-600 hover:text-green-800 flex items-center">
                                                                Track package <ArrowRight className="h-4 w-4 ml-1" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Payment Summary</h4>
                                                <div className="bg-white p-4 rounded-lg border border-gray-100">
                                                    <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                        <span>Subtotal</span>
                                                        <span>${order.total.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                        <span>Shipping</span>
                                                        <span>$0.00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                        <span>Tax</span>
                                                        <span>$0.00</span>
                                                    </div>
                                                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
                                                        <span className="text-sm font-medium text-gray-900">Total</span>
                                                        <span className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</span>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <p className="text-xs text-gray-500">Payment method</p>
                                                        <p className="text-sm font-medium text-gray-900 mt-1">{order.paymentMethod}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Actions */}
                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                                                Leave review
                                            </button>
                                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                                                Contact support
                                            </button>
                                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                                                Print receipt
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="p-12 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {activeFilter === 'All'
                                ? "You haven't placed any orders yet."
                                : `You don't have any ${activeFilter.toLowerCase()} orders.`}
                        </p>
                        <div className="mt-6">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination - Desktop */}
            {filteredOrders.length > 0 && (
                <div className="mt-8 hidden sm:flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                            <span className="font-medium">{orders.length}</span> orders
                        </p>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <button className="p-2 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <button className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            1
                        </button>
                        <button className="p-2 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            )}

            {/* Pagination - Mobile */}
            {filteredOrders.length > 0 && (
                <div className="mt-8 flex items-center justify-between sm:hidden">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                    </button>
                    <div className="text-sm text-gray-700">
                        Page 1 of 1
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;