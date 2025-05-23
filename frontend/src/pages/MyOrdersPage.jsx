import { Calendar, Package, CheckCircle, Truck, RefreshCw, XCircle, Search, ChevronRight, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
    const [printOrderId, setPrintOrderId] = useState(null);
    const printRef = useRef();

    // Fetch orders
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setOrders(response.data.orders);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
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

    // Cancel order
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
            await fetchOrders(); // Refresh orders
        } catch (err) {
            console.error('Error cancelling order:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setShowCancelModal(false);
            setCancelOrderId(null);
        }
    };

    // Print receipt
    const handlePrint = (orderId) => {
        if (!printRef.current) {
            console.error('Print reference is not set');
            toast.error('Unable to print receipt');
            return;
        }
        setPrintOrderId(orderId);
        setTimeout(() => {
            const printHandler = useReactToPrint({
                content: () => printRef.current,
                documentTitle: `Receipt_${orderId}_${new Date().toISOString().split('T')[0]}`,
                onAfterPrint: () => setPrintOrderId(null),
            });
            printHandler();
        }, 100); // Delay to ensure state update
    };

    const statusStyles = {
        Delivered: { bg: 'bg-green-50', text: 'text-green-800', icon: CheckCircle },
        Shipped: { bg: 'bg-blue-50', text: 'text-blue-800', icon: Truck },
        Processing: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: RefreshCw },
        Pending: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: RefreshCw },
        Cancelled: { bg: 'bg-red-50', text: 'text-red-800', icon: XCircle },
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

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
                <section className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
                    <div className="text-red-500 bg-red-50 p-4 rounded-lg max-w-md">
                        Error loading orders: {error}
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Retry
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
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
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-center mb-4">
                                        <AlertTriangle className="h-12 w-12 text-red-500" />
                                    </div>
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
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
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            onClick={confirmCancelOrder}
                                        >
                                            Cancel Order
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                        <h1 className="text-2xl text-center md:text-start md:text-3xl font-bold text-gray-900">Order History</h1>
                        <p className="text-gray-600 text-center md:text-start mt-1">View and manage your recent purchases</p>
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
                        const StatusIcon = statusStyles[order.status]?.icon || RefreshCw;
                        return (
                            <div key={order.id} className="border-b border-gray-100 last:border-b-0">
                                {/* Order Summary */}
                                <div
                                    className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleOrderExpand(order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${statusStyles[order.status]?.bg || 'bg-gray-50'}`}>
                                            <StatusIcon className={`h-5 w-5 ${statusStyles[order.status]?.text || 'text-gray-800'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">Order #{order.id}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(order.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                                <span className="mx-2">•</span>
                                                {order.items} {order.items > 1 ? 'items' : 'item'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{currency}{order.total.toFixed(2)}</p>
                                            <p className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-flex items-center ${statusStyles[order.status]?.bg || 'bg-gray-50'} ${statusStyles[order.status]?.text || 'text-gray-800'}`}>
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
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {order.status.toLowerCase() !== 'cancelled' && (
                                                    <>
                                                        <div className="relative pb-6">
                                                            <div className={`absolute -left-8 top-0 h-4 w-4 rounded-full ${['pending', 'processing'].includes(order.status.toLowerCase()) ? 'bg-gray-300 border-4 border-white' : 'bg-green-500 border-4 border-white'}`}></div>
                                                            <div className="pl-2">
                                                                <p className="text-sm font-medium text-gray-900">Processing</p>
                                                                {order.status.toLowerCase() !== 'pending' && order.status.toLowerCase() !== 'processing' && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {new Date(order.date).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="relative pb-6">
                                                            <div className={`absolute -left-8 top-0 h-4 w-4 rounded-full ${['pending', 'processing', 'cancelled'].includes(order.status.toLowerCase()) ? 'bg-gray-300 border-4 border-white' : 'bg-green-500 border-4 border-white'}`}></div>
                                                            <div className="pl-2">
                                                                <p className="text-sm font-medium text-gray-900">Shipped</p>
                                                                {order.status.toLowerCase() === 'shipped' && order.trackingNumber && (
                                                                    <div className="mt-1 flex items-center">
                                                                        <span className="text-xs text-gray-500 mr-2">
                                                                            Tracking #{order.trackingNumber}
                                                                        </span>
                                                                        <button className="text-xs font-medium text-green-600 hover:text-green-800">
                                                                            Track package
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {order.status.toLowerCase() === 'delivered' && order.deliveryDate && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Delivered on {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
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
                                                                <p className="text-sm font-medium text-gray-900">{currency}{item.price.toFixed(2)}</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>

                                                            <div className="mt-3 flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => navigate(`/products/${item.productId}`)}
                                                                    className="text-xs font-medium text-green-600 hover:text-green-800 px-2.5 py-1 border border-green-100 rounded-full bg-green-50"
                                                                >
                                                                    Buy it again
                                                                </button>
                                                                {item.returnEligible && (
                                                                    <button
                                                                        onClick={() => navigate(`/products/${item.productId}/return`)}
                                                                        className="text-xs font-medium text-gray-600 hover:text-gray-800 px-2.5 py-1 border border-gray-200 rounded-full bg-white"
                                                                    >
                                                                        Return or replace
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => navigate(`/products/${item.productId}#reviews`)}
                                                                    className="text-xs font-medium text-gray-600 hover:text-gray-800 px-2.5 py-1 border border-gray-200 rounded-full bg-white"
                                                                >
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
                                                        <span>{currency}{order.totals?.subtotal?.toFixed(2) || (order.total - (order.totals?.tax || 0) - (order.totals?.shipping || 0)).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                        <span>Shipping</span>
                                                        <span>{currency}{order.totals?.shipping?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-900 mb-2">
                                                        <span>Tax</span>
                                                        <span>{currency}{order.totals?.tax?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
                                                        <span className="text-sm font-medium text-gray-900">Total</span>
                                                        <span className="text-sm font-medium text-gray-900">{currency}{order.total.toFixed(2)}</span>
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
                                            {['Pending', 'Processing'].includes(order.status) && (
                                                <button
                                                    onClick={() => cancelOrder(order.id)}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/product/${order.itemsDetails[0]?.productId}#reviews`)}
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
                                            <button
                                                onClick={() => handlePrint(order.id)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                            >
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
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Printable Receipt (Hidden) */}
            {printOrderId && (
                <div style={{ display: 'none' }}>
                    {orders.filter(order => order.id === printOrderId).map(order => (
                        <div key={order.id} ref={printRef} className="p-8 max-w-2xl mx-auto font-sans">
                            <h1 className="text-2xl font-bold mb-4">Order Receipt</h1>
                            <p className="text-sm text-gray-600 mb-2">Order #{order.id}</p>
                            <p className="text-sm text-gray-600 mb-6">
                                Date: {new Date(order.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>

                            <h2 className="text-lg font-semibold mb-2">Order Details</h2>
                            <table className="w-full mb-6 border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 text-sm">Item</th>
                                        <th className="text-right py-2 text-sm">Qty</th>
                                        <th className="text-right py-2 text-sm">Price</th>
                                        <th className="text-right py-2 text-sm">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.itemsDetails.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-2 text-sm">{item.name}</td>
                                            <td className="text-right py-2 text-sm">{item.quantity}</td>
                                            <td className="text-right py-2 text-sm">{currency}{item.price.toFixed(2)}</td>
                                            <td className="text-right py-2 text-sm">{currency}{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h2 className="text-lg font-semibold mb-2">Payment Summary</h2>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Subtotal</span>
                                    <span>{currency}{order.totals?.subtotal?.toFixed(2) || (order.total - (order.totals?.tax || 0) - (order.totals?.shipping || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Shipping</span>
                                    <span>{currency}{order.totals?.shipping?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Tax</span>
                                    <span>{currency}{order.totals?.tax?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span>{currency}{order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
                            <p className="text-sm mb-2">{order.shippingAddress}</p>
                            {order.trackingNumber && (
                                <p className="text-sm mb-2">Tracking Number: {order.trackingNumber}</p>
                            )}

                            <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
                            <p className="text-sm">{order.paymentMethod}</p>
                        </div>
                    ))}
                </div>
            )}ss

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
                        <button className="p-2 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <button className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            1
                        </button>
                        <button className="p-2 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50" disabled>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            )}

            {/* Pagination - Mobile */}
            {filteredOrders.length > 0 && (
                <div className="mt-8 flex items-center justify-between sm:hidden">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled>
                        Previous
                    </button>
                    <div className="text-sm text-gray-700">
                        Page 1 of 1
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;