import { useState, useEffect, useRef } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import {
    FiUser,
    FiLogIn,
    FiShoppingCart,
    FiSettings,
    FiLogOut,
    FiHeart,
    FiCreditCard,
    FiHelpCircle,
    FiChevronDown,
    FiChevronRight,
    FiShoppingBag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import navbarLogo from '../assets/images/Logo.png';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const moreRef = useRef(null);
    const userDropdownRef = useRef(null);
    const { user, token, logout } = useAuth();
    const { cartItems } = useCart();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreRef.current && !moreRef.current.contains(event.target)) {
                setIsMoreOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'PRODUCTS', path: '/products' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'DISCLAIMER', path: '/disclaimer' },
        { name: 'CUSTOMER SERVICE', path: '/customer-service' },
        { name: 'MORE', path: '#' },
        { name: 'CONTACT', path: '/contact' },
    ];

    const cartProductCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Link to='/' className="flex items-center gap-3">
                            <img src={navbarLogo} alt="Herbie" className="w-9 h-9" />
                            <div>
                                <h1 className="text-lg md:text-2xl font-bold text-green-800">Herbie</h1>
                                <span className="hidden md:block text-xs text-gray-500 tracking-wide">Herbal Wellness Shop</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 relative">
                        {navLinks.map(({ name, path }) =>
                            name === 'MORE' ? (
                                <div key="more" ref={moreRef} className="relative">
                                    <button
                                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                                        className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-green-800 transition-colors"
                                        aria-expanded={isMoreOpen}
                                        aria-haspopup="true"
                                    >
                                        {name}
                                        <motion.span
                                            animate={{ rotate: isMoreOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FiChevronDown className="w-4 h-4" />
                                        </motion.span>
                                    </button>
                                    <AnimatePresence>
                                        {isMoreOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg py-2 px-1 min-w-[200px] z-50 border border-gray-100"
                                            >
                                                <Link
                                                    to="/refund-policy"
                                                    onClick={() => setIsMoreOpen(false)}
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    Refund Policy
                                                </Link>
                                                <Link
                                                    to="/shipping"
                                                    onClick={() => setIsMoreOpen(false)}
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    Shipping & Handling
                                                </Link>
                                                <Link
                                                    to="/faqs"
                                                    onClick={() => setIsMoreOpen(false)}
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    FAQs
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    key={name}
                                    to={path}
                                    className="relative group text-base font-medium text-gray-700 hover:text-green-800 transition-colors"
                                >
                                    {name}
                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )
                        )}
                    </nav>

                    {/* Desktop Right Section */}
                    <div className="hidden lg:flex items-center gap-5">
                        {token && user ? (
                            <div ref={userDropdownRef} className="relative">
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center gap-2 text-sm text-green-800 hover:text-green-600 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate max-w-[120px]">{user.name}</span>
                                    <motion.span
                                        animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiChevronDown className="w-4 h-4" />
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {isUserDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                            transition={{
                                                type: "spring",
                                                damping: 25,
                                                stiffness: 300,
                                                mass: 0.5
                                            }}
                                            className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white shadow-xl z-50 border border-gray-100/50 backdrop-blur-lg bg-opacity-90 overflow-hidden"
                                            style={{
                                                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08), 0px 5px 15px rgba(0, 0, 0, 0.05)"
                                            }}
                                        >
                                            {/* User Profile Header */}
                                            <div className="px-5 py-4 border-b border-gray-100/50 flex items-center gap-3 bg-gradient-to-r from-green-50/50 to-blue-50/50">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2 px-2">
                                                <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400 }}>
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                        className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 rounded-xl"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="p-2 mr-2 rounded-lg bg-green-100/50 text-green-600">
                                                                <FiUser size={16} />
                                                            </div>
                                                            <span>My Profile</span>
                                                        </div>
                                                        <FiChevronRight className="text-gray-400" size={14} />
                                                    </Link>
                                                </motion.div>

                                                <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400 }}>
                                                    <Link
                                                        to="/orders"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                        className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 rounded-xl"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="p-2 mr-2 rounded-lg bg-blue-100/50 text-blue-600">
                                                                <FiShoppingBag size={16} />
                                                            </div>
                                                            <span>My Orders</span>
                                                        </div>
                                                        <FiChevronRight className="text-gray-400" size={14} />
                                                    </Link>
                                                </motion.div>




                                            </div>

                                            {/* Logout Section */}
                                            <div className="px-3 py-2 border-t border-gray-100/50 bg-gray-50/30">
                                                <motion.button
                                                    whileHover={{ x: 3 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        setIsUserDropdownOpen(false);
                                                        logout();
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-red-500 hover:bg-red-50/80 transition-all duration-200 rounded-xl"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="p-2 mr-2 rounded-lg bg-red-100/50 text-red-500">
                                                            <FiLogOut size={16} />
                                                        </div>
                                                        <span>Sign Out</span>
                                                    </div>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-sm text-green-800 hover:text-green-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                <FiLogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}

                        <Link
                            to='/cart'
                            className="relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-sm rounded-lg transition-all"
                        >
                            <FiShoppingCart size={18} />
                            <span>Cart</span>
                            {cartProductCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartProductCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Right Section */}
                    <div className="flex justify-end lg:hidden items-center gap-4">
                        {token && user ? (
                            <div ref={userDropdownRef} className="relative">
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center gap-1 text-sm text-green-800 hover:text-green-600 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isUserDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100"
                                        >
                                            <div className="px-5 py-4 border-b border-gray-100/50 flex items-center gap-3 bg-gradient-to-r from-green-50/50 to-blue-50/50">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => {
                                                        setIsUserDropdownOpen(false);
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2"
                                                >
                                                    <FiUser className="mr-3" size={16} />
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    onClick={() => {
                                                        setIsUserDropdownOpen(false);
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2"
                                                >
                                                    <FiShoppingBag className="mr-3" size={16} />
                                                    Orders
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        setIsUserDropdownOpen(false);
                                                        setIsMenuOpen(false);
                                                        logout();
                                                    }}
                                                    className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-lg mx-2"
                                                >
                                                    <FiLogOut className="mr-3" size={16} />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-1 text-sm text-green-800 hover:text-green-600 transition-colors">
                                <FiUser size={20} />
                            </Link>
                        )}

                        <Link
                            to='/cart'
                            className="relative flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all"
                        >
                            <FiShoppingCart size={20} />
                            {cartProductCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartProductCount}
                                </span>
                            )}
                        </Link>

                        <button
                            className="lg:hidden text-green-800 p-2"
                            onClick={toggleMenu}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? (
                                <IoClose size={24} className="text-gray-700" />
                            ) : (
                                <GiHamburgerMenu size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                            className="fixed inset-0 z-40 bg-white shadow-xl lg:hidden pt-20 overflow-y-auto"
                        >
                            <div className="container px-4 py-6">
                                <ul className="space-y-4">
                                    {navLinks.map(({ name, path }) =>
                                        name === 'MORE' ? (
                                            <li key="more-mobile" className="border-b border-gray-100 pb-2">
                                                <button
                                                    onClick={() => setIsMoreOpen(prev => !prev)}
                                                    className="w-full flex justify-between items-center text-lg font-medium text-gray-900 py-3"
                                                    aria-expanded={isMoreOpen}
                                                    aria-controls="more-dropdown"
                                                >
                                                    <span>{name}</span>
                                                    <motion.span
                                                        animate={{ rotate: isMoreOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                                                    </motion.span>
                                                </button>
                                                <AnimatePresence>
                                                    {isMoreOpen && (
                                                        <motion.ul
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="pl-4 space-y-2 mt-2"
                                                            id="more-dropdown"
                                                        >
                                                            <li>
                                                                <Link
                                                                    to="/refund-policy"
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-3 text-gray-600 hover:text-green-600"
                                                                >
                                                                    Refund Policy
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    to="/shipping"
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-3 text-gray-600 hover:text-green-600"
                                                                >
                                                                    Shipping & Handling
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    to="/faqs"
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-3 text-gray-600 hover:text-green-600"
                                                                >
                                                                    FAQs
                                                                </Link>
                                                            </li>
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </li>
                                        ) : (
                                            <li key={name}>
                                                <Link
                                                    to={path}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="block text-lg font-medium text-gray-900 py-3 border-b border-gray-100 hover:text-green-600"
                                                >
                                                    {name}
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>

                                <div className="mt-8 pt-4 border-t border-gray-100">
                                    {token && user ? (
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium mb-6"
                                        >
                                            <FiLogIn size={20} />
                                            Login / Register
                                        </Link>
                                    )}

                                    <Link
                                        to='/cart'
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-medium relative"
                                    >
                                        <FiShoppingCart size={20} />
                                        Cart
                                        {cartProductCount > 0 && (
                                            <span className="absolute top-2 right-6 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartProductCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Navbar;