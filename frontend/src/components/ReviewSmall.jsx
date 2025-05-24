import { Star } from 'lucide-react';
import { useCart } from '../context/cartContext';
import { useEffect, useMemo } from 'react';

const ReviewSmall = ({ productId, productRating, productReviewCount, size = 18 }) => {
    const {
        ratingStats,
        isLoadingReviews,
        fetchProductReviews,
        hasFetchedReviews
    } = useCart();

    useEffect(() => {
        if (productId && typeof productId === 'string' && !hasFetchedReviews(productId)) {
            fetchProductReviews(productId);
        }
    }, [productId, fetchProductReviews, hasFetchedReviews]);

    const { averageRating, reviewCount } = useMemo(() => {
        const stats = productId ? ratingStats[productId] || {} : {};
        return {
            averageRating: stats.average ?? productRating ?? 0,
            reviewCount: stats.total ?? productReviewCount ?? 0
        };
    }, [productId, ratingStats, productRating, productReviewCount]);

    return (
        <div className="flex items-center" id='reviews'>
            {isLoadingReviews && productId ? (
                <span className="text-xs text-gray-400">Loading reviews...</span>
            ) : (
                <>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={size}
                                className={`${i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                </>
            )}
        </div>
    );
};

export default ReviewSmall;