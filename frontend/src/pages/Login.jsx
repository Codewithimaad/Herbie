import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import image from '../assets/images/HeroSection.jpeg';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, backendUrl, token } = useAuth();

    useEffect(() => {
        if (token) {
            // Check if the user *manually navigated* to the login page while already logged in
            if (location.pathname === '/login') {
                toast.warning('You are already logged in');
            }
            navigate('/');
        }
    }, [token]);

    const handleGoogleLogin = () => {

        window.location.href = `${backendUrl}/api/auth/google`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
                return;
            }

            // Call context login with user and token from response
            login(data.user, data.token);

            // Redirect or do whatever after login
            navigate('/'); // example redirect after login

        } catch (err) {
            setError('Something went wrong, please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center md:px-4 py-8">
            <div className="w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:flex items-center justify-center">
                    <img src={image} alt="Login Visual" className="w-full object-cover" />
                </div>

                <div className="p-4 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-6">Welcome Back</h2>
                    <p className="text-gray-600 mb-8">
                        Please sign in to continue to <span className="font-semibold text-green-700">Herbie</span>
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <p className="text-red-600 mb-2">{error}</p>}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">

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
