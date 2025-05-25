import React from 'react';
import { FiX, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminDetailsModal = ({ admin, onClose }) => {
    const formatDate = (date) => {
        return date
            ? new Date(date).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : 'N/A';
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
                    <h2 className="text-xl font-semibold text-gray-800">Admin Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {admin.image ? (
                            <img
                                src={admin.image}
                                alt={admin.name || 'Admin'}
                                className="h-16 w-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <FiUser className="h-8 w-8 text-emerald-600" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{admin.name || 'No name'}</h3>
                            <p className="text-sm text-gray-500">{admin.email || 'No email'}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <p className="mt-1 text-sm text-gray-600">{admin.bio || 'No bio provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Joined</label>
                        <p className="mt-1 text-sm text-gray-600">{formatDate(admin.createdAt)}</p>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDetailsModal;