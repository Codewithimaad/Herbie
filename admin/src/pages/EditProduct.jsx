import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiUpload, FiX, FiTag, FiDollarSign, FiAlignLeft,
    FiPackage, FiGrid
} from 'react-icons/fi';
import { Loader2, Check } from 'lucide-react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import { toast } from 'react-toastify';

export const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUrl, categories, token } = useAdmin();
    const [status, setStatus] = useState('idle');
    const [product, setProduct] = useState({
        name: '',
        price: '',
        originalPrice: '', // Added originalPrice field
        description: '',
        category: '',
        inStock: '',
        isOrganic: false,
        bestSeller: false,
        newArrival: false,
        existingImages: [],
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadError, setUploadError] = useState('');

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/products/${id}`);
                const data = res.data;
                setProduct({
                    ...data,
                    originalPrice: data.originalPrice || '', // Initialize originalPrice
                    existingImages: data.images || [],
                });
                setPreviewImages(data.images || []);
            } catch (err) {
                toast.error('Failed to fetch product', {
                    className: 'rounded-lg shadow-lg bg-red-50 text-red-800',
                    bodyClassName: 'text-sm',
                });
            }
        };
        fetchProduct();
    }, [backendUrl, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setProduct((prev) => ({ ...prev, [name]: checked }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadError('');

        if (files.length + previewImages.length > 5) {
            setUploadError('Maximum 5 images allowed');
            return;
        }

        const validFiles = files.filter((file) => {
            if (!file.type.match('image.*')) {
                setUploadError('Only image files are allowed');
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
        const isNewImage = index >= product.existingImages.length;
        if (isNewImage) {
            setSelectedFiles((prev) => prev.filter((_, i) => i !== index - product.existingImages.length));
        } else {
            setProduct((prev) => ({
                ...prev,
                existingImages: prev.existingImages.filter((_, i) => i !== index),
            }));
        }
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (previewImages.length === 0) {
            toast.error('At least one image is required', {
                className: 'rounded-lg shadow-lg bg-red-50 text-red-800',
                bodyClassName: 'text-sm',
            });
            return;
        }

        setStatus('loading');
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            if (key !== 'existingImages') {
                // Handle originalPrice: send null if empty
                if (key === 'originalPrice' && value === '') {
                    formData.append(key, '');
                } else {
                    formData.append(key, value);
                }
            }
        });
        formData.append('existingImages', JSON.stringify(product.existingImages));
        selectedFiles.forEach((file) => formData.append('images', file));

        try {
            await axios.put(`${backendUrl}/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setStatus('updated');
            setTimeout(() => {
                setStatus('idle');
                navigate('/products');
            }, 2000);
        } catch (err) {
            console.error('Update product failed:', err);
            const msg = err.response?.data?.message || 'Failed to update product';
            toast.error(msg, {
                className: 'rounded-lg shadow-lg bg-red-50 text-red-800',
                bodyClassName: 'text-sm',
            });
            setStatus('idle');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 lg:ml-72">
            <div className="mx-auto">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="p-8 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiTag className="text-indigo-600" size={28} />
                            Edit Product
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">Update the product details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500 animate-slide-in"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-gray-500" size={18} /> New Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500 animate-slide-in"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-gray-500" size={18} /> Original Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={product.originalPrice}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500 animate-slide-in"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500 animate-slide-in"
                                    placeholder="Available quantity"
                                    min="0"
                                    required
                                />
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
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 text-gray-700 placeholder-gray-500 appearance-none animate-slide-in"
                                        required
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
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiAlignLeft className="text-gray-500" size={18} /> Description
                                </label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 placeholder-gray-500 resize-none animate-slide-in"
                                    placeholder="Describe your product in detail..."
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 flex flex-wrap gap-6">
                                {[
                                    { label: 'Organic', name: 'isOrganic' },
                                    { label: 'Best Seller', name: 'isBestSeller' },
                                    { label: 'New Arrival', name: 'isNewArrival' },
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
                                            <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm animate-slide-in">
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
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max 1MB each, up to 5)</p>
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
                                    <p className="text-sm text-red-600 mt-2 animate-slide-in">{uploadError}</p>
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
                                className={`
                                    px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl 
                                    transition-all duration-200 transform hover:scale-[1.02] 
                                    flex items-center justify-center gap-2 
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    ${status === 'loading'
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 animate-pulse'
                                        : status === 'updated'
                                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                                            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
                                    }
                                `}
                                aria-label={
                                    status === 'loading' ? 'Updating product' :
                                        status === 'updated' ? 'Product updated' :
                                            'Update product'
                                }
                                aria-busy={status === 'loading'}
                                disabled={status === 'loading' || status === 'updated'}
                            >
                                {status === 'loading' && (
                                    <Loader2 className="animate-spin" size={20} />
                                )}
                                {status === 'updated' && (
                                    <Check className="animate-scale-in" size={20} />
                                )}
                                <span>
                                    {status === 'loading' && 'Updating...'}
                                    {status === 'updated' && 'Updated!'}
                                    {status === 'idle' && 'Update Product'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};