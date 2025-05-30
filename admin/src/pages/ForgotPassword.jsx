import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'framer-motion';
import logo from '../assets/images/Logo.png'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({ email: '' });
    const { backendUrl } = useAdmin();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setErrors({ email: '' });

        // Validate email
        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setStatus('loading');
        try {
            await axios.post(`${backendUrl}/api/admins/forgot-password`, { email });
            setStatus('success');
            setEmail('');
        } catch (err) {
            setStatus('idle');
            const msg = err.response?.data?.message || 'Failed to send reset email';
            setErrors({ email: msg });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-poppins">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-md w-full bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-4"
                >
                    <img
                        src={logo} // Replace with actual logo path or URL
                        alt="Website Logo"
                        className="mx-auto h-16 w-auto object-contain"
                    />
                </motion.div>
                <div className="text-center">
                    <motion.h2
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3"
                    >
                        <FiMail className="text-indigo-600" size={30} />
                        Forgot Password
                    </motion.h2>
                    <p className="mt-5 text-sm text-gray-500 font-medium">
                        Enter your email to receive a password reset link
                    </p>
                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-3 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-lg text-sm font-medium"
                        >
                            Password reset link sent successfully!
                        </motion.div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ email: '' });
                            }}
                            className={`peer w-full px-4 py-3 pl-11 bg-transparent border rounded-lg focus:ring-2 focus:border-indigo-400 transition-all duration-300 ${errors.email
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-200 focus:ring-indigo-400'
                                }`}
                            placeholder=" " // Important: Single space for floating label
                        />
                        <label
                            htmlFor="email"
                            className={`absolute left-11 transition-all duration-300 pointer-events-none ${email || errors.email
                                ? '-top-6 text-sm text-indigo-600'
                                : 'top-3 text-gray-500 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600'
                                } ${errors.email ? 'text-red-600' : ''
                                }`}
                        >
                            Email Address
                        </label>
                        <FiMail
                            className={`absolute left-4 top-3.5 ${errors.email ? 'text-red-500' : 'text-gray-400'
                                }`}
                            size={18}
                        />
                        {errors.email && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-1 text-sm text-red-600 font-medium"
                            >
                                {errors.email}
                            </motion.p>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <Link
                            to="/login"
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors duration-200"
                        >
                            <FiArrowLeft size={16} />
                            Back to Login
                        </Link>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${status === 'loading' ? 'animate-pulse' : ''
                                }`}
                            aria-label={status === 'loading' ? 'Sending reset link' : 'Send reset link'}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' && <Loader2 className="animate-spin" size={20} />}
                            <span>{status === 'loading' ? 'Sending...' : 'Send Reset Link'}</span>
                            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;