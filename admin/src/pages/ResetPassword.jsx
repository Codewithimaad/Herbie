import React, { useState } from 'react';
import axios from 'axios';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
    const { backendUrl } = useAdmin();

    const validateField = (name, value, otherPassword) => {
        let error = '';
        if (name === 'password') {
            if (!value) error = 'Password is required';
            else if (value.length < 6) error = 'Password must be at least 6 characters';
        }
        if (name === 'confirmPassword') {
            if (!value) error = 'Confirm password is required';
            else if (value !== otherPassword) error = 'Passwords do not match';
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value);
            setErrors((prev) => ({
                ...prev,
                password: validateField('password', value),
                confirmPassword: confirmPassword ? validateField('confirmPassword', confirmPassword, value) : prev.confirmPassword,
            }));
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField('confirmPassword', value, password),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword, password),
        };
        setErrors(newErrors);
        if (newErrors.password || newErrors.confirmPassword) return;

        setStatus('loading');
        try {
            await axios.post(`${backendUrl}/api/admins/reset-password/${token}`, { password });
            setStatus('success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setStatus('idle');
            const msg = err.response?.data?.message || 'Failed to reset password';
            setErrors((prev) => ({ ...prev, confirmPassword: msg }));
            console.error('Reset error:', err);
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
                <div className="text-center">
                    <motion.h2
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3"
                    >
                        <FiLock className="text-indigo-600" size={30} />
                        Reset Password
                    </motion.h2>
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                        Choose a new password for your account
                    </p>
                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-3 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-lg text-sm font-medium"
                        >
                            Password reset successful! Redirecting to login...
                        </motion.div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            className={`peer w-full px-4 py-3 bg-transparent border rounded-lg focus:ring-2 focus:border-indigo-400 transition-all duration-300 ${errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
                                }`}
                            placeholder=" "  // This is the key change - single space
                            required
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-4 top-3 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600 ${errors.password ? 'text-red-600' : ''
                                } ${password ? '-top-6 text-sm text-indigo-600' : ''}`}
                        >
                            New Password
                        </label>
                        <FiLock
                            className={`absolute right-4 top-3.5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`}
                            size={18}
                        />
                        {errors.password && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-1 text-sm text-red-600 font-medium"
                            >
                                {errors.password}
                            </motion.p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            className={`peer w-full px-4 py-3 bg-transparent border rounded-lg focus:ring-2 focus:border-indigo-400 transition-all duration-300 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
                                }`}
                            placeholder=" "  // This is the key change - single space
                            required
                        />
                        <label
                            htmlFor="confirmPassword"
                            className={`absolute left-4 top-3 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600 ${errors.confirmPassword ? 'text-red-600' : ''
                                } ${confirmPassword ? '-top-6 text-sm text-indigo-600' : ''}`}
                        >
                            Confirm Password
                        </label>
                        <FiLock
                            className={`absolute right-4 top-3.5 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-400'}`}
                            size={18}
                        />
                        {errors.confirmPassword && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-1 text-sm text-red-600 font-medium"
                            >
                                {errors.confirmPassword}
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
                            aria-label={status === 'loading' ? 'Resetting password' : 'Reset password'}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' && <Loader2 className="animate-spin" size={20} />}
                            <span>{status === 'loading' ? 'Resetting...' : 'Reset Password'}</span>
                            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;