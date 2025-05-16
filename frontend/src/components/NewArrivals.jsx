import React from 'react';
import { FaCartPlus, FaHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import products from '../assets/products';
import HeadingText from './HeadingText';

const NewArrivals = () => {
    const newProducts = products.filter(product => product.isNew).slice(0, 8);

    const handleActionClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Handle specific actions here
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <HeadingText
                    title='New Arrivals'
                    description='Discover our latest herbal additions. Fresh from nature, just for you.'
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newProducts.map((product) => (
                        <div
                            key={product._id}
                            className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                        >
                            <Link to={`/product/${product._id}`} className="block">
                                {/* Product Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="bg-gradient-to-r from-green-600 to-green-800 text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                        New Arrival
                                    </span>
                                </div>

                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                    />

                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="text-md font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center mb-2">
                                        <div className="flex mr-1">
                                            {[...Array(5)].map((_, i) => (
                                                i < Math.floor(product.rating) ?
                                                    <FaStar key={i} className="text-amber-400 text-xs" /> :
                                                    <FaRegStar key={i} className="text-amber-400 text-xs" />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">({product.reviews})</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div>
                                            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                            {product.originalPrice && (
                                                <span className="text-xs text-gray-400 line-through ml-1">
                                                    ${product.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Action Buttons */}
                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-between space-x-2">

                                    <button
                                        onClick={handleActionClick}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2 px-3 rounded-md text-sm flex items-center justify-center space-x-1 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <FaCartPlus />
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/new-arrivals"
                        className="inline-flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-8 rounded-md text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        Browse All New Arrivals
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;