import React, { useState, useEffect } from 'react';
import {
    FiPrinter,
    FiArrowLeft,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCreditCard,
    FiEdit,
    FiCheck,
    FiX,
    FiTruck,
    FiPackage,
    FiDollarSign,
} from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { toast } from 'react-toastify';
import DeliveryActions from '../components/DeliveryActions';

const OrderViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { orderById, token, loadingOrderById, currency, orderByIdError, fetchOrderById, backendUrl } = useAdmin();

    const [editableOrder, setEditableOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeliveryProcessing, setIsDeliveryProcessing] = useState(false);

    const statusOptions = [
        { value: 'placed', label: 'Placed', color: 'bg-pink-100 text-pink-800' },
        { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
        { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
        { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    ];

    // Fetch order when component mounts or ID changes
    useEffect(() => {
        let isMounted = true;

        const fetchOrder = async () => {
            try {
                if (id && (!orderById || orderById?.id !== id)) {
                    console.log('Fetching order for ID:', id); // Debug
                    await fetchOrderById(id);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching order:', err.message); // Debug
                    setError('Failed to load order');
                }
            }
        };

        fetchOrder();

        return () => {
            isMounted = false;
        };
    }, [id, fetchOrderById]);

    // Sync editableOrder with orderById when it changes
    useEffect(() => {
        if (orderById) {
            console.log('Syncing editableOrder with orderById:', orderById); // Debug
            setEditableOrder(prev => ({
                ...prev,
                ...orderById,
                isDelivered: orderById.isDelivered ?? prev?.isDelivered ?? false,
                deliveryStatus: orderById.deliveryStatus ?? prev?.deliveryStatus ?? 'In Transit',
            }));
            setNewStatus(orderById.status);
        }
    }, [orderById]);

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const updateOrderStatus = async () => {
        try {
            setIsProcessing(true);
            const updateData = {
                status: newStatus,
            };

            if (newStatus === 'shipped') {
                updateData.trackingNumber = editableOrder.trackingNumber;
            }
            const response = await axios.put(`${backendUrl}/api/admin/${id}`, updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditableOrder(response.data);
            await fetchOrderById(id); // Refresh orderById
            setShowStatusModal(false);
            setError(null);
        } catch (err) {
            console.error('Error updating status:', err.response?.data || err.message); // Debug
            setError(err.response?.data?.message || 'Failed to update status');
            toast.error('Failed to update status');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFieldChange = (field, value) => {
        setEditableOrder((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddressChange = (field, value) => {
        setEditableOrder((prev) => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                [field]: value,
            },
        }));
    };

    const saveChanges = async () => {
        try {
            setIsProcessing(true);
            const response = await axios.put(
                `${backendUrl}/api/admin/${id}`,
                {
                    shippingAddress: editableOrder.shippingAddress,
                    adminNotes: editableOrder.adminNotes,
                    trackingNumber: editableOrder.trackingNumber,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditableOrder(response.data);
            await fetchOrderById(id); // Refresh orderById
            setIsEditing(false);
            setError(null);
        } catch (err) {
            console.error('Error saving changes:', err.response?.data || err.message); // Debug
            setError(err.response?.data?.message || 'Failed to save changes');
            toast.error('Failed to save changes');
        } finally {
            setIsProcessing(false);
        }
    };

    const cancelOrder = async () => {
        try {
            setIsProcessing(true);
            console.log('Cancelling order:', id); // Debug
            await axios.delete(`${backendUrl}/api/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/orders');
        } catch (err) {
            console.error('Error cancelling order:', err.response?.data || err.message); // Debug
            setError(err.response?.data?.message || 'Failed to cancel order');
            toast.error('Failed to cancel order');
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusObj = statusOptions.find((opt) => opt.value === status);
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusObj?.color || 'bg-gray-100 text-gray-800'}`}>
                {statusObj?.label || status}
            </span>
        );
    };

    const getPaymentMethod = (method) => {
        const methodNames = {
            cod: 'Cash on Delivery',
        };
        return methodNames[method] || method.toUpperCase();
    };

    if (loadingOrderById) {
        return <div className="p-6 text-gray-600">Loading...</div>;
    }

    if (orderByIdError || error) {
        return <div className="p-6 text-red-600">{orderByIdError || error}</div>;
    }

    if (!editableOrder) {
        return <div className="p-6 text-gray-600">No order data available.</div>;
    }

    return (
        <div className="bg-gray-50 text-sm md:text-base min-h-screen p-3 md:p-6 lg:ml-72">
            {/* Order Status Modification Dialog */}
            <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${showStatusModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-300 ${showStatusModal ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setShowStatusModal(false)}
                />
                <div
                    className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${showStatusModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                >
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
                        <select
                            value={newStatus}
                            onChange={handleStatusChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateOrderStatus}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-70"
                            >
                                Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Link to="/orders" className="flex items-center text-gray-600 hover:text-emerald-600">
                        <FiArrowLeft className="mr-2" />
                        Back to Orders
                    </Link>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Change Status
                        </button>
                    </div>
                </div>

                {/* Order Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg md:text-2xl font-bold text-gray-800">Order {editableOrder.id}</h1>
                            <p className="text-sm md:text-base text-gray-600">
                                Placed on {moment(editableOrder.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                {editableOrder.updatedAt !== editableOrder.createdAt && (
                                    <span>
                                        {' '}
                                        • Last updated: {moment(editableOrder.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                            {getStatusBadge(editableOrder.status)}
                            {editableOrder.trackingNumber && editableOrder.status === 'shipped' && (
                                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    Tracking: {editableOrder.trackingNumber}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Order Details
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'actions' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('actions')}
                    >
                        Actions
                    </button>
                </div>

                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Customer and Shipping */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Customer Information</h2>
                                    {isEditing ? (
                                        <div className="flex space-x-2">
                                            <button onClick={saveChanges} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                                                <FiCheck size={18} />
                                            </button>
                                            <button onClick={() => setIsEditing(false)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                <FiX size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                                            <FiEdit size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editableOrder.shippingAddress.name}
                                                onChange={(e) => handleAddressChange('name', e.target.value)}
                                                className="mt-1 p-1 border border-gray-300 rounded w-full"
                                            />
                                        ) : (
                                            <p className="mt-1 text-gray-900">{editableOrder.shippingAddress.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                                        <div className="mt-1 flex items-center text-gray-900">
                                            <FiMail className="mr-2 text-gray-400" />
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={editableOrder.shippingAddress.email}
                                                    onChange={(e) => handleAddressChange('email', e.target.value)}
                                                    className="p-1 border border-gray-300 rounded w-full"
                                                />
                                            ) : (
                                                editableOrder.shippingAddress.email
                                            )}
                                        </div>
                                        <div className="mt-1 flex items-center text-gray-900">
                                            <FiPhone className="mr-2 text-gray-400" />
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={editableOrder.shippingAddress.phone}
                                                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                                                    className="p-1 border border-gray-300 rounded w-full"
                                                />
                                            ) : (
                                                editableOrder.shippingAddress.phone
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Shipping Information</h2>
                                    {isEditing && <div className="text-sm text-gray-500">Editing Mode</div>}
                                </div>
                                <div className="flex">
                                    <FiMapPin className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
                                    <div className="w-full">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editableOrder.shippingAddress.address}
                                                    onChange={(e) => handleAddressChange('address', e.target.value)}
                                                    className="mb-2 p-1 border border-gray-300 rounded w-full"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editableOrder.shippingAddress.city}
                                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                                        className="p-1 border border-gray-300 rounded"
                                                        placeholder="City"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editableOrder.shippingAddress.zip}
                                                        onChange={(e) => handleAddressChange('zip', e.target.value)}
                                                        className="p-1 border border-gray-300 rounded"
                                                        placeholder="ZIP Code"
                                                    />
                                                </div>
                                                <select
                                                    value={editableOrder.shippingAddress.country}
                                                    onChange={(e) => handleAddressChange('country', e.target.value)}
                                                    className="mt-2 p-1 border border-gray-300 rounded w-full"
                                                >
                                                    <option value="Pakistan">Pakistan</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-gray-900 font-medium">{editableOrder.shippingAddress.name}</p>
                                                <p className="text-gray-900">{editableOrder.shippingAddress.address}</p>
                                                <p className="text-gray-900">
                                                    {editableOrder.shippingAddress.city}, {editableOrder.shippingAddress.country} {editableOrder.shippingAddress.zip}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Product
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Qty
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {editableOrder.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-3" />
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                                    <div className="text-sm text-gray-500">SKU: {item.productId}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {currency}
                                                            {item.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                            {currency}
                                                            {(item.price * item.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Payment and Summary */}
                        <div className="space-y-6">
                            {/* Payment Information */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
                                <div className="flex items-center">
                                    <FiCreditCard className="mr-3 text-gray-400" />
                                    <div>
                                        <p className="text-gray-900 font-medium">{getPaymentMethod(editableOrder.paymentMethod)}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {editableOrder.paymentMethod === 'cod'
                                                ? 'Payment will be collected upon delivery'
                                                : 'Paid on ' + moment(editableOrder.createdAt).format('MMMM Do YYYY')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">
                                            {currency}
                                            {editableOrder.totals.subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-gray-900">
                                            {currency}
                                            {editableOrder.totals.shipping.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900">
                                            {currency}
                                            {editableOrder.totals.tax.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                                        <span className="font-medium text-gray-900">Grand Total</span>
                                        <span className="font-bold text-emerald-600">
                                            {currency}
                                            {editableOrder.totals.grandTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Timeline */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h2>
                                <div className="space-y-4">
                                    {(editableOrder.statusHistory && editableOrder.statusHistory.length > 0
                                        ? [...editableOrder.statusHistory].reverse()
                                        : [
                                            { status: editableOrder.status, timestamp: editableOrder.updatedAt },
                                            { status: 'placed', timestamp: editableOrder.createdAt },
                                        ]
                                    ).map((event, index, array) => {
                                        const statusObj =
                                            statusOptions.find((opt) => opt.value === event.status) || {
                                                value: event.status,
                                                label: event.status.charAt(0).toUpperCase() + event.status.slice(1),
                                                color: 'bg-gray-100 text-gray-800',
                                            };
                                        const icons = {
                                            pending: <FiPackage className="text-amber-500" />,
                                            processing: <FiTruck className="text-blue-500" />,
                                            shipped: <FiTruck className="text-purple-500" />,
                                            delivered: <FiCheck className="text-green-500" />,
                                            cancelled: <FiX className="text-red-500" />,
                                            placed: <FiPackage className="text-gray-500" />,
                                        };
                                        return (
                                            <div key={index} className="flex">
                                                <div className="flex flex-col items-center mr-4">
                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                                                        {icons[event.status] || <FiPackage className="text-gray-500" />}
                                                    </div>
                                                    {index < array.length - 1 && <div className="w-px h-full bg-gray-200 mt-1"></div>}
                                                </div>
                                                <div className="pb-4">
                                                    <div className="flex items-center">
                                                        <span className={`mr-2 px-3 py-1 rounded-full text-sm font-medium ${statusObj.color}`}>
                                                            {statusObj.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {moment(event.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Status Management */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <FiPackage className="text-blue-500 mr-2" />
                                    <h3 className="font-medium">Order Status</h3>
                                </div>
                                <div className="mb-4">{getStatusBadge(editableOrder.status)}</div>
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Change Status
                                </button>
                            </div>

                            {/* Payment Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-lg bg-emerald-50 mr-3">
                                            <FiDollarSign className="text-emerald-600 w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-gray-800">Payment Information</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-500">Method</span>
                                            <span className="text-sm font-semibold text-gray-700">{getPaymentMethod(editableOrder.paymentMethod)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-500">Status</span>
                                            <span className={`text-sm font-semibold ${editableOrder.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {editableOrder.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                        {!editableOrder.isPaid ? (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        setIsProcessing(true);
                                                        console.log('Marking as paid:', id); // Debug
                                                        const response = await axios.put(
                                                            `${backendUrl}/api/admin/payment/${id}`,
                                                            { isPaid: true },
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        );
                                                        setEditableOrder(prev => ({
                                                            ...prev,
                                                            isPaid: true,
                                                            paymentDetails: {
                                                                ...prev.paymentDetails,
                                                                paidAt: new Date(),
                                                            },
                                                        }));
                                                        await fetchOrderById(id); // Refresh orderById
                                                        setError(null);
                                                        toast.success(response.data.message || 'Payment marked as paid');
                                                    } catch (err) {
                                                        console.error('Error updating payment:', err.response?.data || err.message); // Debug
                                                        setError(err.response?.data?.message || 'Failed to update payment status');
                                                        toast.error('Payment update failed');
                                                    } finally {
                                                        setIsProcessing(false);
                                                    }
                                                }}
                                                disabled={isProcessing}
                                                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Mark as Paid'
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        setIsProcessing(true);
                                                        console.log('Marking as unpaid:', id); // Debug
                                                        const response = await axios.put(
                                                            `${backendUrl}/api/admin/payment/${id}`,
                                                            { isPaid: false },
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        );
                                                        setEditableOrder(prev => ({
                                                            ...prev,
                                                            isPaid: false,
                                                            paymentDetails: {
                                                                ...prev.paymentDetails,
                                                                unpaidAt: new Date(),
                                                            },
                                                        }));
                                                        await fetchOrderById(id); // Refresh orderById
                                                        setError(null);
                                                        toast.success(response.data.message || 'Payment marked as unpaid');
                                                    } catch (err) {
                                                        console.error('Error updating payment:', err.response?.data || err.message); // Debug
                                                        setError(err.response?.data?.message || 'Failed to update payment status');
                                                        toast.error('Payment update failed');
                                                    } finally {
                                                        setIsProcessing(false);
                                                    }
                                                }}
                                                disabled={isProcessing}
                                                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Mark as Unpaid'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Actions */}
                            <DeliveryActions
                                editableOrder={editableOrder}
                                setEditableOrder={setEditableOrder}
                                backendUrl={backendUrl}
                                id={id}
                                token={token}
                                isDeliveryProcessing={isDeliveryProcessing}
                                setIsDeliveryProcessing={setIsDeliveryProcessing}
                                fetchOrderById={fetchOrderById}
                            />

                            {/* Order Management */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <FiEdit className="text-amber-500 mr-2" />
                                    <h3 className="font-medium">Order Management</h3>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                                    >
                                        {isEditing ? 'Cancel Editing' : 'Edit Order Details'}
                                    </button>
                                    <button
                                        onClick={cancelOrder}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderViewPage;