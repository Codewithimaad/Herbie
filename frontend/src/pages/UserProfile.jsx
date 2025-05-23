import React, { useState } from 'react';
import { FiUser, FiMail, FiCalendar, FiMapPin, FiEdit2, FiLock, FiShoppingBag, FiHeart, FiSettings } from 'react-icons/fi';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        joinDate: 'Joined March 2023',
        location: 'San Francisco, CA',
        bio: 'Wellness enthusiast and herbal product lover. Passionate about natural remedies and holistic health approaches.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    });



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="mt-2 text-gray-600">Manage your profile, orders, and preferences</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="md:flex">
                        {/* Profile Sidebar */}
                        <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-white p-6 border-r border-gray-100">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <img
                                        src={userData.avatar}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                    <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                                        <FiEdit2 size={16} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">{userData.email}</p>

                                <div className="mt-6 w-full">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Member Since</span>
                                        <span className="text-sm text-gray-500">{userData.joinDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-sm font-medium text-gray-600">Location</span>
                                        <span className="text-sm text-gray-500">{userData.location}</span>
                                    </div>
                                </div>

                                <button
                                    className="mt-6 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <FiEdit2 className="mr-2" size={14} />
                                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:w-2/3 p-6">
                            <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                                <TabList className="flex border-b border-gray-200 mb-6">
                                    <Tab className="mr-1 focus:outline-none">
                                        <button className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 0 ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}>
                                            <FiUser className="mr-2" /> Profile
                                        </button>
                                    </Tab>

                                    <Tab className="mr-1 focus:outline-none">
                                        <button className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 3 ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}>
                                            <FiSettings className="mr-2" /> Settings
                                        </button>
                                    </Tab>
                                </TabList>

                                {/* Profile Tab */}
                                <TabPanel>
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={userData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={userData.location}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                                <textarea
                                                    name="bio"
                                                    value={userData.bio}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-2">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">About Me</h3>
                                            <p className="text-gray-600 mb-6">{userData.bio}</p>

                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <FiMail className="text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="text-gray-800">{userData.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <FiCalendar className="text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Member Since</p>
                                                        <p className="text-gray-800">{userData.joinDate}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <FiMapPin className="text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Location</p>
                                                        <p className="text-gray-800">{userData.location}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabPanel>


                                {/* Settings Tab */}
                                <TabPanel>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Account Settings</h3>
                                    <div className="space-y-6">
                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                                <FiLock className="mr-2 text-blue-500" /> Change Password
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="pt-2">
                                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                                        Update Password
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;