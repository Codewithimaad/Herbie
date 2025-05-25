import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';


const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const { backendUrl } = useAdmin();


    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/category`);
                setCategories(data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load categories');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Filter categories based on search
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add new category
    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        try {
            const { data } = await axios.post(`${backendUrl}/api/category`, {
                name: newCategory.trim()
            });

            setCategories([...categories, data]);
            setNewCategory('');
            toast.success('Category added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    };

    // Update category
    const handleUpdateCategory = async () => {
        if (!editValue.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        try {
            await axios.put(`/api/category/${editingId}`, {
                name: editValue.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setCategories(categories.map(cat =>
                cat._id === editingId ? { ...cat, name: editValue.trim() } : cat
            ));
            setEditingId(null);
            toast.success('Category updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update category');
        }
    };

    // Delete category
    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await axios.delete(`${backendUrl}/api/category/${id}`);

            setCategories(categories.filter(cat => cat._id !== id));
            toast.success('Category deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen md:p-6 lg:ml-72 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6 lg:ml-72">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                        <p className="text-gray-500 mt-1">Manage your product categories</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                            placeholder="Search categories..."
                        />
                    </div>
                </div>
            </div>

            {/* Add Category Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 transition-all hover:shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g. Sports Equipment"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button
                        onClick={handleAddCategory}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Add Category
                    </button>
                </div>
            </div>


            {/* Categories List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredCategories.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {filteredCategories.map((category) => (
                            <li key={category._id} className="group hover:bg-gray-50/50 transition-colors">
                                <div className="px-6 py-4">
                                    {editingId === category._id ? (
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                autoFocus
                                                onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory()}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleUpdateCategory}
                                                    className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                                                    title="Save"
                                                >
                                                    <Check size={18} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                                    title="Cancel"
                                                >
                                                    <X size={18} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <span className="font-medium text-sm">
                                                        {category.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                                                    <p className="text-sm text-gray-500">{category.productCount || 0} products</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEditing(category)}
                                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} strokeWidth={2} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category._id)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                            <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchQuery ? 'Try a different search term' : 'Create your first category above'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;