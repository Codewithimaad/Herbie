import { useState, useEffect, useRef } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { FiUser, FiLogIn, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import navbarLogo from '../assets/images/Logo.png'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Close 'MORE' dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreRef.current && !moreRef.current.contains(event.target)) {
                setIsMoreOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'ABOUT US', path: '/about' },
        { name: 'DISCLAIMER', path: '/disclaimer' },
        { name: 'CUSTOMER SERVICE', path: '/customer-service' },
        { name: 'PRODUCT', path: '/products' },
        { name: 'MORE', path: '#' },
        { name: 'CONTACT', path: '/contact' },
    ];

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
                                <h1 className="text-xl md:text-2xl font-bold text-green-800">Herbie</h1>
                                <span className="text-xs text-gray-500 tracking-wide">Herbal Wellness Shop</span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-10 relative">
                        {navLinks.map(({ name, path }) =>
                            name === 'MORE' ? (
                                <div
                                    key="more"
                                    ref={moreRef}
                                    className="relative"
                                >
                                    <button
                                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                                        className="relative text-base font-medium text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:text-green-800 flex items-center gap-1 focus:outline-none"
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
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>

                                    {/* Dropdown Items */}
                                    <AnimatePresence>
                                        {isMoreOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-md py-2 px-4 min-w-[200px] z-50"
                                            >
                                                <Link
                                                    to="/refund-policy"
                                                    className="block py-2 text-sm text-gray-700 hover:text-green-700"
                                                    onClick={() => setIsMoreOpen(false)}
                                                >
                                                    Refund Policy
                                                </Link>

                                                <Link
                                                    to="/shipping"
                                                    className="block py-2 text-sm text-gray-700 hover:text-green-700"
                                                    onClick={() => setIsMoreOpen(false)}
                                                >
                                                    Shippig & Handling
                                                </Link>
                                                <Link
                                                    to="/faqs"
                                                    className="block py-2 text-sm text-gray-700 hover:text-green-700"
                                                    onClick={() => setIsMoreOpen(false)}
                                                >
                                                    FAQS
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    key={name}
                                    to={path}
                                    className="relative text-base font-medium text-gray-700 transition-all duration-300 ease-in-out hover:text-green-800 group"
                                >
                                    {name}
                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )
                        )}
                    </nav>

                    {/* Right Section - Only visible on md and up */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link
                            to="/login"
                            className="flex items-center gap-1 text-sm text-green-800 hover:text-green-600 transition-colors"
                        >
                            <FiLogIn size={18} />
                            Login
                        </Link>

                        <Link to='/cart' className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded-md transition-all">
                            <FiShoppingCart size={18} />
                            Cart
                        </Link>
                    </div>

                    {/* Mobile Right Section */}
                    <div className="flex justify-end lg:hidden items-center gap-4">
                        <Link
                            to="/login"
                            className="flex items-center gap-1 text-sm text-green-800 hover:text-green-600 transition-colors"
                        >
                            <FiUser size={18} />
                        </Link>

                        <Link to='/cart' className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded-md transition-all">
                            <FiShoppingCart size={18} />
                        </Link>
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-green-800 p-2"
                            onClick={toggleMenu}
                            aria-label="Toggle Menu"
                        >
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
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-green-600 transition-colors"
                                aria-label="Close menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Navigation Content */}
                            <div className="h-full flex flex-col pt-20 px-6 overflow-y-auto">
                                <ul className="space-y-6">
                                    {navLinks.map(({ name, path }) =>
                                        name === 'MORE' ? (
                                            <li key="more-mobile" className="border-b border-gray-100 pb-4">
                                                <button
                                                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                                                    className="w-full flex justify-between items-center text-lg font-medium text-gray-900 py-2"
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
                                                            <motion.li
                                                                initial={{ x: -10 }}
                                                                animate={{ x: 0 }}
                                                                transition={{ delay: 0.1 }}
                                                            >
                                                                <Link
                                                                    to="/refund-policy"
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
                                                                >
                                                                    Refund Policy
                                                                </Link>
                                                            </motion.li>
                                                            <motion.li
                                                                initial={{ x: -10 }}
                                                                animate={{ x: 0 }}
                                                                transition={{ delay: 0.15 }}
                                                            >
                                                                <Link
                                                                    to="/shipping"
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
                                                                >
                                                                    Shipping & Handling
                                                                </Link>
                                                            </motion.li>
                                                            <motion.li
                                                                initial={{ x: -10 }}
                                                                animate={{ x: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                            >
                                                                <Link
                                                                    to="/faqs"
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
                                                                >
                                                                    FAQs
                                                                </Link>
                                                            </motion.li>
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </li>
                                        ) : (
                                            <motion.li
                                                key={name}
                                                initial={{ x: -20 }}
                                                animate={{ x: 0 }}
                                                transition={{ delay: 0.05 * navLinks.indexOf({ name, path }) }}
                                            >
                                                <Link
                                                    to={path}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="block text-lg font-medium text-gray-900 py-3 border-b border-gray-100 hover:text-green-600 transition-colors"
                                                >
                                                    {name}
                                                </Link>
                                            </motion.li>
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
