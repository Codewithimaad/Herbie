import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { UserGroupIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useAdmin } from '../context/AdminContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState({
        pages: [],
        activeUsers: 0,
        mostVisitedProducts: [],
        mostOrderedProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, backendUrl, frontendUrl } = useAdmin();

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${backendUrl}/api/analytics`, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            });
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError(error.response?.data?.error || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [token, backendUrl]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart',
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Views',
                    font: { size: 14, family: 'Inter, sans-serif', weight: '500' },
                    color: '#374151'
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
                ticks: {
                    font: { family: 'Inter, sans-serif', size: 12 },
                    color: '#6B7280'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Page Path',
                    font: { size: 14, family: 'Inter, sans-serif', weight: '500' },
                    color: '#374151'
                },
                ticks: {
                    font: { size: 12, family: 'Inter, sans-serif' },
                    color: '#6B7280',
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: { display: false }
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Top Viewed Pages (Last 30 Days)',
                font: { size: 18, weight: '600', family: 'Inter, sans-serif' },
                padding: { top: 16, bottom: 24 },
                color: '#111827'
            },
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleFont: { size: 14, family: 'Inter, sans-serif', weight: '500' },
                bodyFont: { size: 12, family: 'Inter, sans-serif' },
                padding: 12,
                cornerRadius: 8,
                boxPadding: 6
            },
        },
    };

    const chartData = {
        labels: analytics.pages.map(page => {
            const url = new URL(page.page, window.location.origin);
            return url.pathname.length > 20
                ? `${url.pathname.substring(0, 20)}...`
                : url.pathname;
        }),
        datasets: [
            {
                label: 'Page Views',
                data: analytics.pages.map(page => page.views),
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 0,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
                hoverBorderColor: 'rgba(99, 102, 241, 1)',
            },
        ],
    };

    if (loading) {
        return (
            <div className="min-h-screen py-12 px-0 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <Skeleton height={48} width={300} className="mb-8 mx-auto rounded-lg" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton height={120} className="rounded-xl shadow-sm" />
                        <Skeleton height={120} className="rounded-xl shadow-sm" />
                    </div>
                    <Skeleton height={400} className="rounded-xl shadow-sm" />
                    <Skeleton height={400} className="rounded-xl shadow-sm" />
                    <Skeleton height={400} className="rounded-xl shadow-sm" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen  flex items-center justify-center py-12 px-0 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">Error Loading Analytics</h3>
                    <p className="mt-2 text-sm text-gray-600">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={fetchAnalytics}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-0 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">Insights from the last 30 days</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-shadow hover:shadow-2xl">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                                    <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-600 truncate">Visited Users</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {analytics.activeUsers.toLocaleString()}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Visited Products Table */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-shadow hover:shadow-2xl">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Top 10 Visited Products</h3>
                        <p className="mt-1 text-sm text-gray-600">Most visited active products by views</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Views
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.mostVisitedProducts.length > 0 && !analytics.mostVisitedProducts[0].message ? (
                                    analytics.mostVisitedProducts.slice(0, 10).map((product, index) => (
                                        <tr key={product.productId} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {product.views.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    to={`${frontendUrl}/product/${product.productId}`}
                                                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center font-medium transition-colors duration-200"
                                                >
                                                    View Product
                                                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-sm text-gray-600 text-center">
                                            No active product views found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Ordered Products Table */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-shadow hover:shadow-2xl">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Top 10 Ordered Products</h3>
                        <p className="mt-1 text-sm text-gray-600">Most ordered active products by quantity</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Ordered
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.mostOrderedProducts?.length > 0 && !analytics.mostOrderedProducts[0].message ? (
                                    analytics.mostOrderedProducts.slice(0, 10).map((product, index) => (
                                        <tr key={product.productId} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {product.totalQuantity.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    to={`${frontendUrl}/product/${product.productId}`}
                                                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center font-medium transition-colors duration-200"
                                                >
                                                    View Product
                                                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-sm text-gray-600 text-center">
                                            No products ordered in the last 30 days
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Page Performance Chart */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-shadow hover:shadow-2xl">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Page Performance</h3>
                        <p className="mt-1 text-sm text-gray-600">Top performing pages by views</p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="h-80">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Top Pages Table */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-shadow hover:shadow-2xl">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
                        <p className="mt-1 text-sm text-gray-600">Detailed view statistics</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Page
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Views
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.pages.length > 0 ? (
                                    analytics.pages.map((page, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                                                {page.page}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {page.views.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-sm text-gray-600 text-center">
                                            No page view data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;