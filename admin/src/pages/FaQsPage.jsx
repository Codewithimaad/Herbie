import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiX, FiTrash2, FiChevronDown, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { toast } from 'react-toastify';

const FAQsPage = () => {
    const { faqs, loadingFaqs, faqsError, fetchAllFAQs, addFAQ, deleteFAQ } = useAdmin();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFAQ, setSelectedFAQ] = useState(null);
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    useEffect(() => {
        console.log('Fetching FAQs');
        fetchAllFAQs();
    }, [fetchAllFAQs]);

    useEffect(() => {
        console.log('Current faqs:', faqs);
    }, [faqs]);

    const handleToggleFAQ = (id) => {
        console.log('Toggling FAQ:', id, 'Current expanded:', expandedFAQ);
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const handleDeleteClick = (faq) => {
        console.log('Delete clicked for FAQ:', faq);
        setSelectedFAQ(faq);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedFAQ) return;

        try {
            const result = await deleteFAQ(selectedFAQ._id);
            if (result.success) {
                setIsDeleteModalOpen(false);
                setSelectedFAQ(null);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to delete FAQ');
            console.error('Delete error:', error);
        }
    };

    // Page animation
    const pageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-50 p-4 md:p-8 lg:ml-72"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div className="flex items-center gap-2">
                        <FiHelpCircle className="h-8 w-8 text-emerald-600" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">FAQs Management</h1>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm hover:shadow-md"
                    >
                        <FiPlus className="h-5 w-5" />
                        <span>Add FAQ</span>
                    </button>
                </div>

                {/* FAQs List */}
                <div className="space-y-4">
                    {loadingFaqs ? (
                        <div className="p-8 flex justify-center bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/50">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-8 w-8 bg-emerald-200 rounded-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : faqsError ? (
                        <div className="p-8 text-center bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/50">
                            <p className="text-red-500 mb-4">{faqsError}</p>
                            <button
                                onClick={fetchAllFAQs}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                            >
                                <FiRefreshCw className="h-5 w-5" />
                                Retry
                            </button>
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/50">
                            No FAQs available
                        </div>
                    ) : (
                        faqs.map((faq) => (
                            <motion.div
                                key={faq._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => handleToggleFAQ(faq._id)}>
                                    <h3 className="text-base font-semibold text-gray-800 flex-1 pr-4">{faq.question}</h3>
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: expandedFAQ === faq._id ? 180 : 0 }}
                                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                            className="p-2 rounded-full hover:bg-emerald-50"
                                        >
                                            <FiChevronDown className="h-5 w-5 text-emerald-600" />
                                        </motion.div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent accordion toggle
                                                handleDeleteClick(faq);
                                            }}
                                            className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50 transition-colors"
                                            aria-label={`Delete FAQ: ${faq.question}`}
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedFAQ === faq._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', overflow: 'visible', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="px-4 pb-4"
                                        >
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {faq.answer || 'No answer provided'}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Add FAQ Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddFAQModal onClose={() => setIsAddModalOpen(false)} onSuccess={fetchAllFAQs} />
                )}
            </AnimatePresence>

            {/* Delete FAQ Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <DeleteFAQModal
                        faq={selectedFAQ}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedFAQ(null);
                        }}
                        onConfirm={handleConfirmDelete}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Add FAQ Modal Component
const AddFAQModal = ({ onClose, onSuccess }) => {
    const { addFAQ } = useAdmin();
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
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
        if (!formData.question.trim()) newErrors.question = 'Question is required';
        if (!formData.answer.trim()) newErrors.answer = 'Answer is required';
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
            const result = await addFAQ(formData);
            if (result.success) {
                toast.success('FAQ added successfully');
                onSuccess();
                onClose();
            } else {
                setErrors({ submit: result.error });
                toast.error(result.error);
            }
        } catch (error) {
            const errorMessage = 'Failed to add FAQ';
            setErrors({ submit: errorMessage });
            toast.error(errorMessage);
            console.error('Add FAQ error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

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
                    <div className="flex items-center gap-2">
                        <FiHelpCircle className="h-6 w-6 text-emerald-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Add New FAQ</h2>
                    </div>
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
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                            Question
                        </label>
                        <input
                            type="text"
                            id="question"
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-2 border ${errors.question ? 'border-red-300' : 'border-gray-200'
                                } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                            placeholder="Enter FAQ question"
                        />
                        {errors.question && <p className="mt-1 text-sm text-red-500">{errors.question}</p>}
                    </div>
                    <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                            Answer
                        </label>
                        <textarea
                            id="answer"
                            name="answer"
                            value={formData.answer}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-2 border ${errors.answer ? 'border-red-300' : 'border-gray-200'
                                } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                            placeholder="Enter FAQ answer"
                            rows="4"
                        />
                        {errors.answer && <p className="mt-1 text-sm text-red-500">{errors.answer}</p>}
                    </div>
                    {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
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
                            {isSubmitting ? 'Adding...' : 'Add FAQ'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// Delete FAQ Modal Component
const DeleteFAQModal = ({ faq, onClose, onConfirm }) => {
    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

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
                    <div className="flex items-center gap-2">
                        <FiTrash2 className="h-6 w-6 text-red-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Delete FAQ</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete the FAQ:{' '}
                    <span className="font-medium text-gray-800">{faq?.question}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FAQsPage;