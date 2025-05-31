import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Check, ChevronRight, Search } from 'lucide-react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const modalRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
        >
            <div
                className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />
            <div
                ref={modalRef}
                tabIndex={-1}
                className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative transform transition-all duration-300 ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 id="modal-title" className="text-xl font-semibold text-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setIsClosing(true);
                            setTimeout(() => {
                                onConfirm();
                                setIsClosing(false);
                            }, 300);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { backendUrl } = useAdmin();

    // Auto-dismiss error and success after 3 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/category`);
                setCategories(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load categories');
                setLoading(false);
            }
        };
        fetchCategories();
    }, [backendUrl]);

    // Filter categories
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add category
    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            setError('Category name cannot be empty');
            return;
        }
        try {
            const { data } = await axios.post(`${backendUrl}/api/category`, {
                name: newCategory.trim(),
            });
            setCategories([...categories, data]);
            setNewCategory('');
            setSuccess('Category added successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add category');
        }
    };

    // Start editing
    const startEditing = (category) => {
        setEditingId(category._id);
        setEditValue(category.name);
    };

    // Update category
    const handleUpdateCategory = async () => {
        if (!editValue.trim()) {
            setError('Category name cannot be empty');
            return;
        }
        try {
            await axios.put(`${backendUrl}/api/category/${editingId}`, {
                name: editValue.trim(),
            });
            setCategories(
                categories.map((cat) =>
                    cat._id === editingId ? { ...cat, name: editValue.trim() } : cat
                )
            );
            setEditingId(null);
            setEditValue('');
            setSuccess('Category updated successfully');
        } catch (error) {
            console.error(error.response?.data?.message || 'Failed to update category')
        }
    };

    // Delete category
    const handleDeleteCategory = (id) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            setDeletingId(categoryToDelete);
            await axios.delete(`${backendUrl}/api/category/${categoryToDelete}`);
            setTimeout(() => {
                setCategories(categories.filter((cat) => cat._id !== categoryToDelete));
                setDeletingId(null);
                setSuccess('Category deleted successfully');
            }, 300);
        } catch (error) {
            setDeletingId(null);
            setError(error.response?.data?.message || 'Failed to delete category');
        }
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 lg:ml-72">
                <div className="max-w-7xl mx-auto">
                    <Skeleton height={48} width={300} className="mb-8 rounded-lg" />
                    <Skeleton height={120} className="mb-8 rounded-xl shadow-sm" />
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} height={60} className="border-b border-gray-200" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 lg:ml-72">
            <div className="max-w-7xl mx-auto relative">
                {/* Error Alert */}
                {error && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-1/2 max-w-md z-50 animate-slide-down">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg p-2 md:p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xs md:text-sm font-medium">{error}</span>
                            </div>
                            <button
                                onClick={() => setError('')}
                                className="p-1 rounded-full hover:bg-red-800/50 transition-colors duration-200"
                                aria-label="Close error"
                            >
                                <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-1/2 max-w-sm z-50 animate-slide-down">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-2 md:p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-white" />
                                <span className="text-xs md:text-sm font-medium">{success}</span>
                            </div>
                            <button
                                onClick={() => setSuccess('')}
                                className="p-1 rounded-full hover:bg-green-700/50 transition-colors duration-200"
                                aria-label="Close success"
                            >
                                <X className="h-3 w-3 md:h-5 md:w-5 text-white" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
                        <p className="text-sm text-gray-600 mt-2">Manage your product categories</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Search categories..."
                        />
                    </div>
                </div>

                {/* Add Category Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-shadow-sm hover:shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="e.g. Sports Equipment"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                            onClick={handleAddCategory}
                            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Categories List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {filteredCategories.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredCategories.map((category, index) => (
                                <li
                                    key={category._id}
                                    className={`group transition-all duration-300 ${deletingId === category._id ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-40'
                                        }`}
                                    style={{ transitionDelay: deletingId === category._id ? '0ms' : `${index * 50}ms` }}
                                >
                                    <div className="px-6 py-4">
                                        {editingId === category._id ? (
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                    autoFocus
                                                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory()}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleUpdateCategory}
                                                        className="p-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                                                        title="Save"
                                                    >
                                                        <Check size={18} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setEditValue('');
                                                        }}
                                                        className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-medium">
                                                        {category.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                                        <p className="text-sm text-gray-600">{category.productCount || 0} products</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={() => startEditing(category)}
                                                            className="p-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} strokeWidth={2} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category._id)}
                                                            className="p-2 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} strokeWidth={2} />
                                                        </button>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No Categories Found</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {searchQuery ? 'Try a different search term' : 'Create your first category above'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Category"
                    message="Are you sure you want to delete this category? This action cannot be undone."
                />
            </div>
        </div>
    );
};

export default Categories;