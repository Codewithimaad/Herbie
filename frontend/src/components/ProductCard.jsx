import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AddToCartButton from './addToCart';
import { useCart } from '../context/cartContext';
import ReviewSmall from './ReviewSmall';

export default function ProductCard({ product }) {
    const { currency, fetchProductReviews, hasFetchedReviews } = useCart();

    useEffect(() => {
        if (product?._id && typeof product._id === 'string' && !hasFetchedReviews(product._id)) {
            fetchProductReviews(product._id);
        }
    }, [product?._id, fetchProductReviews, hasFetchedReviews]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group border border-gray-100 w-full max-w-[300px] mx-auto" // Added width constraints
        >
            <Link
                to={`/product/${product._id}`}
                className="relative aspect-[4/3] overflow-hidden" // Changed to 4:3 aspect ratio
                aria-label={`View ${product.name} details`}
            >
                <img
                    src={product.images?.[0] || '/fallback.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isBestSeller && (
                        <span className="flex items-center gap-1.5 bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                            <FaFire size={10} /> Best Seller
                        </span>
                    )}
                    {product.isNewArrival && (
                        <span className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                            <FaLeaf size={10} /> New Arrival
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-grow"> {/* Reduced padding */}
                <div className="mb-2">
                    {product.category && (
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            {product.category}
                        </p>
                    )}
                    <Link to={`/product/${product._id}`} className="hover:text-indigo-600 transition-colors duration-200">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight"> {/* Reduced text size */}
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {product.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 mb-3 leading-tight"> {/* Tighter line height */}
                        {product.description}
                    </p>
                )}

                <div className="mt-auto">
                    <ReviewSmall
                        productId={product._id}
                        productRating={product.rating}
                        productReviewCount={product.reviewCount}
                        className="mb-2" // Reduced margin
                    />

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900"> {/* Reduced text size */}
                                {currency} {product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through"> {/* Reduced text size */}
                                    {currency} {product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <AddToCartButton
                            id={product._id}
                            quantity={1}
                            name={product.name}
                            price={product.price}
                            size="small"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-2 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}