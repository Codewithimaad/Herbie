import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import logo from '../assets/images/Logo.png'

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { loginAdmin, loadingAuth, token } = useAdmin();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
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
            navigate('/dashboard');
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
                className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8"
            >
                <div className="text-center mb-8">
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
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight"
                    >
                        Admin Portal
                    </motion.h1>
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                        Sign in to manage your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`peer w-full px-4 py-3 bg-transparent border rounded-lg focus:ring-2 focus:border-indigo-400 transition-all duration-300 ${errors.email
                                    ? 'border-red-500 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-400'
                                    }`}
                                placeholder=" " // Single space is important for floating label to work
                            />
                            <label
                                htmlFor="email"
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${formData.email || errors.email
                                    ? '-top-6 text-sm text-indigo-600'
                                    : 'top-3 text-gray-500 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600'
                                    } ${errors.email ? 'text-red-600' : ''}`}
                            >
                                Email Address
                            </label>
                        </div>
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
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`peer w-full px-4 py-3 bg-transparent border rounded-lg focus:ring-2 focus:border-indigo-400 transition-all duration-300 ${errors.password
                                    ? 'border-red-500 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-400'
                                    }`}
                                placeholder=" " // Important: Use a space here
                            />
                            <label
                                htmlFor="password"
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${formData.password || errors.password
                                    ? '-top-6 text-sm text-indigo-600'
                                    : 'top-3 text-gray-500 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-600'
                                    } ${errors.password ? 'text-red-600' : ''}`}
                            >
                                Password
                            </label>
                        </div>
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