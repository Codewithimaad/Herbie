import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { useAdmin } from '../context/AdminContext';
import { useState } from 'react';

const DeleteConfirmationModal = ({ admin, onClose }) => {
    const { deleteAdmin } = useAdmin();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setIsDeleting(true);
        setError('');

        try {
            await deleteAdmin(admin._id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to delete admin');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-150 backdrop-blur-sm"
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
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <FiAlertTriangle className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Delete Admin</h2>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{admin.name}</span>? This action cannot be undone.
                        </p>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white ${isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} transition-colors`}
                            >
                                <FiTrash2 className="h-5 w-5" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;