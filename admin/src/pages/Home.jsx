import React, { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaFilter, FaShoppingCart, FaClock, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
// Update your ChartJS imports to include additional elements
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Add this for better area fills
} from 'chart.js'; import { Line } from 'react-chartjs-2';
import AnalyticsPanel from './AnalyticsPanel';

// Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);
const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [metrics, setMetrics] = useState({
        totalOrders: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, backendUrl } = useAdmin();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [metricsRes, ordersRes, salesRes] = await Promise.all([
                    axios.get(`${backendUrl}/api/admin/dashboard`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${backendUrl}/api/admin/orders/recent`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${backendUrl}/api/admin/sales-data`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setMetrics({
                    totalOrders: metricsRes.data.totalOrders,
                    pendingOrders: metricsRes.data.pendingOrders,
                    deliveredOrders: metricsRes.data.deliveredOrders
                });
                setRecentOrders(ordersRes.data);
                setSalesData(salesRes.data);
            } catch (error) {
                toast.error('Failed to load dashboard data');
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    // Then update your chartData and chartOptions as follows:

    const chartData = {
        labels: salesData.map(item => {
            // Format date labels better if they're dates
            if (item._id.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return new Date(item._id).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
            }
            return item._id;
        }),
        datasets: [
            {
                label: 'Total Sales (Rs)',
                data: salesData.map(item => item.totalSales),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgb(16, 185, 129)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Number of Orders',
                data: salesData.map(item => item.count),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgb(59, 130, 246)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 13
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                usePointStyle: true,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label.includes('Sales')) {
                            return `${label}: ${context.raw.toFixed(2)}`;
                        }
                        return `${label}: ${context.raw}`;
                    }
                }
            },
            title: {
                display: true,
                text: 'Sales Performance',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    bottom: 20
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#6B7280'
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#6B7280',
                    callback: function (value) {
                        if (value >= 1000) {
                            return 'Rs' + (value / 1000).toFixed(1) + 'k';
                        }
                        return 'Rs' + value;
                    }
                }
            }
        },
        elements: {
            line: {
                borderJoinStyle: 'round'
            }
        }
    };

    const filteredOrders = recentOrders.filter(
        (order) =>
            (filterStatus === 'All' || order.status === filterStatus) &&
            (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:ml-64 overflow-y-auto flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen text-sm md:text-lg bg-gray-50 p-6 lg:p-8 lg:ml-64 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage and track your orders</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/orders"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                        >
                            <FaEye size={18} />
                            View All Orders
                        </Link>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: FaShoppingCart,
                            title: 'Total Orders',
                            value: metrics.totalOrders,
                            color: 'bg-blue-100 text-blue-600',
                        },
                        {
                            icon: FaClock,
                            title: 'Pending Orders',
                            value: metrics.pendingOrders,
                            color: 'bg-red-100 text-red-600',
                        },
                        {
                            icon: FaClock,
                            title: 'Delivered Orders',
                            value: metrics.deliveredOrders,
                            color: 'bg-green-100 text-green-600',
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

                {/* Sales Chart */}
                <section id="sales-chart">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                    <FaChartLine className="text-emerald-600" size={20} />
                                    Sales Overview
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Last {salesData.length} days performance
                                </p>
                            </div>

                        </div>
                        <div className="h-80">
                            {salesData.length > 0 ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                                    <svg
                                        className="w-12 h-12 text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p>No sales data available</p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span>Total Sales: Rs{salesData.reduce((sum, item) => sum + item.totalSales, 0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span>Total Orders: {salesData.reduce((sum, item) => sum + item.count, 0)}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <AnalyticsPanel />

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
                                                    <Link
                                                        to={`/order/${order.id}`}
                                                        className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                                                        aria-label="View order details"
                                                    >
                                                        <FaEye size={18} />
                                                    </Link>
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
            </div>
        </main>
    );
};

export default Home;