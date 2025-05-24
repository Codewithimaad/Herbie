import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaFire, FaLeaf } from 'react-icons/fa';
import AddToCartButton from './addToCart';
import { useCart } from '../context/cartContext';
import { useEffect, useMemo } from 'react';
import ReviewSmall from './ReviewSmall'; // Import ReviewSmall component

export default function ProductCard({ product, variant = 'vertical', compact = false }) {
    const { currency, fetchProductReviews, hasFetchedReviews } = useCart();

    // Memoize product ID to prevent unnecessary effect triggers
    const productId = product?._id;

    // Fetch reviews when component mounts (if not already fetched)
    useEffect(() => {
        if (productId && typeof productId === 'string' && !hasFetchedReviews(productId)) {
            console.log('Fetching reviews for productId:', productId); // Debug
            fetchProductReviews(productId);
        }
    }, [productId, fetchProductReviews, hasFetchedReviews]);

    // Memoize price rendering
    const renderPrice = useMemo(() => (
        <div className={compact ? "mt-2" : "mt-3"}>
            <span className={`${compact ? "text-base" : "text-lg"} font-semibold text-gray-900`}>
                {currency} {product.price.toFixed(2)}
            </span>
            {product.originalPrice && !compact && (
                <span className="text-sm text-gray-400 line-through ml-2">
                    {currency} {product.originalPrice.toFixed(2)}
                </span>
            )}
        </div>
    ), [compact, currency, product.price, product.originalPrice]);

    // Memoize badges rendering
    const renderBadges = useMemo(() => {
        if (compact) return null;

        return (
            <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isBestSeller && (
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                        <FaFire size={12} /> Best Seller
                    </span>
                )}
                {product.isNew && (
                    <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        <FaLeaf size={12} /> New Arrival
                    </span>
                )}
            </div>
        );
    }, [compact, product.isBestSeller, product.isNew]);

    // Horizontal card variant
    if (variant === 'horizontal') {
        return (
            <div className={`flex flex-col sm:flex-row bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${compact ? "p-2" : "p-4"}`}>
                <Link
                    to={`/product/${product._id}`}
                    className={`relative ${compact ? "w-20 h-20" : "sm:w-1/3 aspect-square"}`}
                    aria-label={`View ${product.name} details`}
                >
                    <img
                        src={product.images?.[0] || '/fallback.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    {renderBadges}
                </Link>
                <div className={`flex flex-col ${compact ? "pl-3 flex-grow" : "sm:w-2/3 p-4"}`}>
                    <Link to={`/product/${product._id}`} className="hover:text-green-700 transition-colors">
                        <h3 className={`${compact ? "text-sm" : "text-base"} font-semibold text-gray-900 line-clamp-2`}>
                            {product.name}
                        </h3>
                    </Link>
                    {!compact && (
                        <ReviewSmall
                            productId={product._id}
                            productRating={product.rating}
                            productReviewCount={product.reviewCount}
                        />
                    )}
                    {renderPrice}
                    {!compact && (
                        <div className="mt-4">
                            <AddToCartButton
                                id={product._id}
                                quantity={1}
                                size="small"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Compact vertical card
    if (compact) {
        return (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <Link
                    to={`/product/${product._id}`}
                    className="relative aspect-square"
                    aria-label={`View ${product.name} details`}
                >
                    <img
                        src={product.images?.[0] || '/fallback.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    {renderBadges}
                </Link>
                <div className="p-3 flex flex-col flex-grow">
                    <Link to={`/product/${product._id}`} className="hover:text-green-700 transition-colors">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                    </Link>
                    {renderPrice}
                </div>
            </div>
        );
    }

    // Default vertical card
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <Link
                to={`/product/${product._id}`}
                className="relative aspect-square"
                aria-label={`View ${product.name} details`}
            >
                <img
                    src={product.images?.[0] || '/fallback.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                {renderBadges}
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`} className="hover:text-green-700 transition-colors">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                </Link>
                {product.category && (
                    <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
                )}
                <ReviewSmall
                    productId={product._id} // Fixed: Use product._id instead of undefined id
                    productRating={product.rating}
                    productReviewCount={product.reviewCount}
                />
                {renderPrice}
                <div className="mt-auto pt-4">
                    <AddToCartButton
                        id={product._id}
                        quantity={1}
                        size="small"
                    />
                </div>
            </div>
        </div>
    );
}