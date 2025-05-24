import React, { useState } from 'react';
import { FaPlus, FaEye, FaSearch, FaFilter, FaBox, FaShoppingCart, FaDollarSign, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MainContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
        setIsModalOpen(false);
    };

    // Mock data (replace with API calls)
    const metrics = {
        totalProducts: 150,
        totalOrders: 320,
        totalRevenue: 12560.75,
        pendingOrders: 45,
    };

    const recentOrders = [
        {
            id: '#12345',
            customer: 'John Doe',
            date: 'May 24, 2025',
            total: 45.97,
            status: 'Delivered',
        },
        {
            id: '#12346',
            customer: 'Jane Smith',
            date: 'May 23, 2025',
            total: 29.99,
            status: 'Pending',
        },
    ];

    const filteredOrders = recentOrders.filter(
        (order) =>
            (filterStatus === 'All' || order.status === filterStatus) &&
            (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    return (
        <main className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:ml-64 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-gray-600 mt-2">Your business at a glance</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/products"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                        >
                            <FaEye size={18} />
                            View All Products
                        </Link>
                        <button
                            onClick={toggleModal}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:scale-105 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <FaPlus size={18} />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: FaBox,
                            title: 'Total Products',
                            value: metrics.totalProducts,
                            color: 'bg-emerald-100 text-emerald-600',
                        },
                        {
                            icon: FaShoppingCart,
                            title: 'Total Orders',
                            value: metrics.totalOrders,
                            color: 'bg-blue-100 text-blue-600',
                        },
                        {
                            icon: FaDollarSign,
                            title: 'Total Revenue',
                            value: `Rs ${metrics.totalRevenue.toFixed(2)}`,
                            color: 'bg-yellow-100 text-yellow-600',
                        },
                        {
                            icon: FaClock,
                            title: 'Pending Orders',
                            value: metrics.pendingOrders,
                            color: 'bg-red-100 text-red-600',
                        },
                    ].map((metric, index) => (
                        <div
                            key={metric.title}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:scale-105 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${metric.color}`}>
                                    <metric.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Trend</h2>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Chart placeholder (e.g., Sales over time)</p>
                    </div>
                </div>

                {/* Recent Orders */}
                <section id="orders">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                            <FaEye className="text-emerald-600" size={20} />
                            Recent Orders
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-64 px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 placeholder-gray-400"
                                />
                            </div>
                            <div className="relative">
                                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full sm:w-40 px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 appearance-none"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-all duration-200">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">Rs {order.total.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${order.status === 'Delivered'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                                                        aria-label="View order details"
                                                    >
                                                        <FaEye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                                                No orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Add Product Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-in">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h3>
                            <form onSubmit={handleFormSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rs</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                            placeholder="0.00"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                        placeholder="Enter stock quantity"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                        placeholder="Enter image URL"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400 resize-none"
                                        placeholder="Enter product description"
                                        rows="4"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={toggleModal}
                                        className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 hover:scale-105 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default MainContent;