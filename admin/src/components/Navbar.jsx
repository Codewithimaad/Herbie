
import React, { useState } from 'react';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className={`p - 2 text - gray - 600 hover: text - emerald - 600 md:hidden rounded - full hover: bg - emerald - 50 transition - all duration - 300 ${isSidebarOpen ? 'text-emerald-600 bg-emerald-50' : ''
                                } `}
                            aria-label="Toggle sidebar"
                        >
                            <FaBars className="h-6 w-6 transform hover:scale-110 transition-transform" />
                        </button>
                        <h1 className="text-xl font-semibold text-emerald-700 ml-3 tracking-tight">
                            Herbal Admin
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                onClick={toggleProfileDropdown}
                                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-all duration-300"
                                aria-label="User profile"
                            >
                                <FaUser className="h-5 w-5 transform hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline text-sm font-medium tracking-tight">
                                    Admin User
                                </span>
                            </button>
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-xl py-3 z-10 border border-gray-100/50 animate-slide-in">
                                    <div className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200/50">
                                        <p className="font-semibold text-emerald-700">Admin User</p>
                                        <p className="text-xs text-gray-500">admin@example.com</p>
                                    </div>
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-600 rounded-b-xl transition-colors"
                                        onClick={() => console.log('Logout')}
                                    >
                                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;