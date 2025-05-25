import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiEdit2 } from 'react-icons/fi';
import { useAdmin } from '../context/AdminContext';

const EditAdminModal = ({ admin, onClose }) => {
    const { updateAdmin } = useAdmin();
    const [formData, setFormData] = useState({
        name: admin.name,
        email: admin.email,
        bio: admin.bio || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await updateAdmin(admin._id, formData);
            setSuccess('Admin updated successfully!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to update admin');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                                <FiEdit2 className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Edit Admin</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                    rows="3"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 rounded-xl text-white ${isSubmitting ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'} transition-colors`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditAdminModal;