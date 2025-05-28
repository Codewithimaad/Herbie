import React, { useState } from 'react';
import axios from 'axios';
import {
    FiUpload, FiX, FiPlus, FiTag, FiDollarSign,
    FiAlignLeft, FiPackage, FiGrid
} from 'react-icons/fi';
import { useAdmin } from '../context/AdminContext';
import { FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


const AddProduct = () => {
    const navigate = useNavigate();

    const { backendUrl, categories } = useAdmin();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setProduct(prev => ({ ...prev, [name]: checked }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadError('');

        // Validate file count
        if (files.length + selectedFiles.length > 5) {
            setUploadError('Maximum 5 images allowed');
            return;
        }

        const validFiles = files.filter(file => {
            // Validate file type
            if (!file.type.match('image.*')) {
                setUploadError('Only image files are allowed (PNG, JPG, JPEG)');
                return false;
            }

            // Validate file size (1MB max)
            if (file.size > 2 * 1024 * 1024) {
                setUploadError('Image size exceeds 2MB limit');
                return false;
            }

            return true;
        });

        const previews = validFiles.map(file => URL.createObjectURL(file));
        setSelectedFiles(prev => [...prev, ...validFiles]);
        setPreviewImages(prev => [...prev, ...previews]);
    };



    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            return toast.success("Please upload at least one image");
        }

        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });
        selectedFiles.forEach(file => formData.append("images", file));

        try {
            const data = await axios.post(`${backendUrl}/api/products`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

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
            navigate('/products')
            toast.success('Product added successfully.');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Something went wrong";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2 md:p-6 lg:ml-72">
            <div className="mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiPlus className="text-emerald-600" size={24} />
                            Add New Product
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base mt-2">Complete the form below to add a new product to your catalog</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiTag className="text-gray-500" /> Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-gray-500" /> Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rs</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiPackage className="text-gray-500" /> Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="inStock"
                                    value={product.inStock}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                    placeholder="Available quantity"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiGrid className="text-gray-500" /> Category
                                </label>
                                <select
                                    name="category"
                                    value={product.category || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg text-gray-700 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out appearance-none"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories?.map(category => (
                                        <option key={category._id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiAlignLeft className="text-gray-500" /> Description
                                </label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400 resize-none"
                                    placeholder="Describe your product in detail..."
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 flex flex-wrap gap-6">
                                {[
                                    { label: 'Organic', name: 'isOrganic' },
                                    { label: 'Best Seller', name: 'bestSeller' },
                                    { label: 'New Arrival', name: 'newArrival' }
                                ].map(({ label, name }) => (
                                    <label key={name} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={product[name]}
                                            onChange={handleCheckboxChange}
                                            className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors duration-200"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>

                            <div className="md:col-span-2">
                                <label className=" text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <FiUpload className="text-gray-500" /> Product Images
                                </label>
                                {previewImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                        {previewImages.map((img, index) => (
                                            <div key={index} className="relative group rounded-lg overflow-hidden">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index}`}
                                                    className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-200">
                                    <div className="flex flex-col items-center justify-center">
                                        <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="text-sm font-medium text-gray-600">
                                            Drop your images here or{' '}
                                            <span className="text-emerald-600 hover:text-emerald-700">click to browse</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (Max 2MB each)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;