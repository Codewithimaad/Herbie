import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const { token, backendUrl, admin, fetchAdmin, logoutAdmin } = useAdmin();
    console.log('admin data: ', admin);
    const navigate = useNavigate();

    const [originalProfile, setOriginalProfile] = useState(null);
    const [profile, setProfile] = useState({
        _id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        bio: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAdminData();
        }
    }, [token]);

    const fetchAdminData = async () => {
        try {
            setIsLoading(true);
            await fetchAdmin();
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Failed to load admin data');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (admin) {
            setProfile({
                _id: admin._id || '',
                name: admin.name || '',
                email: admin.email || '',
                phone: admin.phone || '',
                address: admin.address || '',
                bio: admin.bio || ''
            });
            setOriginalProfile({
                _id: admin._id || '',
                name: admin.name || '',
                email: admin.email || '',
                phone: admin.phone || '',
                address: admin.address || '',
                bio: admin.bio || ''
            });
        }
    }, [admin]);

    // Handle profile field changes
    const handleProfileChange = (field, value) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Save profile changes
    const saveProfile = async () => {
        if (!profile.name || !profile.email) {
            setError('Name and email are required');
            return;
        }
        if (!profile._id) {
            setError('Admin ID is missing');
            toast.error('Admin ID is missing');
            return;
        }
        try {
            setIsProcessing(true);
            console.log('Updating profile:', profile);
            const response = await axios.put(`${backendUrl}/api/admins/${profile._id}`,
                {
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    address: profile.address,
                    bio: profile.bio,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Response data:', response.data.admin);

            // Adjust this based on your actual API response structure
            const responseData = response.data.admin;

            const updatedProfile = {
                _id: profile._id,
                name: responseData.name,
                email: responseData.email,
                phone: responseData.phone,
                address: responseData.address,
                bio: responseData.bio,
            };

            setProfile(updatedProfile);
            setOriginalProfile(updatedProfile);
            setIsEditing(false);
            setError(null);
            toast.success('Profile updated successfully');
        } catch (err) {
            console.error('Error updating profile:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            toast.error(errorMessage);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle password field changes
    const handlePasswordChange = (field, value) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Change password
    const changePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError('All password fields are required');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New password and confirmation do not match');
            return;
        }
        try {
            setIsProcessing(true);
            console.log('Changing password');
            await axios.put(
                `${backendUrl}/api/admins/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
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
            logoutAdmin();
            navigate('/login');
            toast.success('Password changed successfully');
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error && !profile.email) {
        return <div className="p-6 text-red-600 bg-gray-50 h-screen">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-3 md:p-6 lg:ml-72">
            {/* Change Password Modal */}
            <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${showPasswordModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-300 ${showPasswordModal ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setShowPasswordModal(false)}
                />
                <div
                    className={`bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 ${showPasswordModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                >
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiLock className="mr-2 text-emerald-600" /> Change Password
                        </h3>
                        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
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
                                onClick={() => setShowPasswordModal(false)}
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
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admin Account</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-lg bg-emerald-50 mr-3">
                                        <FiUser className="text-emerald-600 w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                                </div>
                                {isEditing ? (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={saveProfile}
                                            disabled={isProcessing}
                                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded disabled:opacity-50"
                                        >
                                            <FiCheck size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setProfile(originalProfile);
                                            }}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <FiX size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                )}
                            </div>
                            {error && !showPasswordModal && <div className="mb-4 text-sm text-red-600">{error}</div>}
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <FiUser className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => handleProfileChange('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Full Name"
                                        />
                                    ) : (
                                        <span className="text-gray-900">{profile.name || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <FiMail className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => handleProfileChange('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Email Address"
                                        />
                                    ) : (
                                        <span className="text-gray-900">{profile.email || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <FiPhone className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Phone Number"
                                        />
                                    ) : (
                                        <span className="text-gray-900">{profile.phone || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <FiMapPin className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={(e) => handleProfileChange('address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Address"
                                        />
                                    ) : (
                                        <span className="text-gray-900">{profile.address || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <FiMapPin className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.bio}
                                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Bio"
                                        />
                                    ) : (
                                        <span className="text-gray-900">{profile.bio || 'N/A'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="p-2 rounded-lg bg-blue-50 mr-3">
                                    <FiLock className="text-blue-600 w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">Account Actions</h2>
                            </div>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                                >
                                    Change Password
                                </button>
                                <button
                                    onClick={logoutAdmin}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;