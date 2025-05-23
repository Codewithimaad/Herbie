import { useState, useEffect, useRef } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { FiUser, FiLogIn, FiShoppingCart, FiSettings, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import navbarLogo from '../assets/images/Logo.png';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext'; // Import useCart

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const moreRef = useRef(null);
    const userDropdownRef = useRef(null);
    const { user, token, logout } = useAuth();
    const { cartItems } = useCart(); // Get cartItems from CartContext

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

    // Calculate total quantity of items in cart
    const cartProductCount = cartItems.length;

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to='/'>
                            <img src={navbarLogo} alt="Herbie" className="w-10 h-10" />
                        </Link>
                        <div>
                            <Link to="/">
                                <h1 className="text-md md:text-2xl font-bold text-green-800">Herbie</h1>
                                <span className="hidden md:block text-xs text-gray-500 tracking-wide">Herbal Wellness Shop</span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-10 relative">
                        {navLinks.map(({ name, path }) =>
                            name === 'MORE' ? (
                                <div key="more" ref={moreRef} className="relative">
                                    <button
                                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                                        className="text-base font-medium text-gray-700 hover:text-green-800 flex items-center gap-1 focus:outline-none"
                                        aria-expanded={isMoreOpen}
                                        aria-haspopup="true"
                                    >
                                        MORE
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : 'rotate-0'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <AnimatePresence>
                                        {isMoreOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-md py-2 px-4 min-w-[200px] z-50"
                                            >
                                                <Link to="/refund-policy" onClick={() => setIsMoreOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-green-700">Refund Policy</Link>
                                                <Link to="/shipping" onClick={() => setIsMoreOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-green-700">Shipping & Handling</Link>
                                                <Link to="/faqs" onClick={() => setIsMoreOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-green-700">FAQs</Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    key={name}
                                    to={path}
                                    className="text-base font-medium text-gray-700 hover:text-green-800 relative group"
                                >
                                    {name}
                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )
                        )}
                    </nav>

                    {/* Desktop Right Section */}
                    <div className="hidden lg:flex items-center gap-6">
                        {token && user ? (
                            <div ref={userDropdownRef} className="relative">
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center gap-2 text-sm text-green-800 hover:text-green-600 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate max-w-[120px]">{user.name}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {isUserDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <FiUser className="mr-3" size={14} />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <FiUser className="mr-3" size={14} />
                                                Orders
                                            </Link>
                                            <Link
                                                to="/settings"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <FiSettings className="mr-3" size={14} />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsUserDropdownOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-red-600"
                                            >
                                                <FiLogOut className="mr-3" size={14} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-1 text-sm text-green-800 hover:text-green-600 transition-colors">
                                <FiLogIn size={18} />
                                Login
                            </Link>
                        )}

                        <Link
                            to='/cart'
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded-md transition-all relative"
                        >
                            <FiShoppingCart size={18} />
                            Cart
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
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isUserDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => {
                                                    setIsUserDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <FiUser className="mr-3" size={14} />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => {
                                                    setIsUserDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <FiUser className="mr-3" size={14} />
                                                Orders
                                            </Link>
                                            <Link
                                                to="/settings"
                                                onClick={() => {
                                                    setIsUserDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <FiSettings className="mr-3" size={14} />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsUserDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-red-600"
                                            >
                                                <FiLogOut className="mr-3" size={14} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-1 text-sm text-green-800 hover:text-green-600 transition-colors">
                                <FiUser size={18} />
                            </Link>
                        )}

                        <Link
                            to='/cart'
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded-md transition-all relative"
                        >
                            <FiShoppingCart size={18} />
                            {cartProductCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartProductCount}
                                </span>
                            )}
                        </Link>

                        <button className="lg:hidden text-green-800 p-2" onClick={toggleMenu} aria-label="Toggle Menu">
                            {isMenuOpen ? <IoClose size={26} /> : <GiHamburgerMenu size={26} />}
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
                            className="fixed inset-0 z-50 bg-white shadow-xl lg:hidden"
                        >
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-green-600"
                                aria-label="Close menu"
                            >
                                <IoClose size={24} />
                            </button>

                            <div className="h-full flex flex-col pt-20 px-6 overflow-y-auto">
                                <ul className="space-y-6">
                                    {navLinks.map(({ name, path }) =>
                                        name === 'MORE' ? (
                                            <li key="more-mobile" className="border-b border-gray-100 pb-4">
                                                <button
                                                    onClick={() => setIsMoreOpen(prev => !prev)}
                                                    className="w-full flex justify-between items-center text-lg font-medium text-gray-900 py-2"
                                                    aria-expanded={isMoreOpen}
                                                    aria-controls="more-dropdown"
                                                >
                                                    <span>MORE</span>
                                                    <motion.span
                                                        animate={{ rotate: isMoreOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-gray-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </motion.span>
                                                </button>
                                                <AnimatePresence>
                                                    {isMoreOpen && (
                                                        <motion.ul
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="pl-4 space-y-3 mt-2"
                                                        >
                                                            <li><Link to="/refund-policy" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-green-600">Refund Policy</Link></li>
                                                            <li><Link to="/shipping" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-green-600">Shipping & Handling</Link></li>
                                                            <li><Link to="/faqs" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-green-600">FAQs</Link></li>
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Navbar;