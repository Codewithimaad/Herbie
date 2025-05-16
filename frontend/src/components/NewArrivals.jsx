import React from 'react';
import { FaCartPlus, FaStar, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import products from '../assets/products';
import HeadingText from './HeadingText';

const NewArrivals = () => {
    const newProducts = products.filter(product => product.isNew).slice(0, 8);

    const handleActionClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Add to cart logic
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <HeadingText
                    title="New Arrivals"
                    description="Discover our latest herbal additions. Fresh from nature, just for you."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {newProducts.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group overflow-hidden"
                        >
                            <Link to={`/product/${product._id}`} className="block">
                                {/* Image Section */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Badge */}
                                    <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                        New
                                    </span>
                                </div>

                                {/* Info Section */}
                                <div className="p-4">
                                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) =>
                                            i < Math.floor(product.rating) ? (
                                                <FaStar key={i} className="text-amber-400 text-sm" />
                                            ) : (
                                                <FaRegStar key={i} className="text-amber-400 text-sm" />
                                            )
                                        )}
                                        <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                                        <div>
                                            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through ml-2">
                                                    ${product.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleActionClick}
                                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition"
                                        >
                                            <FaCartPlus />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
