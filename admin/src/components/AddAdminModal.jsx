import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useAdmin } from '../context/AdminContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AddAdminModal = ({ onClose, onSuccess }) => {
    const { addAdmin } = useAdmin();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addAdmin(formData);
            if (result.success) {
                toast.success('Admin added successfully');
                onSuccess();
                onClose();
            } else {
                setErrors({ submit: result.error });
                toast.error(result.error);
            }
        } catch (error) {
            const errorMessage = 'Failed to add admin';
            setErrors({ submit: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants for the backdrop
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    // Animation variants for the modal content
    const modalVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <motion.div
                className="bg-white/80 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-gray-100/50"
                variants={modalVariants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Admin</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-200'
                                } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                            placeholder="Enter admin name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-200'
                                } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                            placeholder="Enter admin email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-200'
                                } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                            placeholder="Enter password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio (Optional)
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Enter admin bio"
                            rows="3"
                        />
                    </div>
                    {errors.submit && (
                        <p className="text-sm text-red-500">{errors.submit}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Admin'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddAdminModal;