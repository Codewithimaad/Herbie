import React, { useState } from 'react';
import {
    FiBox,
    FiShoppingCart,
    FiChevronDown,
    FiChevronUp,
    FiX
} from 'react-icons/fi';
import { RiPlantLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);

    return (
        <>
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-gray-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 lg:fixed lg:inset-y-0 lg:h-screen
 border-r border-gray-200 flex flex-col`}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <RiPlantLine className="text-2xl text-emerald-600" />
                        <h1 className="text-xl font-bold text-gray-800">Herbie Dashboard</h1>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <div className="space-y-1">
                        <span className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Management
                        </span>

                        {/* Products Dropdown */}
                        <button
                            onClick={() => setIsProductsOpen(!isProductsOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <FiBox className="flex-shrink-0" />
                                <span>Products</span>
                            </div>
                            {isProductsOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {isProductsOpen && (
                            <div className="ml-10 mt-1 space-y-1">
                                <Link
                                    to="/products"
                                    className="block text-sm text-gray-600 hover:text-emerald-600"
                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                >
                                    All Products
                                </Link>
                                <Link
                                    to="/add-product"
                                    className="block text-sm text-gray-600 hover:text-emerald-600"
                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                >
                                    Add Product
                                </Link>
                            </div>
                        )}

                        {/* Orders Dropdown */}
                        <button
                            onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <FiShoppingCart className="flex-shrink-0" />
                                <span>Orders</span>
                            </div>
                            {isOrdersOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {isOrdersOpen && (
                            <div className="ml-10 mt-1 space-y-1">
                                <Link
                                    to="/orders"
                                    className="block text-sm text-gray-600 hover:text-emerald-600"
                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                >
                                    All Orders
                                </Link>
                                <Link
                                    to="/orders/pending"
                                    className="block text-sm text-gray-600 hover:text-emerald-600"
                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                >
                                    Pending Orders
                                </Link>
                                <Link
                                    to="/orders/completed"
                                    className="block text-sm text-gray-600 hover:text-emerald-600"
                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                >
                                    Completed Orders
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-emerald-700">AD</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">Admin User</p>
                            <p className="text-xs text-gray-500">admin@herbie.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
