import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom'
const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { token, admin, logoutAdmin, fetchAdmin } = useAdmin();
    const modalRef = useRef(null);
    const logoutButtonRef = useRef(null);

    useEffect(() => {
        if (token) {
            fetchAdmin();
        }
    }, [token, fetchAdmin]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isLogoutModalOpen) {
                setIsLogoutModalOpen(false);
            }
        };
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsLogoutModalOpen(false);
            }
            if (isProfileDropdownOpen && !e.target.closest('.profile-dropdown')) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLogoutModalOpen, isProfileDropdownOpen]);

    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = () => {
        logoutAdmin();
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className={`p - 2 text - gray - 600 hover: text - indigo - 600 md:hidden rounded - full hover: bg - indigo - 50 transition - all duration - 300 ${isSidebarOpen ? 'text-indigo-600 bg-indigo-50' : ''} `}
                                aria-label="Toggle sidebar"
                            >
                                <FaBars className="h-6 w-6 transform hover:scale-110 transition-transform" />
                            </button>
                            <Link to="/dashboard">
                                <h1 className="ml-3 text-xl font-semibold text-green-700 tracking-tight">
                                    Herbie Admin
                                </h1>
                            </Link>
                        </div>
                        <div className="relative profile-dropdown">
                            <button
                                onClick={toggleProfileDropdown}
                                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-all duration-300"
                                aria-label="User profile"
                            >
                                <FaUser className="h-5 w-5 transform hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline text-sm font-medium tracking-tight">
                                    {admin?.name || 'Admin'}
                                </span>
                            </button>
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-xl py-3 z-10 border border-gray-100/50 animate-slide-in">
                                    <div className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200/50">
                                        <p className="font-semibold text-green-700">{admin?.name || 'Admin'}</p>
                                        <p className="text-xs text-gray-500">{admin?.email || 'No email'}</p>
                                    </div>
                                    <button
                                        ref={logoutButtonRef}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-b-xl transition-colors"
                                        onClick={openLogoutModal}
                                    >
                                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 animate-scale-in"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Logout confirmation"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">
                            Are you sure you want to logout?
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            You will be signed out of your admin account.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;