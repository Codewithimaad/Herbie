import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { backendUrl } = useAdmin();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/products/`);
                console.log('product:', response.data)
                const productsWithId = response.data.map(p => ({ ...p, id: p._id }));
                setProducts(productsWithId);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Error fetching products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [backendUrl]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/products/${id}`);
            setProducts(products.filter(product => product.id !== id));
            setShowDeleteModal(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete product");
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-600 text-lg font-medium bg-red-50 px-6 py-3 rounded-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-6 lg:ml-72">
            <div className=" mx-auto">
                {/* Header and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiPlus className="text-emerald-600" size={24} />
                            Product Management
                        </h2>
                        <p className="text-gray-600 mt-2 text-sm md:text-lg">Browse and manage your product inventory</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 ease-in-out placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <Link
                            to="/add-product"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <FiPlus size={20} />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl text-sm md:text-base shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((header, index) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className={`px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider ${index === 4 ? 'text-right' : ''}`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-all duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img
                                                            className="h-12 w-12 rounded-lg object-cover border border-gray-100"
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700 capitalize">{product.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700">${parseFloat(product.price).toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${product.inStock > 20
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {product.inStock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        to={`/edit-product/${product.id}`}
                                                        className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                                                    >
                                                        <FiEdit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredProducts.length > productsPerPage && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span>{' '}
                                of <span className="font-medium">{filteredProducts.length}</span> products
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <FiChevronLeft size={18} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${currentPage === number
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <FiChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedProduct && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ease-out">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] scale-90 animate-[modalIn_0.3s_forwards]">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-gray-800">{selectedProduct.name}</span>?
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 hover:scale-105 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-95 transition-all duration-150 ease-out"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedProduct.id)}
                                    className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95 transition-all duration-150 ease-out"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



export default Products;

