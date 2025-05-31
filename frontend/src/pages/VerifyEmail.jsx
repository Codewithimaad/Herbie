import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Check, Mail } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

export default function VerifyEmail() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isResending, setIsResending] = useState(false);
    const [showResendForm, setShowResendForm] = useState(false);
    const { token } = useParams();
    const { token: authToken, backendUrl } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (authToken) {
            setError('You are already logged in');
            setTimeout(() => navigate('/'), 3000);
        }
    }, [authToken, navigate]);

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
                if (success.includes('verified')) {
                    navigate('/login');
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    // Verify email on mount
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${backendUrl}/api/auth/verify-email/${token}`);
                setSuccess(res.data.message || 'Email verified successfully. Redirecting to login...');
            } catch (err) {
                setError(err.response?.data?.message || 'Email verification failed');
                setShowResendForm(true); // Show resend form on error
            } finally {
                setIsLoading(false);
            }
        };
        if (!authToken && token) {
            verifyEmail();
        }
    }, [token, authToken, backendUrl]);

    // Handle resend verification
    const handleResendVerification = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsResending(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(`${backendUrl}/api/auth/resend-verification`, { email });
            setSuccess(res.data.message || 'Verification email resent. Please check your inbox.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
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

                <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Email Verification</h2>

                {isLoading ? (
                    <p className="text-sm text-gray-600 text-center">Verifying your email...</p>
                ) : (
                    <div className="space-y-6">
                        {showResendForm && !success.includes('verified') && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 text-center">
                                    The verification link is invalid or has expired. Please enter your email to resend the verification link.
                                </p>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all text-sm"
                                        disabled={isResending}
                                    />
                                </div>
                                <button
                                    onClick={handleResendVerification}
                                    disabled={isResending}
                                    className={`w-full bg-green-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-all ${isResending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-800'
                                        }`}
                                    aria-busy={isResending}
                                >
                                    {isResending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={16} />
                                            Resend Verification Email
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        {success && success.includes('verified') && (
                            <p className="text-sm text-gray-600 text-center">Redirecting to login...</p>
                        )}
                        {!isLoading && !showResendForm && !success && (
                            <p className="text-sm text-gray-600 text-center">Processing verification...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}