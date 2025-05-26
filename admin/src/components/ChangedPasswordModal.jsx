import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const ChangePasswordModal = ({ showPasswordModal, setShowPasswordModal, backendUrl, token, navigate }) => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '', // Changed to match backend
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePasswordChange = (field, value) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
        setError(null); // Clear error on input change
    };

    const changePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError('All password fields are required');
            toast.error('All password fields are required');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            toast.error('New password must be at least 8 characters');
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordData.newPassword)) {
            setError('New password must contain at least one letter and one number');
            toast.error('New password must contain at least one letter and one number');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New password and confirmation do not match');
            toast.error('Passwords do not match');
            return;
        }
        try {
            setIsProcessing(true);
            await axios.put(
                `${backendUrl}/api/admins/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword, // Align with backend
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setShowPasswordModal(false);
            setError(null);
            toast.success('Password changed successfully. Please log in again.');
            navigate('/login'); // Force re-login after password change
        } catch (err) {
            console.error('Error changing password:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Failed to change password';
            setError(errorMessage);
            toast.error(errorMessage);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${showPasswordModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${showPasswordModal ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={() => setShowPasswordModal(false)}
            />
            <div
                className={`bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 ${showPasswordModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiLock className="mr-2 text-emerald-600" /> Change Password
                    </h3>
                    {error && <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">{error}</div>}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter current password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => {
                                setShowPasswordModal(false);
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setError(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={changePassword}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-70 flex items-center"
                        >
                            {isProcessing ? (
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
                                    Processing...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;