import React from 'react';
import { FaCartPlus, FaHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import HeadingText from './HeadingText';
import { Link } from 'react-router-dom';
import products from '../assets/products';

const FeaturedProducts = () => {
    const handleActionClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Handle specific actions here (add to cart, wishlist, etc.)
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-2 md:px-6 lg:px-8">
                <HeadingText
                    title="Premium Herbal Collections"
                    description="Discover nature's finest remedies, ethically sourced and scientifically validated for your wellness journey."
                    center
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
                    {products.map((product) => (
                        <Link
                            to={`/product/${product._id}`}
                            key={product._id}
                            className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-green-100"
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Product Image */}
                                <div className="relative md:w-2/5">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 md:h-full object-cover"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 flex space-x-1">
                                        {product.isNew && (
                                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                                                NEW
                                            </span>
                                        )}
                                        {product.isBestSeller && (
                                            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                                HOT
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4 md:w-3/5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-800 line-clamp-2 mb-1">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                i < Math.floor(product.rating) ?
                                                    <FaStar key={i} className="text-amber-400 text-xs" /> :
                                                    <FaRegStar key={i} className="text-amber-400 text-xs" />
                                            ))}
                                            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="mt-2 mb-3">
                                            <span className="text-lg font-bold text-green-700">${product.price.toFixed(2)}</span>
                                            {product.originalPrice && (
                                                <span className="text-xs text-gray-500 line-through ml-1">
                                                    ${product.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={handleActionClick}
                                            className="text-xs bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded flex items-center space-x-1 transition-colors"
                                        >
                                            <FaCartPlus className="text-xs" />
                                            <span>Add</span>
                                        </button>


                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default FeaturedProducts;