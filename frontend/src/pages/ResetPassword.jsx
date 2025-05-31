import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import image from '../assets/images/HeroSection.jpeg';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: '',
    });
    const navigate = useNavigate();
    const { token } = useParams(); // Get token from URL
    const { backendUrl, token: authToken } = useAuth();

    useEffect(() => {
        if (authToken) {
            // Redirect if user is already logged in
            toast.warning('You are already logged in');
            navigate('/');
        }
    }, [authToken, navigate]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value);
            const result = zxcvbn(value);
            setPasswordStrength({
                score: result.score,
                feedback: result.feedback.suggestions[0] || '',
            });
            setErrors((prev) => ({
                ...prev,
                password: value.length < 8 ? 'Password must be at least 8 characters' : '',
            }));
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
            setErrors((prev) => ({
                ...prev,
                confirmPassword: value !== password ? 'Passwords do not match' : '',
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ password: '', confirmPassword: '' });
        setSuccess('');

        // Validate inputs
        let hasError = false;
        const newErrors = { password: '', confirmPassword: '' };

        if (!password) {
            newErrors.password = 'Password is required';
            hasError = true;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            hasError = true;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            hasError = true;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) {
            const firstError = Object.values(newErrors).find((err) => err);
            toast.error(firstError || 'Please fill all required fields');
            return;
        }

        setStatus('loading');
        try {
            const response = await axios.post(`${backendUrl}/api/user/reset-password/${token}`, { password });
            setStatus('success');
            setSuccess(response.data.message || 'Password reset successfully');
            setPassword('');
            setConfirmPassword('');
            setPasswordStrength({ score: 0, feedback: '' });
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        } catch (err) {
            setStatus('idle');
            const msg = err.response?.data?.message || 'Something went wrong, please try again';
            setErrors({ password: msg, confirmPassword: '' });
            toast.error(msg);
        }
    };

    const getPasswordStrengthColor = (score) => {
        const colors = [
            'bg-red-600', // Very weak
            'bg-orange-500', // Weak
            'bg-yellow-500', // Fair
            'bg-blue-500', // Good
            'bg-green-600', // Strong
        ];
        return colors[score] || 'bg-gray-300';
    };

    return (
        <div className="min-h-screen flex items-center justify-center md:px-4 py-8 bg-gray-100">
            <div className="w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-xl bg-white">
                <div className="hidden md:flex items-center justify-center">
                    <img src={image} alt="Reset Password Visual" className="w-full h-full object-cover" />
                </div>

                <div className="p-4 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Reset Your Password</h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Enter your new password below to reset your account.
                    </p>

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    {errors.password && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                            {errors.password}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword.password ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none transition-all duration-200 text-sm`}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('password')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword.password ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {password && (
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 font-medium">Password Strength:</span>
                                    <span className="font-medium text-gray-900">
                                        {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.score]}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${getPasswordStrengthColor(passwordStrength.score)} transition-all duration-300`}
                                        style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                                    ></div>
                                </div>
                                {passwordStrength.feedback && (
                                    <p className="text-xs text-gray-500 mt-2">{passwordStrength.feedback}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword.confirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-2.5 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none transition-all duration-200 text-sm`}
                                    value={confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword.confirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading' || errors.password || errors.confirmPassword}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${status === 'loading' || errors.password || errors.confirmPassword
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
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
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

export default ResetPassword;