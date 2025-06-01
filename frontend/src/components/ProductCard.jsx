import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaLeaf } from 'react-icons/fa';
import AddToCartButton from './AddToCartButton';
import ReviewSmall from './ReviewSmall';
import { useCart } from '../context/cartContext';

export default function ProductCard({ product }) {
    const { currency, fetchProductReviews, hasFetchedReviews } = useCart();

    useEffect(() => {
        if (product?._id && typeof product._id === 'string' && !hasFetchedReviews(product._id)) {
            fetchProductReviews(product._id);
        }
    }, [product?._id, fetchProductReviews, hasFetchedReviews]);

    return (
        <div className="bg-white overflow-hidden transition-all duration-300 w-full max-w-[320px] mx-auto group">
            <Link
                to={`/product/${product._id}`}
                className="relative aspect-[3/4] block overflow-hidden"
                aria-label={`View ${product.name} details`}
            >
                <img
                    src={product.images?.[0] || '/fallback.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isBestSeller && (
                        <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                            <FaFire size={10} /> Best Seller
                        </span>
                    )}
                    {product.isNewArrival && (
                        <span className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                            <FaLeaf size={10} /> New Arrival
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-5 flex flex-col gap-3">
                <div>
                    <Link to={`/product/${product._id}`} className="hover:text-indigo-600 transition-colors duration-200">
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    {product.description && (
                        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                </div>

                <ReviewSmall
                    productId={product._id}
                    productRating={product.rating}
                    productReviewCount={product.reviewCount}
                    className="text-sm"
                />

                <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-gray-900">
                            {currency} {product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
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
                    />
                </div>
            </div>
        </div>
    );
}