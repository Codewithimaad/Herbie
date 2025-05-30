import React, { useState } from 'react';
import axios from 'axios';
import {
    FiUpload, FiX, FiPlus, FiTag, FiDollarSign,
    FiAlignLeft, FiPackage, FiGrid
} from 'react-icons/fi';
import { Loader2, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const { backendUrl, categories, token } = useAdmin();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        inStock: '',
        isOrganic: false,
        bestSeller: false,
        newArrival: false,
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadError, setUploadError] = useState('');
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) error = 'Product name is required';
                else if (value.length > 100) error = 'Name must be less than 100 characters';
                break;
            case 'price':
                if (!value) error = 'Price is required';
                else if (isNaN(value) || parseFloat(value) <= 0) error = 'Price must be a positive number';
                break;
            case 'inStock':
                if (!value) error = 'Stock quantity is required';
                else if (isNaN(value) || parseInt(value) < 0) error = 'Stock must be a positive integer';
                break;
            case 'category':
                if (!value) error = 'Category is required';
                break;
            case 'description':
                if (!value.trim()) error = 'Description is required';
                else if (value.length > 2000) error = 'Description must be less than 2000 characters';
                break;
            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));

        // Validate on change but don't show error until blur
        if (errors[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setProduct((prev) => ({ ...prev, [name]: checked }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadError('');
        setFormError('');

        if (files.length + selectedFiles.length > 5) {
            setUploadError('Maximum 5 images allowed');
            return;
        }

        const validFiles = files.filter((file) => {
            if (!file.type.match('image.*')) {
                setUploadError('Only image files are allowed (PNG, JPG, JPEG)');
                return false;
            }
            if (file.size > 2 * 1024 * 1024) {
                setUploadError('Image size exceeds 2MB limit');
                return false;
            }
            return true;
        });

        const previews = validFiles.map((file) => URL.createObjectURL(file));
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        setPreviewImages((prev) => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setUploadError('');
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Validate all fields
        Object.keys(product).forEach(key => {
            if (key !== 'isOrganic' && key !== 'bestSeller' && key !== 'newArrival') {
                const error = validateField(key, product[key]);
                if (error) {
                    newErrors[key] = error;
                    isValid = false;
                }
            }
        });

        // Validate images
        if (selectedFiles.length === 0) {
            setFormError('Please upload at least one image');
            isValid = false;
        } else {
            setFormError('');
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus('loading');
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });
        selectedFiles.forEach((file) => formData.append('images', file));

        try {
            await axios.post(`${backendUrl}/api/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setStatus('added');
            setTimeout(() => {
                setStatus('idle');
                setProduct({
                    name: '',
                    price: '',
                    description: '',
                    category: '',
                    inStock: '',
                    isOrganic: false,
                    bestSeller: false,
                    newArrival: false,
                });
                setPreviewImages([]);
                setSelectedFiles([]);
                navigate('/products');
            }, 2000);
        } catch (err) {
            console.error('Add product failed:', err);

            // Handle backend validation errors
            if (err.response?.data?.errors) {
                const backendErrors = {};
                err.response.data.errors.forEach(error => {
                    backendErrors[error.path] = error.msg;
                });
                setErrors(backendErrors);
            } else {
                setFormError(err.response?.data?.message || 'Failed to add product. Please try again.');
            }

            setStatus('idle');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 lg:ml-72">
            <div className="mx-auto">
                <div className="bg-white rounded-xl shadow-2xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="p-8 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiPlus className="text-indigo-600" size={28} />
                            Add New Product
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">Complete the form below to add a new product to your catalog</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {formError && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                {formError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiTag className="text-gray-500" size={18} /> Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500`}
                                    placeholder="Enter product name"
                                />
                                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-gray-500" size={18} /> Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500`}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiPackage className="text-gray-500" size={18} /> Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="inStock"
                                    value={product.inStock}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.inStock ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500`}
                                    placeholder="Available quantity"
                                    min="0"
                                />
                                {errors.inStock && <p className="text-sm text-red-600 mt-1">{errors.inStock}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiGrid className="text-gray-500" size={18} /> Category
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={product.category || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 text-gray-700 placeholder-gray-500 appearance-none`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories?.map((category) => (
                                            <option key={category._id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiAlignLeft className="text-gray-500" size={18} /> Description
                                </label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows="5"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500 resize-none`}
                                    placeholder="Describe your product in detail..."
                                />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>

                            <div className="md:col-span-2 flex flex-wrap gap-6">
                                {[
                                    { label: 'Organic', name: 'isOrganic' },
                                    { label: 'Best Seller', name: 'bestSeller' },
                                    { label: 'New Arrival', name: 'newArrival' },
                                ].map(({ label, name }) => (
                                    <label key={name} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={product[name]}
                                            onChange={handleCheckboxChange}
                                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200"
                                        />
                                        <span className="text-gray-700">{label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <FiUpload className="text-gray-500" size={18} /> Product Images
                                </label>
                                {previewImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                        {previewImages.map((img, index) => (
                                            <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index}`}
                                                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700"
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-200">
                                    <div className="flex flex-col items-center justify-center">
                                        <FiUpload className="w-10 h-10 text-gray-500 mb-3" />
                                        <p className="text-sm font-medium text-gray-700">
                                            Drop your images here or{' '}
                                            <span className="text-indigo-600 hover:text-indigo-700">click to browse</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Max 2MB each, up to 5)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                                {uploadError && (
                                    <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                                )}
                                {formError && selectedFiles.length === 0 && (
                                    <p className="text-sm text-red-600 mt-2">{formError}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
                                onClick={() => navigate('/products')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${status === 'loading'
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 animate-pulse'
                                    : status === 'added'
                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
                                    }`}
                                aria-label={
                                    status === 'loading' ? 'Adding product' :
                                        status === 'added' ? 'Product added' :
                                            'Add product'
                                }
                                aria-busy={status === 'loading'}
                                disabled={status === 'loading' || status === 'added'}
                            >
                                {status === 'loading' && <Loader2 className="animate-spin" size={20} />}
                                {status === 'added' && <Check className="animate-scale-in" size={20} />}
                                <span>
                                    {status === 'loading' && 'Adding...'}
                                    {status === 'added' && 'Added!'}
                                    {status === 'idle' && 'Add Product'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;