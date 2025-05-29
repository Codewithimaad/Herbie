import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { loginAdmin, loadingAuth, token } = useAdmin();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') {
            if (!value) error = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        }
        if (name === 'password') {
            if (!value) error = 'Password is required';
            else if (value.length < 6) error = 'Password must be at least 6 characters';
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
        };
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return;

        const { email, password } = formData;
        const result = await loginAdmin(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setErrors((prev) => ({ ...prev, password: result.error || 'Invalid email or password' }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-emerald-100 flex items-center justify-center p-4 font-poppins">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md  bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8"
            >
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-4xl font-bold text-gray-800 tracking-tight"
                    >
                        Admin Portal
                    </motion.h1>
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                        Sign in to manage your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`peer w-full px-4 py-3 bg-transparent border rounded-lg focus:ring-2 focus:border-indigo-400 transition-all duration-300 placeholder-transparent ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
                                }`}
                            placeholder="Email Address"
                        />
                        <label
                            htmlFor="email"
                            className={`absolute left-4 top-3 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600 ${errors.email ? 'text-red-600' : ''
                                } ${formData.email ? '-top-6 text-sm text-indigo-600' : ''}`}
                        >
                            Email Address
                        </label>
                        <Mail
                            className={`absolute right-4 top-3.5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`}
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

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`peer w-full px-4 py-3 bg-transparent border rounded-lg focus:ring-2 focus:border-indigo-400 transition-all duration-300 placeholder-transparent ${errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
                                }`}
                            placeholder="Password"
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-4 top-3 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600 ${errors.password ? 'text-red-600' : ''
                                } ${formData.password ? '-top-6 text-sm text-indigo-600' : ''}`}
                        >
                            Password
                        </label>
                        <Lock
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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 font-medium">
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loadingAuth}
                        className={`relative w-full flex justify-center py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${loadingAuth ? 'animate-pulse' : ''
                            }`}
                    >
                        {loadingAuth ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
