import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { UserGroupIcon, ArrowTopRightOnSquareIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useAdmin } from '../context/AdminContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState({
        pages: [],
        activeUsers: 0,
        mostVisitedProducts: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, backendUrl } = useAdmin();

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${backendUrl}/api/analytics`, {
                headers: {
                    Authorization: `Bearer ${token}`
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
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Views',
                    font: {
                        size: 14,
                        family: 'Inter, sans-serif'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Page Path',
                    font: {
                        size: 14,
                        family: 'Inter, sans-serif'
                    }
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif'
                    }
                },
                grid: {
                    display: false
                }
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Top Viewed Pages (Last 30 Days)',
                font: {
                    size: 16,
                    weight: '600',
                    family: 'Inter, sans-serif'
                },
                padding: { top: 10, bottom: 20 },
                color: '#111827'
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleFont: {
                    size: 14,
                    family: 'Inter, sans-serif'
                },
                bodyFont: {
                    size: 12,
                    family: 'Inter, sans-serif'
                },
                padding: 12,
                cornerRadius: 8
            },
        },
    };

    const chartData = {
        labels: analytics.pages.map(page => {
            // Shorten long URLs for better display
            const url = new URL(page.page, window.location.origin);
            return url.pathname.length > 30
                ? `${url.pathname.substring(0, 30)}...`
                : url.pathname;
        }),
        datasets: [
            {
                label: 'Page Views',
                data: analytics.pages.map(page => page.views),
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 0,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(79, 70, 229, 0.9)'
            },
        ],
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <Skeleton height={48} width={300} className="mb-8 mx-auto" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton height={120} className="rounded-xl" />
                        <Skeleton height={120} className="rounded-xl" />
                    </div>

                    <Skeleton height={400} className="rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">Error loading analytics</h3>
                    <p className="mt-2 text-sm text-gray-500">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={fetchAnalytics}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-500">Insights from the last 30 days</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Users Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                    <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Visited Users</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {analytics.activeUsers.toLocaleString()}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Most Viewed Product Card */}
                    {analytics.mostVisitedProducts?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {analytics.mostVisitedProducts.map((product, index) => (
                                <a
                                    key={product.productId}
                                    href={`/product/${product.productId}`}
                                    className="block bg-white hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden"
                                >
                                    <div className="px-4 py-5 sm:p-6 flex items-center">
                                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                            <ChartBarIcon className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                #{index + 1} Most Visited
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900 truncate">
                                                {product.name}
                                            </dd>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {product.views.toLocaleString()} views
                                                <ArrowTopRightOnSquareIcon className="inline-block h-4 w-4 ml-1 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                </div>

                {/* Top Pages Chart */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Page Performance</h3>
                        <p className="mt-1 text-sm text-gray-500">Top performing pages by views</p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="h-80">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Top Pages Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Top Pages</h3>
                        <p className="mt-1 text-sm text-gray-500">Detailed view statistics</p>
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
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                                                {page.page}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {page.views.toLocaleString()}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
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