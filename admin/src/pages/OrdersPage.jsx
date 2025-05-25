import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiPrinter, FiX, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
            }`}>
            {/* Backdrop with transition */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal content with transition */}
            <div
                className={`bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                        Delete
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

        // Check if search query matches order id or customer name
        const matchesSearch = orderId.includes(search) || customerName.includes(search);

        return matchesStatus && matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

    // Functions to handle pagination
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

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
            completed: 'bg-emerald-100 text-emerald-800',
            pending: 'bg-amber-100 text-amber-800',
            processing: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return (
            <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'
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
            return new Date(timestamp).toLocaleDateString();
        }

        const dateObj = new Date(dateValue);
        if (!isNaN(dateObj)) {
            return dateObj.toLocaleDateString();
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
        return <div className="p-4 text-center text-gray-600">Loading orders...</div>;
    }

    if (ordersError) {
        return <div className="p-4 text-center text-red-600">Error: {ordersError}</div>;
    }

    if (!orders.length) {
        return <div className="p-4 text-center text-gray-600">No orders available.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen md:p-6 lg:ml-72">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                        <p className="text-gray-600 mt-1">Manage and track customer orders</p>
                    </div>
                </div>

                {/* Alert Messages */}
                {deleteError && (
                    <div
                        className="mb-6 flex items-center justify-between p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <FiX className="text-red-500 mr-3" size={20} />
                            <div>
                                <p className="font-medium text-red-800">Error</p>
                                <p className="text-sm text-red-700">{deleteError}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDeleteError(null)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Dismiss error"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                )}
                {deleteSuccess && (
                    <div
                        className="mb-6 flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <FiCheckCircle className="text-green-500 mr-3" size={20} />
                            <div>
                                <p className="font-medium text-green-800">Success</p>
                                <p className="text-sm text-green-700">{deleteSuccess}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDeleteSuccess(null)}
                            className="text-green-500 hover:text-green-700"
                            aria-label="Dismiss success"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Search orders or customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <select
                                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <FiFilter className="text-gray-400" />
                                </div>
                            </div>
                            <button
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                title="Download"
                            >
                                <FiDownload className="text-gray-600" />
                            </button>
                            <button
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                title="Print"
                            >
                                <FiPrinter className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentOrders.length > 0 ? (
                                    currentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.shippingAddress?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(order.status)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.items?.map((item) => (
                                                    <div key={item._id || item.name} className="mb-1">
                                                        {item.name} x {item.quantity}
                                                    </div>
                                                )) || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                {currency} {getAmount(order)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    to={`/order/${order._id}`}
                                                    className="text-emerald-600 hover:text-emerald-900 mr-3"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No orders found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border ${currentPage === 1
                                ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'text-gray-700 border-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            Previous
                        </button>

                        <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`px-3 py-1 rounded border ${currentPage === totalPages || totalPages === 0
                                ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'text-gray-700 border-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Order"
                    message="Are you sure you want to delete this order? This action cannot be undone."
                />
            </div>
        </div>
    );
};

export default OrdersPage;