import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; // Google icon
import image from '../assets/images/HeroSection.jpeg';

const Login = () => {
    // Handler for Google login (you can connect it to your OAuth logic)
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`; // Adjust as per your backend route
    };

    return (
        <div className="min-h-screen flex items-center justify-center sm:px-2 md:px-4 py-8">
            <div className="w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left - Image Section */}
                <div className="hidden md:flex items-center justify-center">
                    <img
                        src={image}
                        alt="Login Visual"
                        className="w-full object-cover"
                    />
                </div>

                {/* Right - Form Section */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-6">Welcome Back</h2>
                    <p className="text-gray-600 mb-8">
                        Please sign in to continue to <span className="font-semibold text-green-700">Herbie</span>
                    </p>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" className="form-checkbox text-green-600" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <FiLogIn size={18} />
                            Sign In
                        </button>
                    </form>

                    {/* Google Login Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-100 transition-all"
                        >
                            <FcGoogle size={20} />
                            Continue with Google
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-700 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
