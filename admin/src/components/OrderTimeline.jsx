import React from 'react';
import { FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi';
import moment from 'moment';

const statusOptions = [
    { value: 'placed', label: 'Order Placed', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

const icons = {
    placed: <FiPackage className="text-gray-500" />,
    pending: <FiPackage className="text-amber-500" />,
    processing: <FiTruck className="text-blue-500" />,
    shipped: <FiTruck className="text-purple-500" />,
    delivered: <FiCheck className="text-green-500" />,
    cancelled: <FiX className="text-red-500" />,
};

const OrderTimeline = ({ order }) => {
    const history =
        order.statusHistory && order.statusHistory.length > 0
            ? [...order.statusHistory].reverse()
            : [
                { status: order.status, timestamp: order.updatedAt },
                { status: 'placed', timestamp: order.createdAt },
            ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h2>
            <div className="space-y-4">
                {history.map((event, index, array) => {
                    const statusKey = event.status.toLowerCase();
                    const statusObj =
                        statusOptions.find((opt) => opt.value === statusKey) || {
                            value: statusKey,
                            label: statusKey.charAt(0).toUpperCase() + statusKey.slice(1),
                            color: 'bg-gray-100 text-gray-800',
                        };

                    return (
                        <div key={index} className="flex">
                            <div className="flex flex-col items-center mr-4">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                                    {icons[statusKey] || <FiPackage className="text-gray-500" />}
                                </div>
                                {index < array.length - 1 && (
                                    <div className="w-px h-full bg-gray-200 mt-1"></div>
                                )}
                            </div>
                            <div className="pb-4">
                                <div className="flex items-center">
                                    <span
                                        className={`mr-2 px-3 py-1 rounded-full text-sm font-medium ${statusObj.color}`}
                                    >
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
    );
};

export default OrderTimeline;
