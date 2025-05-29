import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeadingText from './HeadingText';
import AddToCartButton from './addToCart';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext'; // Import useCart for currency and reviews
import ReviewSmall from './ReviewSmall';

const BestSellers = () => {
    const { products, productLoading, productError } = useAuth();
    const { currency, fetchProductReviews, hasFetchedReviews } = useCart();

    // Filter and get top 8 best-selling products
    const bestSellers = products
        .filter(product => product.isBestSeller)
        .slice(0, 8);

    // Fetch reviews for best-selling products
    useEffect(() => {
        bestSellers.forEach(product => {
            if (product._id && typeof product._id === 'string' && !hasFetchedReviews(product._id)) {
                fetchProductReviews(product._id);
            }
        });
    }, [bestSellers, fetchProductReviews, hasFetchedReviews]);

    return (
        <section className="py-16">
            <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                <HeadingText
                    title="Customer Favorites"
                    description="Our most loved herbal remedies, trusted by thousands for their quality and effectiveness."
                    center
                />

                {productLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse border border-gray-100"
                            >
                                {/* Image placeholder */}
                                <div className="relative pt-[100%] bg-gray-200 rounded-t-xl"></div>
                                {/* Content placeholder */}
                                <div className="p-5 flex flex-col">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="flex items-center mb-3">
                                        <div className="h-4 bg-gray-200 rounded w-24 mr-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {productError && (
                    <div className="text-center mt-12 p-4 bg-red-50 rounded-lg max-w-md mx-auto">
                        <p className="text-red-600 font-medium">Unable to load best sellers</p>
                        <p className="text-sm text-red-500 mt-1">{productError}</p>
                    </div>
                )}

                {!productLoading && !productError && bestSellers.length === 0 && (
                    <div className="text-center mt-12">
                        <p className="text-gray-500">Our best sellers are currently being restocked</p>
                        <p className="text-sm text-gray-400 mt-1">Check back soon for our popular items</p>
                    </div>
                )}

                {!productLoading && !productError && bestSellers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 px-8 md:px-4 text-sm md:text-base">
                        {bestSellers.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-amber-50 flex flex-col h-full"
                            >
                                <Link to={`/product/${product._id}`} className="block flex-grow">
                                    {/* Product Image with Best Seller Highlight */}
                                    <div className="relative pt-[100%] overflow-hidden">
                                        <img
                                            src={product.images[0] || '/fallback.jpg'}
                                            alt={product.name}
                                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

                                        {/* Best Seller Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                BEST SELLER
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5 flex flex-col">
                                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                                            {product.name}
                                        </h3>

                                        {/* Product Description */}
                                        {product.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* Rating via ReviewSmall */}
                                        <ReviewSmall
                                            productId={product._id} // Fixed: Use product._id
                                            productRating={product.rating}
                                            productReviewCount={product.reviewCount}
                                        />

                                        {/* Price */}
                                        <div className="mt-auto">
                                            <div className="flex items-baseline">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {currency} {(product.price || 0).toFixed(2)}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through ml-2">
                                                        {currency} {product.originalPrice.toFixed(2)}
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
                                        name={product.name}
                                        price={product.price}
                                        size="small"
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
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

export default BestSellers;