import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import HeadingText from './HeadingText';
import { Link } from 'react-router-dom';
import AddToCartButton from './addToCart';
import { useAuth } from '../context/authContext';

const FeaturedProducts = () => {
    const { products, productLoading, productError } = useAuth();
    const featuredProducts = products.slice(0, 8); // Get first 8 products

    return (
        <section className="py-16">
            <div className="container mx-auto px-0 sm:px-6 lg:px-8">
                <HeadingText
                    title="Premium Herbal Collections"
                    description="Discover nature's finest remedies, ethically sourced and scientifically validated for your wellness journey."
                    center
                />

                {productLoading && (
                    <div className="text-center mt-12">
                        <div className="inline-flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse"></div>
                            <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse delay-100"></div>
                            <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse delay-200"></div>
                        </div>
                        <p className="mt-2 text-gray-500">Curating premium selections</p>
                    </div>
                )}

                {productError && (
                    <div className="text-center mt-12 p-4 bg-red-50 rounded-lg max-w-md mx-auto">
                        <p className="text-red-600 font-medium">Unable to load products</p>
                        <p className="text-sm text-red-500 mt-1">{productError}</p>
                    </div>
                )}

                {!productLoading && !productError && featuredProducts.length === 0 && (
                    <div className="text-center mt-12">
                        <p className="text-gray-500">Currently refreshing our herbal inventory</p>
                        <p className="text-sm text-gray-400 mt-1">Check back soon for new arrivals</p>
                    </div>
                )}

                {!productLoading && !productError && featuredProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                        {featuredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-green-50 flex flex-col h-full"
                            >
                                <Link to={`/product/${product._id}`} className="block flex-grow">
                                    {/* Product Image */}
                                    <div className="relative pt-[100%] overflow-hidden">
                                        <img
                                            src={product.image || '/fallback.jpg'}
                                            alt={product.name}
                                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col space-y-1">
                                            {product.isNew && (
                                                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                                    New Arrival
                                                </span>
                                            )}
                                            {product.isBestSeller && (
                                                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                                    Best Seller
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5 flex flex-col">
                                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                                            {product.name}
                                        </h3>

                                        {/* Product Description */}
                                        {product.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                {product.description}
                                            </p>
                                        )}

                                        <div className="flex items-center mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                i < Math.floor(product.rating || 0) ? (
                                                    <FaStar key={i} className="text-amber-400 text-sm" />
                                                ) : (
                                                    <FaRegStar key={i} className="text-amber-400 text-sm" />
                                                )
                                            ))}
                                            <span className="text-xs text-gray-500 ml-2">({product.reviews || 0} reviews)</span>
                                        </div>

                                        {/* Price */}
                                        <div className="mt-auto">
                                            <div className="flex items-baseline">
                                                <span className="text-xl font-bold text-gray-900">
                                                    ${(product.price || 0).toFixed(2)}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through ml-2">
                                                        ${product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Actions */}
                                <div className="px-5 pb-5">
                                    <AddToCartButton
                                        id={product._id}
                                        quantity={1}
                                        size="small"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;