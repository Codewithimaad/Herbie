import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAdmin } from '../context/AdminContext'; // Adjust path if needed
import { useEffect } from 'react';


export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { loginAdmin, loadingAuth, token } = useAdmin();

    useEffect(() => {
        if (token) {
            // Check if the user *manually navigated* to the login page while already logged in
            if (location.pathname === '/login') {
                toast.success('You are already logged in');
            }
            navigate('/');
        }
    }, [token]);


    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const { email, password } = formData;
        const result = await loginAdmin(email, password);
        if (result.success) {
            toast.success('Logged in successfully!');
            navigate('/');
        } else {
            toast.error(result.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md md:bg-white/30 md:backdrop-blur-lg md:rounded-2xl md:shadow-xl p-8 md:border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
                    <p className="text-gray-600 mt-2 text-sm">Sign in to manage your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label
                            htmlFor="email"
                            className={`absolute -top-2 left-2 inline-block bg-white/80 px-1 text-xs font-medium text-gray-700 transition-all duration-300 ${formData.email ? 'text-indigo-600' : ''
                                }`}
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 bg-white/50 border ${errors.email ? 'border-red-400' : 'border-gray-200'
                                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 text-gray-900`}
                                placeholder="Email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.email}</p>
                        )}
                    </div>

                    <div className="relative">
                        <label
                            htmlFor="password"
                            className={`absolute -top-2 left-2 inline-block bg-white/80 px-1 text-xs font-medium text-gray-700 transition-all duration-300 ${formData.password ? 'text-indigo-600' : ''
                                }`}
                        >
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 bg-white/50 border ${errors.password ? 'border-red-400' : 'border-gray-200'
                                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 text-gray-900`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.password}</p>
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
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loadingAuth}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${loadingAuth ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                    >
                        {loadingAuth ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}