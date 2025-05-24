import React, { useState } from 'react';
import {
    FiBox,
    FiShoppingCart,
    FiChevronRight,
    FiX,
    FiSettings,
    FiUsers,
    FiBarChart2,
    FiHelpCircle
} from 'react-icons/fi';
import { RiPlantLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [openMenus, setOpenMenus] = useState({
        products: false,
        orders: false,
        analytics: false
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    return (
        <>
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-xl flex flex-col`}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-lg group-hover:rotate-12 transition-transform">
                            <RiPlantLine className="text-2xl text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Herbie<span className="text-emerald-600">HQ</span></h1>
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Dashboard
                        </span>

                        <Link
                            to="/"
                            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200 group"
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        >
                            <div className="p-2 mr-3 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                <FiBarChart2 className="text-gray-500 group-hover:text-emerald-600" />
                            </div>
                            <span>Overview</span>
                        </Link>

                        <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider mt-4 block">
                            Management
                        </span>

                        {/* Products Dropdown */}
                        <div className="space-y-1">
                            <button
                                onClick={() => toggleMenu('products')}
                                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200 group"
                            >
                                <div className="flex items-center">
                                    <div className="p-2 mr-3 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                        <FiBox className="text-gray-500 group-hover:text-emerald-600" />
                                    </div>
                                    <span>Products</span>
                                </div>
                                <FiChevronRight className={`transition-transform duration-200 ${openMenus.products ? 'rotate-90' : ''}`} />
                            </button>

                            {openMenus.products && (
                                <div className="ml-14 mt-1 space-y-2">
                                    <Link
                                        to="/products"
                                        className="block px-4 py-2 text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        All Products
                                    </Link>
                                    <Link
                                        to="/add-product"
                                        className="block px-4 py-2 text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        Add New Product
                                    </Link>
                                    <Link
                                        to="/categories"
                                        className="block px-4 py-2 text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        Categories
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Orders Dropdown */}
                        <div className="space-y-1">
                            <button
                                onClick={() => toggleMenu('orders')}
                                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200 group"
                            >
                                <div className="flex items-center">
                                    <div className="p-2 mr-3 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                        <FiShoppingCart className="text-gray-500 group-hover:text-emerald-600" />
                                    </div>
                                    <span>Orders</span>
                                </div>
                                <FiChevronRight className={`transition-transform duration-200 ${openMenus.orders ? 'rotate-90' : ''}`} />
                            </button>

                            {openMenus.orders && (
                                <div className="ml-14 mt-1 space-y-2">
                                    <Link
                                        to="/orders"
                                        className="block px-4 py-2 text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        All Orders
                                    </Link>
                                    <Link
                                        to="/orders/pending"
                                        className="block px-4 py-2 text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        Pending
                                    </Link>
                                    <Link
                                        to="/orders/completed"
                                        className="block px-4 py-2 text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        Completed
                                    </Link>
                                    <Link
                                        to="/orders/returns"
                                        className="block px-4 py-2 text-sm text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        Returns
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Customers */}
                        <Link
                            to="/customers"
                            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200 group"
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        >
                            <div className="p-2 mr-3 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                <FiUsers className="text-gray-500 group-hover:text-emerald-600" />
                            </div>
                            <span>Customers</span>
                        </Link>
                    </div>

                    <div className="mt-8 space-y-1">
                        <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Support
                        </span>

                        <Link
                            to="/settings"
                            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200 group"
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        >
                            <div className="p-2 mr-3 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                <FiSettings className="text-gray-500 group-hover:text-emerald-600" />
                            </div>
                            <span>Settings</span>
                        </Link>

                        <Link
                            to="/help"
                            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200 group"
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        >
                            <div className="p-2 mr-3 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                <FiHelpCircle className="text-gray-500 group-hover:text-emerald-600" />
                            </div>
                            <span>Help Center</span>
                        </Link>
                    </div>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-emerald-800">AD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@herbie.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;