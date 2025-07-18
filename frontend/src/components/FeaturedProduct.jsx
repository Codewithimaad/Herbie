import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeadingText from './HeadingText';
import AddToCartButton from './AddToCartButton';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext'; // Import useCart for currency and reviews
import ReviewSmall from './ReviewSmall'; // Import ReviewSmall

const FeaturedProducts = () => {
    const { products, productLoading, productError } = useAuth();
    const { currency, fetchProductReviews, hasFetchedReviews } = useCart();

    // Get first 8 products
    const featuredProducts = products.slice(0, 8);

    // Fetch reviews for featured products
    useEffect(() => {
        featuredProducts.forEach(product => {
            if (product._id && typeof product._id === 'string' && !hasFetchedReviews(product._id)) {
                fetchProductReviews(product._id);
            }
        });
    }, [featuredProducts, fetchProductReviews, hasFetchedReviews]);

    return (
        <section className="py-16">
            <div className="container mx-auto px-0 sm:px-6 lg:px-8">
                <HeadingText
                    title="Premium Herbal Collections"
                    description="Discover nature's finest remedies, ethically sourced and scientifically validated for your wellness journey."
                    center
                />

                {productLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white flex flex-col animate-pulse border border-gray-100"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 px-10 md:px-4">
                        {featuredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white  overflow-hidden  transition-all duration-300 group flex flex-col h-full"
                            >
                                <Link to={`/product/${product._id}`} className="block flex-grow">
                                    {/* Product Image */}
                                    <div className="relative pt-[100%] overflow-hidden">
                                        <img
                                            src={product.images[0] || '/fallback.jpg'}
                                            alt={product.name}
                                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
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

                                        {/* Rating via ReviewSmall */}
                                        <ReviewSmall
                                            productId={product._id}
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

export default FeaturedProducts;