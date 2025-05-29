import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiPrinter, FiX, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
            }`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <FiX size={20} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrdersPage = () => {
    const { orders, loadingOrders, ordersError, deleteOrder, currency } = useAdmin();

    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const ordersPerPage = 15;

    // Filter orders based on status and search query
    const filteredOrders = (orders || []).filter((order) => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const search = searchQuery.toLowerCase();
        const orderId = (order._id || '').toLowerCase();
        const customerName = order.shippingAddress?.name?.toLowerCase() || '';
        const matchesSearch = orderId.includes(search) || customerName.includes(search);

        return matchesStatus && matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

    // Pagination functions
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    // Handle delete order
    const handleDeleteOrder = async (id) => {
        setOrderToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;

        const result = await deleteOrder(orderToDelete);
        if (result.success) {
            setDeleteSuccess('Order deleted successfully.');
            setTimeout(() => setDeleteSuccess(null), 5000);
        } else {
            setDeleteError(result.error || 'Unable to delete the order. Please try again or contact support.');
            setTimeout(() => setDeleteError(null), 5000);
        }

        setShowDeleteModal(false);
        setOrderToDelete(null);
    };

    // Reset page when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, searchQuery]);

    // Status badge helper
    const getStatusBadge = (status) => {
        const statusClasses = {
            delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
            pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
            processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
            cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
            placed: 'bg-white text-gray-700 ring-gray-600/20',
            shipped: 'bg-purple-100 text-gray-700 ring-purple-600/20',


        };
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusClasses[status] || 'bg-gray-50 text-gray-700 ring-gray-600/20'
                    }`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Date formatting helper
    const formatDate = (order) => {
        const dateValue = order.createdAt?.$date?.$numberLong || order.createdAt || null;
        if (!dateValue) return 'N/A';

        const timestamp = Number(dateValue);
        if (!isNaN(timestamp)) {
            return new Date(timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        const dateObj = new Date(dateValue);
        if (!isNaN(dateObj)) {
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        return 'N/A';
    };

    // Amount formatting helper
    const getAmount = (order) => {
        const val = order.totals?.grandTotal?.$numberDouble || order.totals?.grandTotal || null;
        if (!val) return '0.00';
        const num = parseFloat(val);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    if (loadingOrders) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px]">
                <div className="animate-pulse text-gray-500">Loading orders...</div>
            </div>
        );
    }

    if (ordersError) {
        return (
            <div className="p-6 bg-red-50 rounded-xl border border-red-100 text-red-600 max-w-4xl mx-auto">
                Error: {ordersError}
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
                <div className="text-lg mb-2">No orders available</div>
                <div className="text-sm">Create your first order to get started</div>
            </div>
        );
    }

    return (
        <div className="min-h-scree p-4 md:p-6 lg:ml-72">
            <div className="max-w-7xl mx-auto space-y-6 rounded-md shadow-2xl">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className='p-6'>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
                        <p className="text-gray-500 mt-1">Track and manage customer orders</p>
                    </div>
                </div>

                {/* Alert Messages */}
                {deleteError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <FiX className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                            <div>
                                <p className="font-medium text-red-800">Error</p>
                                <p className="text-sm text-red-700">{deleteError}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDeleteError(null)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                            aria-label="Dismiss error"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                )}
                {deleteSuccess && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                            <div>
                                <p className="font-medium text-green-800">Success</p>
                                <p className="text-sm text-green-700">{deleteSuccess}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDeleteSuccess(null)}
                            className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100"
                            aria-label="Dismiss success"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1 max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                                placeholder="Search by order ID or customer name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <select
                                    className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm focus:outline-none transition-all"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="placed">Placed</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <FiFilter className="text-gray-400" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentOrders.length > 0 ? (
                                    currentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.shippingAddress?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                {currency} {getAmount(order)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <Link
                                                    to={`/order/${order._id}`}
                                                    className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    className="text-red-600 hover:text-red-800 font-medium hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-8 text-center"
                                        >
                                            <div className="text-gray-500 flex flex-col items-center justify-center">
                                                <FiSearch className="mb-2 text-gray-400" size={24} />
                                                <p className="font-medium">No orders found</p>
                                                <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(startIndex + ordersPerPage, filteredOrders.length)}</span> of{' '}
                            <span className="font-medium">{filteredOrders.length}</span> results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <FiChevronLeft size={18} />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`w-10 h-10 rounded-md ${currentPage === pageNum
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <FiChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Confirm Order Deletion"
                    message="This will permanently delete the order and all associated data. This action cannot be undone."
                />
            </div>
        </div>
    );
};

export default OrdersPage;