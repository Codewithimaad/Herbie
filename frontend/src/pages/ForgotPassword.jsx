import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import image from '../assets/images/HeroSection.jpeg';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({ email: '' });
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { backendUrl, token } = useAuth();

    useEffect(() => {
        if (token) {
            // Redirect if user is already logged in
            toast.warning('You are already logged in');
            navigate('/');
        }
    }, [token, navigate]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: '' });
        setSuccess('');

        // Validate email
        if (!email) {
            setErrors({ email: 'Please enter your email address' });
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setStatus('loading');
        try {
            const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
            setStatus('success');
            setSuccess(response.data.message || 'Password reset link sent to your email');
            setEmail('');
        } catch (err) {
            setStatus('idle');
            const msg = err.response?.data?.message || 'Something went wrong, please try again';
            setErrors({ email: msg });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center md:px-4 py-8 bg-gray-100">
            <div className="w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-xl bg-white">
                <div className="hidden md:flex items-center justify-center">
                    <img src={image} alt="Forgot Password Visual" className="w-full h-full object-cover" />
                </div>

                <div className="p-4 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Reset Your Password</h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Enter your email address to receive a password reset link.
                    </p>

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errors.email && (
                            <p className="text-red-600 text-sm">{errors.email}</p>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none transition-all duration-200 text-sm`}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ email: '' });
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${status === 'loading'
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            {status === 'loading' ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-green-600 font-medium hover:underline"
                        >
                            <FiArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;