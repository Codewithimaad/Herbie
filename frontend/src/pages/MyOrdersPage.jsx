import { Calendar, Package, CheckCircle, Truck, RefreshCw, XCircle, Search, ChevronRight, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import OrderTimeline from '../components/OrderTimeline';


const MyOrdersPage = () => {
    const { token, backendUrl } = useAuth();
    const { currency } = useCart();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log('order data: ', response.data.orders)
            setOrders(response.data.orders);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.response?.data?.message || 'Failed to load orders');
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: '/orders' } });
            toast.info('Please login to view your orders');
            return;
        }
        fetchOrders();
    }, [token, backendUrl, navigate]);

    const cancelOrder = async (orderId) => {
        setCancelOrderId(orderId);
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        try {
            await axios.patch(`${backendUrl}/api/orders/${cancelOrderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            toast.success('Order cancelled successfully');
            await fetchOrders();
        } catch (err) {
            console.error('Error cancelling order:', err);
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setShowCancelModal(false);
            setCancelOrderId(null);
        }
    };





    const statusStyles = {
        Delivered: { bg: 'bg-green-100/60', text: 'text-green-800', icon: CheckCircle, dot: 'bg-green-500' },
        Shipped: { bg: 'bg-blue-100/60', text: 'text-blue-800', icon: Truck, dot: 'bg-blue-500' },
        Processing: { bg: 'bg-yellow-100/60', text: 'text-yellow-800', icon: RefreshCw, dot: 'bg-yellow-500' },
        Pending: { bg: 'bg-yellow-100/60', text: 'text-yellow-800', icon: RefreshCw, dot: 'bg-yellow-500' },
        Cancelled: { bg: 'bg-red-100/60', text: 'text-red-800', icon: XCircle, dot: 'bg-red-500' },
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const filteredOrders = activeFilter === 'All'
        ? orders
        : orders.filter(order => {
            if (activeFilter === 'To Ship') return ['Processing', 'Pending'].includes(order.status);
            if (activeFilter === 'To Receive') return order.status === 'Shipped';
            if (activeFilter === 'Completed') return order.status === 'Delivered';
            return true;
        });

    console.log('date:', filteredOrders);


    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
                <section className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
                    <div className="text-red-500 bg-red-50 p-4 rounded-lg max-w-md">
                        Error loading orders: {error}
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Retry
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Cancel Order Modal */}
            <Transition appear show={showCancelModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowCancelModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="p-3 rounded-full bg-red-100">
                                            <AlertTriangle className="h-6 w-6 text-red-600" />
                                        </div>
                                    </div>
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 text-center">
                                        Cancel Order
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 text-center">
                                            Are you sure you want to cancel Order #{cancelOrderId}? This action cannot be undone.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-center gap-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                            onClick={confirmCancelOrder}
                                        >
                                            Cancel Order
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                            onClick={() => setShowCancelModal(false)}
                                        >
                                            Keep Order
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-500 mt-1">View and manage your recent purchases</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
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
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeFilter === filter
                                ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
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
                        const StatusIcon = statusStyles[order.status]?.icon || RefreshCw;
                        return (
                            <div key={order.id} className="border-b border-gray-100 last:border-b-0">
                                {/* Order Summary */}
                                <div
                                    className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                    onClick={() => toggleOrderExpand(order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-lg ${statusStyles[order.status]?.bg || 'bg-gray-50'}`}>
                                            <StatusIcon className={`h-5 w-5 ${statusStyles[order.status]?.text || 'text-gray-800'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">Order #{order.id}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-pk', {
                                                    timeZone: 'Asia/Karachi',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                <span className="mx-2">•</span>
                                                {order.items} {order.items > 1 ? 'items' : 'item'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">{currency}{order.total.toFixed(2)}</p>
                                            <div className="mt-1.5 flex items-center justify-end">
                                                <span className={`h-2 w-2 rounded-full ${statusStyles[order.status]?.dot || 'bg-gray-500'} mr-2`}></span>
                                                <span className={`text-xs ${statusStyles[order.status]?.text || 'text-gray-800'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight
                                            className={`h-5 w-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* Expanded Order Details */}
                                {expandedOrder === order.id && (
                                    <div className="px-5 py-4 md:px-6 md:py-5 bg-gray-50/50 border-t border-gray-100">
                                        {/* Order Timeline */}

                                        {order && <OrderTimeline order={order} />}


                                        {/* Order Items */}
                                        <div className="mb-8">
                                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Order Details</h4>
                                            <div className="mb-8">

                                                <div className="space-y-4">
                                                    {order.itemsDetails.map((item) => (
                                                        <div key={item._id} className="flex p-3 bg-white rounded-lg border border-gray-100 shadow-xs">
                                                            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-100">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="ml-4 flex-1">
                                                                <div className="flex justify-between">
                                                                    <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                                                                    <p className="text-sm font-medium text-gray-900">{currency}{item.price.toFixed(2)}</p>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            const productId = item.product || 'not-found';
                                                                            navigate(`/product/${productId}`);
                                                                        }}
                                                                        className={`text-xs font-medium px-2.5 py-1 border border-green-100 rounded-full transition-colors ${item.product
                                                                            ? 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'
                                                                            : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                                                            }`}

                                                                    >
                                                                        Buy it again
                                                                    </button>
                                                                    {item.returnEligible && (
                                                                        <button
                                                                            onClick={() => {
                                                                                console.log('Return item:', item);
                                                                                navigate(`/products/${item.product}/return`);
                                                                            }}
                                                                            className="text-xs font-medium text-gray-600 hover:text-gray-800 px-2.5 py-1 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            Return or replace
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const productId = item.product || 'not-found';
                                                                            navigate(`/product/${productId}#reviews`);
                                                                        }}
                                                                        className={`text-xs font-medium px-2.5 py-1 border border-gray-200 rounded-full transition-colors ${item.product
                                                                            ? 'text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50'
                                                                            : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                                                            }`}
                                                                        aria-label={item.product ? `Write a review for ${item.name || 'product'}` : 'Product unavailable'}
                                                                        disabled={!item.product}
                                                                    >
                                                                        Write a review
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Payment Summary</h4>
                                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
                                                {(() => {
                                                    // Calculate from itemsDetails since totals is undefined
                                                    const orderSubtotal = order.itemsDetails.reduce(
                                                        (sum, item) => sum + (item.price * item.quantity),
                                                        0
                                                    );


                                                    // Since shipping/tax aren't provided, we'll calculate them
                                                    // You should replace these with actual values from your backend if available
                                                    const orderShipping = orderSubtotal > 1399 ? 0 : 149;
                                                    const taxRate = 0.08;
                                                    const orderTax = orderSubtotal * taxRate;
                                                    const orderTotal = orderSubtotal + orderShipping + orderTax;



                                                    return (
                                                        <>
                                                            <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                                <span>Subtotal ({order.items} items)</span>
                                                                <span>{currency}{orderSubtotal.toFixed(2)}</span>
                                                            </div>

                                                            <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                                <span>Shipping</span>
                                                                <span>{currency}{orderShipping}</span>
                                                            </div>

                                                            <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                                <span>Tax</span>
                                                                <span>{currency}{orderTax.toFixed(2)}</span>
                                                            </div>

                                                            <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
                                                                <span className="text-sm font-medium text-gray-900">Total</span>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {currency}{orderTotal.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </>
                                                    );
                                                })()}

                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500">Payment Status</p>
                                                    <p className={`text-sm font-medium mt-1 ${order.paymentMethod === 'paid' ? 'text-green-600' :
                                                        order.paymentMethod === 'cod' ? 'text-yellow-600' :
                                                            'text-gray-900'
                                                        }`}>
                                                        {order.paymentMethod === 'paid' ? (
                                                            'Paid'
                                                        ) : order.paymentMethod === 'cod' ? (
                                                            'Cash on Delivery'
                                                        ) : order.paymentMethod ? (
                                                            `Paid via ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}`
                                                        ) : (
                                                            'Pending Payment'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Actions */}
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            {['Pending', 'Processing'].includes(order.status) && (
                                                <button
                                                    onClick={() => cancelOrder(order.id)}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    navigate(`/product/${order.itemsDetails[0]?.product}`)
                                                }
                                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                            >
                                                Leave review
                                            </button>
                                            <button
                                                onClick={() => navigate('/contact')}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                            >
                                                Contact support
                                            </button>




                                        </div>
                                    </div>
                                )
                                }
                            </div>
                        );
                    })
                ) : (
                    <div className="p-12 text-center">
                        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No orders found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {activeFilter === 'All'
                                ? "You haven't placed any orders yet."
                                : `You don't have any ${activeFilter.toLowerCase()} orders.`}
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/')}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>



            {/* Pagination - Desktop */}
            {
                filteredOrders.length > 0 && (
                    <div className="mt-8 hidden sm:flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                                <span className="font-medium">{orders.length}</span> orders
                            </p>
                        </div>
                        <nav className="flex items-center space-x-2">
                            <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                1
                            </button>
                            <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors" disabled>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )
            }

            {/* Pagination - Mobile */}
            {
                filteredOrders.length > 0 && (
                    <div className="mt-8 flex items-center justify-between sm:hidden">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors" disabled>
                            Previous
                        </button>
                        <div className="text-sm text-gray-700">
                            Page 1 of 1
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors" disabled>
                            Next
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default MyOrdersPage;