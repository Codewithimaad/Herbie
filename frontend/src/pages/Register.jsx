import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/authContext';
import image from '../assets/images/HeroSection.jpeg';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            if (res.status === 201) {
                // Login immediately after register (get token)
                const loginRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                    email: form.email,
                    password: form.password,
                });

                const { token, user } = loginRes.data;

                login(user, token);
                navigate('/'); // or dashboard/home
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center sm:px-2 md:px-4 py-8">
            <div className="w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:flex items-center justify-center">
                    <img src={image} alt="Register Visual" className="w-full object-cover" />
                </div>

                <div className="p-4 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-6">Create Account</h2>
                    <p className="text-gray-600 mb-8">
                        Sign up to get started with <span className="font-semibold text-green-700">Herbie</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Full Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirm Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition-all">
                            Register
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-4 text-gray-400">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <button onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-100 transition-all">
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-700 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
