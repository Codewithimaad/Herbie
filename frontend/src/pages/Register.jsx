import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { UserPlus, X, Check } from 'lucide-react';
import { useAuth } from '../context/authContext';
import image from '../assets/images/HeroSection.jpeg';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showResend, setShowResend] = useState(false);
    const { token, backendUrl } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (token) {
            setError('You are already logged in');
            setTimeout(() => navigate('/'), 3000);
        }
    }, [token, navigate]);

    // Auto-dismiss error/success after 3 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
                setShowResend(true); // Show resend option after success
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setShowResend(false);

        // Client-side validation
        if (!form.name.trim()) {
            setError('Full name is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post(`${backendUrl}/api/auth/register`, {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            if (res.status === 201) {
                setSuccess(res.data.message || 'Registration successful. Please check your email to verify your account.');
                setForm({ name: '', email: '', password: '', confirmPassword: '' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleResendVerification = async () => {
        setError('');
        setSuccess('');
        setShowResend(false);

        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            setError('Please enter a valid email address to resend verification');
            return;
        }

        try {
            const res = await axios.post(`${backendUrl}/api/auth/resend-verification`, {
                email: form.email,
            });
            setSuccess(res.data.message || 'Verification email resent. Please check your inbox.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification email');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center sm:px-2 md:px-4 py-8">
            <div className="w-full overflow-hidden grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-xl bg-white">
                <div className="hidden md:flex items-center justify-center">
                    <img src={image} alt="Register Visual" className="w-full h-full object-cover" />
                </div>

                <div className="p-4 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-6">Create Account</h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Sign up to get started with <span className="font-semibold text-green-700">Herbie</span>
                    </p>

                    {/* Error Alert */}
                    {error && (
                        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 animate-slide-down">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <X className="h-5 w-5 text-white" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                                <button
                                    onClick={() => setError('')}
                                    className="p-1 rounded-full hover:bg-red-800/50 transition-colors duration-200"
                                    aria-label="Close error"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 animate-slide-down">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-white" />
                                    <span className="text-sm font-medium">{success}</span>
                                </div>
                                <button
                                    onClick={() => setSuccess('')}
                                    className="p-1 rounded-full hover:bg-green-700/50 transition-colors duration-200"
                                    aria-label="Close success"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Full Name"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="Email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm Password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <UserPlus size={16} />
                            Register
                        </button>
                    </form>

                    {showResend && (
                        <p className="mt-4 text-sm text-center text-gray-600">
                            Didn't receive the email?{' '}
                            <button
                                onClick={handleResendVerification}
                                className="text-green-600 font-medium hover:underline"
                            >
                                Resend Verification
                            </button>
                        </p>
                    )}

                    <div className="my-6 flex items-center">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-4 text-gray-400">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-100 transition-all duration-200"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}