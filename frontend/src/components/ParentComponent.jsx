import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import ReceiptPrintComponent from './ReceiptPrintComponent';

const ParentComponent = ({ orders, currency, statusStyles }) => {
    const [printOrderId, setPrintOrderId] = useState(null);
    const printRef = useRef();

    const printHandler = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Receipt_${printOrderId}_${new Date().toISOString().split('T')[0]}`,
        onAfterPrint: () => setPrintOrderId(null),
    });

    const handlePrint = (orderId) => {
        setPrintOrderId(orderId);
        setTimeout(() => {
            printHandler();
        }, 200);
    };

    const orderToPrint = orders.find(order => order.id === printOrderId);

    return (
        <div>
            {/* Hidden print component */}
            <div style={{ display: 'none' }}>
                <ReceiptPrintComponent
                    ref={printRef}
                    order={orderToPrint}
                    currency={currency}
                    statusStyles={statusStyles}
                />
            </div>

            {/* Your order list with print buttons */}
            {orders.map(order => (
                <div key={order.id}>
                    {/* Order details */}
                    <button
                        onClick={() => handlePrint(order.id)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                        Print receipt
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ParentComponent;