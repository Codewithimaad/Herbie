import React from 'react';
import { FiTruck } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveryActions = ({ editableOrder, setEditableOrder, backendUrl, id, token, isDeliveryProcessing, setIsDeliveryProcessing, fetchOrderById }) => {
    const handleDeliveryUpdate = async (isDelivered) => {
        try {
            setIsDeliveryProcessing(true);
            console.log('Updating delivery status:', { id, isDelivered, token }); // Debug
            const response = await axios.put(
                `${backendUrl}/api/admin/delivery-status/${id} `,
                { isDelivered },
                { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token} ` } }
            );
            setEditableOrder(prev => {
                const updatedOrder = {
                    ...prev,
                    isDelivered: response.data.order?.isDelivered ?? isDelivered,
                    deliveryStatus: response.data.order?.deliveryStatus ?? (isDelivered ? 'Delivered' : 'In Transit'),
                };
                return updatedOrder;
            });
            // Refresh orderById in context
            await fetchOrderById(id);
        } catch (err) {
            console.error('Delivery update error:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Failed to update delivery status');
        } finally {
            setIsDeliveryProcessing(false);
        }
    };

    // Ensure fields are defined
    const isDelivered = editableOrder?.isDelivered ?? false;
    const deliveryStatus = editableOrder?.deliveryStatus ?? 'In Transit';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
                <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 mr-3">
                        <FiTruck className="text-blue-600 w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Delivery Information</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <span className={`text - sm font - semibold ${isDelivered ? 'text-emerald-600' : 'text-amber-600'} `}>
                            {deliveryStatus}
                        </span>
                    </div>

                    {!isDelivered ? (
                        <button
                            onClick={() => handleDeliveryUpdate(true)}
                            disabled={isDeliveryProcessing}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isDeliveryProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Mark as Delivered'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleDeliveryUpdate(false)}
                            disabled={isDeliveryProcessing}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isDeliveryProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Mark as Not Delivered'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryActions;