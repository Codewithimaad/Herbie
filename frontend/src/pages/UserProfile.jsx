import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiUser, FiMail, FiCalendar, FiMapPin,
    FiEdit2, FiLock, FiSettings, FiEye, FiEyeOff,
    FiUpload, FiCheck, FiX
} from 'react-icons/fi';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import HeadingText from '../components/HeadingText';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        bio: '',
        avatar: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [passwordErrors, setPasswordErrors] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [avatarPreview, setAvatarPreview] = useState('');

    const { backendUrl, user, token } = useAuth();

    const api = axios.create({
        baseURL: backendUrl,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get('/api/user/profile');
                setUserData(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    location: data.location || '',
                    bio: data.bio || '',
                    avatar: data.avatar || ''
                });
            } catch (error) {
                if (user) {
                    setUserData(user);
                    setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        location: user.location || '',
                        bio: user.bio || '',
                        avatar: user.avatar || ''
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [backendUrl, user, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));

        if (name === 'newPassword') {
            const result = zxcvbn(value);
            setPasswordStrength({
                score: result.score,
                feedback: result.feedback.suggestions[0] || ''
            });

            setPasswordErrors(prev => ({
                ...prev,
                new: value.length < 8 ? 'Password must be at least 8 characters' : ''
            }));
        } else if (name === 'confirmPassword') {
            setPasswordErrors(prev => ({
                ...prev,
                confirm: value !== passwordData.newPassword ? 'Passwords do not match' : ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Invalid email format');
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await api.put('/api/user/profile', formData);
            setUserData(prev => ({ ...prev, ...data }));

            if (avatarFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('avatar', avatarFile);
                const { data: avatarData } = await api.post('/api/user/profile/avatar', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setUserData(prev => ({ ...prev, avatar: avatarData.avatar }));
                setAvatarPreview('');
            }

            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        setPasswordErrors({
            current: '',
            new: '',
            confirm: ''
        });

        let hasError = false;
        const newErrors = {
            current: '',
            new: '',
            confirm: ''
        };

        if (!passwordData.currentPassword.trim()) {
            newErrors.current = 'Current password is required';
            hasError = true;
        }

        if (!passwordData.newPassword.trim()) {
            newErrors.new = 'New password is required';
            hasError = true;
        } else if (passwordData.newPassword.length < 8) {
            newErrors.new = 'Password must be at least 8 characters';
            hasError = true;
        }

        if (!passwordData.confirmPassword.trim()) {
            newErrors.confirm = 'Please confirm your new password';
            hasError = true;
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirm = 'Passwords do not match';
            hasError = true;
        }

        setPasswordErrors(newErrors);

        if (hasError) {
            const firstError = Object.values(newErrors).find(error => error);
            if (firstError) {
                toast.error(firstError);
            } else {
                toast.error('Please fill all required fields');
            }
            return;
        }

        try {
            setIsLoading(true);
            await api.put('/api/user/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            toast.success('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordStrength({ score: 0, feedback: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update password';

            if (error.response?.data?.error === 'INCORRECT_PASSWORD') {
                setPasswordErrors(prev => ({
                    ...prev,
                    current: 'Current password is incorrect'
                }));
                toast.error('Current password is incorrect');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthColor = (score) => {
        const colors = [
            'bg-red-500', // 0 - Very weak
            'bg-orange-500', // 1 - Weak
            'bg-yellow-500', // 2 - Fair
            'bg-blue-500', // 3 - Good
            'bg-green-500' // 4 - Strong
        ];
        return colors[score] || 'bg-gray-300';
    };

    if (isLoading && !userData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-0 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <HeadingText
                        title="My Profile"
                        description="Manage your personal information and account settings"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Left Sidebar */}
                        <div className="md:w-1/3 bg-gradient-to-b from-green-50 to-white p-6 border-r border-gray-100">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4 group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                                        <img
                                            src={avatarPreview || userData?.avatar || '/default-avatar.png'}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                        {isEditing && (
                                            <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <FiUpload className="text-white text-xl" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-gray-800">{userData?.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">{userData?.email}</p>

                                <div className="mt-8 w-full space-y-4">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-600 flex items-center">
                                            <FiCalendar className="mr-2 text-green-500" /> Member Since
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {userData && new Date(userData.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-600 flex items-center">
                                            <FiMapPin className="mr-2 text-green-500" /> Location
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {userData?.location || 'Not provided'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className={`mt-8 w-full py-2.5 px-4 rounded-lg transition flex items-center justify-center ${isEditing
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                        }`}
                                    onClick={() => setIsEditing(!isEditing)}
                                    disabled={isLoading}
                                >
                                    <FiEdit2 className="mr-2" size={14} />
                                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:w-2/3 p-6">
                            <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                                <TabList className="flex border-b border-gray-200 mb-6 space-x-1">
                                    <Tab className="focus:outline-none">
                                        <button className={`py-3 px-4 font-medium text-sm flex items-center rounded-t-lg ${activeTab === 0
                                            ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                            }`}>
                                            <FiUser className="mr-2" /> Profile
                                        </button>
                                    </Tab>
                                    {!userData?.isGoogleUser && (
                                        <Tab className="focus:outline-none">
                                            <button className={`py-3 px-4 font-medium text-sm flex items-center rounded-t-lg ${activeTab === 1
                                                ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                                }`}>
                                                <FiSettings className="mr-2" /> Settings
                                            </button>
                                        </Tab>
                                    )}
                                </TabList>

                                <TabPanel>
                                    {isEditing ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField
                                                    label="Full Name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    icon={<FiUser />}
                                                />
                                                {!userData?.isGoogleUser && (
                                                    <InputField
                                                        label="Email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        type="email"
                                                        icon={<FiMail />}
                                                    />)}
                                            </div>
                                            <InputField
                                                label="Location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                icon={<FiMapPin />}
                                            />
                                            <TextareaField
                                                label="Bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                            />
                                            <div className="flex justify-end space-x-3 pt-2">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center"
                                                    disabled={isLoading}
                                                >
                                                    <FiX className="mr-2" /> Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveChanges}
                                                    className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiCheck className="mr-2" /> Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">About Me</h3>
                                                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                                    {userData?.bio || 'No bio provided.'}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                                <div className="space-y-4">
                                                    {!userData?.isGoogleUser && (
                                                        <UserInfo
                                                            label="Email"
                                                            value={userData?.email}
                                                            icon={<FiMail className="text-green-500" />}
                                                        />
                                                    )}
                                                    <UserInfo
                                                        label="Member Since"
                                                        value={userData && new Date(userData.createdAt).toLocaleDateString()}
                                                        icon={<FiCalendar className="text-green-500" />}
                                                    />
                                                    <UserInfo
                                                        label="Location"
                                                        value={userData?.location || 'Not provided'}
                                                        icon={<FiMapPin className="text-green-500" />}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabPanel>

                                {!userData?.isGoogleUser && (
                                    <TabPanel>
                                        <div className="space-y-8">
                                            <div className="p-4 sm:p-6 rounded-lg">
                                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                                                    <FiLock className="mr-2 text-green-500" /> Change Password
                                                </h4>

                                                <PasswordInput
                                                    label="Current Password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    showPassword={showPassword.current}
                                                    toggleVisibility={() => togglePasswordVisibility('current')}
                                                    error={passwordErrors.current}
                                                />

                                                <PasswordInput
                                                    label="New Password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    showPassword={showPassword.new}
                                                    toggleVisibility={() => togglePasswordVisibility('new')}
                                                    error={passwordErrors.new}
                                                />

                                                {passwordData.newPassword && (
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Password Strength:</span>
                                                            <span className="font-medium">
                                                                {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.score]}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                                style={{ width: `${(passwordStrength.score + 1) * 25}%` }}
                                                            ></div>
                                                        </div>
                                                        {passwordStrength.feedback && (
                                                            <p className="text-xs text-gray-500 mt-1">{passwordStrength.feedback}</p>
                                                        )}
                                                    </div>
                                                )}

                                                <PasswordInput
                                                    label="Confirm New Password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    showPassword={showPassword.confirm}
                                                    toggleVisibility={() => togglePasswordVisibility('confirm')}
                                                    error={passwordErrors.confirm}
                                                />

                                                <div className="pt-2">
                                                    <button
                                                        onClick={handleUpdatePassword}
                                                        className={`w-full py-2.5 px-4 rounded-lg transition flex items-center justify-center ${isLoading ||
                                                            !passwordData.currentPassword ||
                                                            !passwordData.newPassword ||
                                                            !passwordData.confirmPassword ||
                                                            passwordData.newPassword !== passwordData.confirmPassword ||
                                                            passwordData.newPassword.length < 8
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                                            }`}
                                                        disabled={
                                                            isLoading ||
                                                            !passwordData.currentPassword ||
                                                            !passwordData.newPassword ||
                                                            !passwordData.confirmPassword ||
                                                            passwordData.newPassword !== passwordData.confirmPassword ||
                                                            passwordData.newPassword.length < 8
                                                        }
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            'Update Password'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PasswordInput = ({ label, name, value, onChange, showPassword, toggleVisibility, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 pr-10`}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
            <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

const InputField = ({ label, name, value, onChange, type = "text", icon }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {icon}
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'} py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        </div>
    </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="4"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            placeholder={`Enter ${label.toLowerCase()}`}
        />
    </div>
);

const UserInfo = ({ label, value, icon }) => (
    <div className="flex items-start">
        <div className="text-gray-400 mr-3 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    </div>
);

export default UserProfile;