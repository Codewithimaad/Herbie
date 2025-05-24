import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from '../context/AdminContext';
import {
    FiUpload, FiX, FiTag, FiDollarSign, FiAlignLeft, FiPackage, FiGrid,
    FiCheckCircle
} from "react-icons/fi";
import { FaMoneyBillWave } from 'react-icons/fa';


export const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUrl } = useAdmin();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        inStock: 0,
        isOrganic: false,
        isBestSeller: false,
        isNewArrival: false,
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previewNewImages, setPreviewNewImages] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/products/${id}`);
                setProduct({
                    name: data.name || "",
                    price: data.price || "",
                    description: data.description || "",
                    category: data.category || "",
                    inStock: data.inStock || 0,
                    isOrganic: data.isOrganic || false,
                    isBestSeller: data.isBestSeller || false,
                    isNewArrival: data.isNewArrival || false,
                });
                setExistingImages(data.images || []);
            } catch (err) {
                alert("Failed to load product data.");
                navigate("/products");
            }
        };

        fetchProduct();
        return () => previewNewImages.forEach(url => URL.revokeObjectURL(url));
    }, [id, backendUrl, navigate, previewNewImages]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleNewImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setNewFiles(prev => [...prev, ...files]);
        setPreviewNewImages(prev => [...prev, ...previews]);
    };

    const removeNewImage = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setImagesToRemove(prev => [...prev, existingImages[index]]);
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(product).forEach(([key, value]) => {
                formData.append(key, value);
            });
            newFiles.forEach(file => formData.append("images", file));
            formData.append("imagesToRemove", JSON.stringify(imagesToRemove));

            await axios.put(`${backendUrl}/api/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Product updated successfully!");
            navigate("/products");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update product");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50  md:p-6 lg:ml-72">
            <div className="mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiCheckCircle className="text-emerald-600" size={24} />
                            Edit Product
                        </h2>
                        <p className="text-gray-600 mt-2">Update the details below to modify the product</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Fields */}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiGrid className="text-gray-500" /> Category
                                </label>
                                <select
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out appearance-none"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {['Tea Herbs', 'Medicinal Herbs', 'Spices', 'Beauty Herbs', 'Culinary Herbs'].map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
                                    { label: 'Best Seller', name: 'isBestSeller' },
                                    { label: 'New Arrival', name: 'isNewArrival' }
                                ].map(({ label, name }) => (
                                    <label key={name} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={product[name]}
                                            onChange={handleChange}
                                            className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors duration-200"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <FiGrid className="text-gray-500" /> Existing Images
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                        {existingImages.map((img, index) => (
                                            <div key={index} className="relative group rounded-lg overflow-hidden">
                                                <img
                                                    src={img}
                                                    className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    alt="existing product"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <FiUpload className="text-gray-500" /> Upload New Images
                                </label>
                                {previewNewImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                        {previewNewImages.map((img, index) => (
                                            <div key={index} className="relative group rounded-lg overflow-hidden">
                                                <img
                                                    src={img}
                                                    className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    alt="new product"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
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
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (Max 5MB each)</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleNewImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};