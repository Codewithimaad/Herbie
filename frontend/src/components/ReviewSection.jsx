import { Star, StarHalf, ChevronDown, CheckCircle, HelpCircle, Flag } from 'lucide-react';
import { useState } from 'react';

const ReviewSection = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const reviews = [
        {
            id: 1,
            name: 'Alex Johnson',
            rating: 5,
            date: '2 days ago',
            title: 'Exceptional quality and aroma',
            content: 'This premium organic herb has exceeded all my expectations. The vibrant color, intense aroma, and robust flavor profile demonstrate superior quality. As a professional chef, I appreciate the careful packaging that preserves freshness. Will become a regular purchase for my kitchen.',
            verified: true,
            helpfulCount: 24,
            location: 'San Francisco, CA',
            attributes: ['Great quality', 'Fresh', 'Good packaging']
        },
        {
            id: 2,
            name: 'Sarah Miller',
            rating: 4,
            date: '1 week ago',
            title: 'Excellent with room for improvement',
            content: 'Very fresh and potent herbs arrived in perfect condition. The shipping was remarkably fast and packaging was secure. I deducted one star because while the quality is outstanding, I wish the brand offered bulk purchasing options for commercial kitchens like mine.',
            verified: true,
            helpfulCount: 12,
            location: 'Austin, TX',
            attributes: ['Fresh', 'Fast shipping']
        },
        {
            id: 3,
            name: 'Michael Chen',
            rating: 5,
            date: '3 weeks ago',
            title: 'Perfect for professional use',
            content: 'As the owner of an herbal tea company, I source ingredients globally. This product stands out for its consistent quality batch after batch. The organic certification is legitimate (I verified it) and the flavor profile is exactly what my premium blends require. Vendor communication is also excellent.',
            verified: false,
            helpfulCount: 8,
            location: 'New York, NY',
            attributes: ['Consistent', 'Premium quality', 'Authentic']
        }
    ];

    const ratingStats = {
        average: 4.7,
        total: 142,
        breakdown: [85, 32, 15, 7, 3] // 5-star to 1-star counts
    };

    return (
        <section className="mt-16 border-t border-gray-100 pt-12">
            <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Rating Summary - Enhanced with more metrics */}
                    <div className="lg:w-1/4">
                        <div className="sticky top-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

                            <div className="flex items-center mb-4">
                                <div className="flex items-center mr-3">
                                    {[...Array(5)].map((_, i) => (
                                        i < Math.floor(ratingStats.average) ? (
                                            <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                        ) : i < ratingStats.average ? (
                                            <StarHalf key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                        ) : (
                                            <Star key={i} className="w-6 h-6 text-gray-300" />
                                        )
                                    ))}
                                </div>
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">{ratingStats.average.toFixed(1)}</span>
                                    <span className="text-gray-500 ml-1">out of 5</span>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6">{ratingStats.total} verified ratings</p>

                            {/* Enhanced Rating Breakdown */}
                            <div className="space-y-3 mb-8">
                                {[5, 4, 3, 2, 1].map((stars, i) => (
                                    <div key={stars} className="flex items-center group">
                                        <span className="text-sm font-medium text-gray-900 w-10">{stars} star</span>
                                        <div className="flex-1 mx-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                                                style={{ width: `${(ratingStats.breakdown[i] / ratingStats.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">
                                            {ratingStats.breakdown[i]}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                    <span>93% of customers recommend this product</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                    <span>Free returns within 30 days</span>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Reviews Content Area */}
                    <div className="lg:w-3/4">
                        {/* Premium Review Form */}
                        <div className="bg-white p-4 md:p-6 rounded-xl mb-10 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Share Your Experience</h3>
                            <form>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Rate this product</label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                className="focus:outline-none"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            >
                                                <Star className={`w-10 h-10 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Poor</span>
                                        <span>Fair</span>
                                        <span>Good</span>
                                        <span>Very Good</span>
                                        <span>Excellent</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Review headline
                                        </label>
                                        <input
                                            type="text"
                                            id="review-title"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Summarize your experience in a few words"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Would you recommend this product?
                                        </label>
                                        <div className="flex space-x-4">
                                            <button type="button" className="flex items-center">
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
                                                <span>Yes</span>
                                            </button>
                                            <button type="button" className="flex items-center">
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
                                                <span>No</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">
                                        Detailed review
                                    </label>
                                    <textarea
                                        id="review-content"
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Share details about your experience with this product..."
                                    ></textarea>
                                </div>



                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <HelpCircle className="w-4 h-4 mr-1" />
                                        <span>Review guidelines</span>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 md:px-8 py-2 md:py-3 rounded-lg font-medium text-base shadow-md hover:shadow-lg transition-all"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Enhanced Reviews List */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Customer Reviews ({ratingStats.total})
                                </h3>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600 mr-3">Sort by:</span>
                                    <select className="border-0 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-green-500 rounded-md">
                                        <option>Most recent</option>
                                        <option>Highest rated</option>
                                        <option>Lowest rated</option>
                                        <option>Most helpful</option>
                                    </select>
                                </div>
                            </div>

                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <div className="flex mr-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                {review.verified && (
                                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900">{review.title}</h4>
                                        </div>
                                        <span className="text-sm text-gray-500 whitespace-nowrap">{review.date}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <span className="font-medium text-gray-700">{review.name}</span>
                                        {review.location && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <span>{review.location}</span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-gray-700 mb-5">{review.content}</p>

                                    {review.attributes && review.attributes.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {review.attributes.map((attr, i) => (
                                                <span key={i} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                                                    {attr}
                                                </span>
                                            ))}
                                        </div>
                                    )}


                                </div>
                            ))}

                            <div className="flex justify-center mt-8">
                                <button className="bg-white border border-gray-200 rounded-lg px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center">
                                    Load More Reviews
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;