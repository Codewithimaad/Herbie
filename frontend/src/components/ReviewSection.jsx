import { Star, StarHalf, ChevronDown, CheckCircle, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewSection = ({ productId }) => {
    const { user, token, backendUrl } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        recommend: true,
        attributes: [],
        location: user?.location || '',
    });
    const [reviews, setReviews] = useState([]);
    const [ratingStats, setRatingStats] = useState({
        average: 0,
        total: 0,
        breakdown: [0, 0, 0, 0, 0],
        recommendPercentage: 0,
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('most-recent');
    const [loading, setLoading] = useState(false);

    // Fetch reviews and stats
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${backendUrl}/api/reviews/${productId}`,
                    {
                        params: { page, sort },
                    }
                );
                setReviews(res.data.reviews);
                setRatingStats(res.data.ratingStats);
                setPage(res.data.page);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                toast.error('Failed to load reviews', {
                    position: 'top-right',
                    autoClose: 5000,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId, page, sort]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle recommendation toggle
    const handleRecommendToggle = (value) => {
        setFormData((prev) => ({ ...prev, recommend: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('Please log in to submit a review', {
                position: 'top-right',
                autoClose: 5000,
            });
            return;
        }

        if (!rating || !formData.title || !formData.content) {
            toast.error('Please provide a rating, title, and review content', {
                position: 'top-right',
                autoClose: 5000,
            });
            return;
        }

        try {
            const res = await axios.post(
                `${backendUrl}/api/reviews/${productId}`,
                {
                    rating,
                    title: formData.title,
                    content: formData.content,
                    recommend: formData.recommend,
                    attributes: formData.attributes,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setReviews((prev) => [res.data.review, ...prev]);
            setRatingStats((prev) => {
                const newTotal = prev.total + 1;
                const newBreakdown = [...prev.breakdown];
                newBreakdown[5 - rating]++;
                const newAverage = Number(
                    (
                        (prev.average * prev.total + rating) / newTotal
                    ).toFixed(1)
                );
                return {
                    ...prev,
                    total: newTotal,
                    breakdown: newBreakdown,
                    average: newAverage,
                    recommendPercentage: Math.round(
                        ((prev.recommendPercentage * prev.total +
                            (formData.recommend ? 100 : 0)) /
                            newTotal) *
                        100
                    ) / 100,
                };
            });
            setFormData({ title: '', content: '', recommend: true, attributes: [] });
            setRating(0);
            toast.success('Review submitted successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    // Load more reviews
    const handleLoadMore = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    // Handle sort change
    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(1);
        setReviews([]);
    };

    // Handle helpful vote (optional)
    const handleHelpful = async (reviewId) => {
        if (!reviewId) {
            console.error('Invalid reviewId:', reviewId);
            toast.error('Invalid review ID', {
                position: 'top-right',
                autoClose: 5000,
            });
            return;
        }

        try {
            const res = await axios.put(
                `${backendUrl}/api/reviews/${reviewId}/helpful`,
                {},
                {
                    headers: { Authorization: token ? `Bearer ${token}` : undefined },
                    withCredentials: true,
                }
            );
            setReviews((prev) =>
                prev.map((r) =>
                    r._id === reviewId ? { ...r, helpfulCount: res.data.helpfulCount } : r
                )
            );
            toast.success('Marked as helpful', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (err) {
            console.error('Error marking helpful:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                reviewId,
            });
            toast.error(err.response?.data?.message || 'Failed to mark as helpful', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    return (
        <section className="mt-16 border-t border-gray-100 pt-12">
            <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Rating Summary */}
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
                                    <span>{ratingStats.recommendPercentage}% of customers recommend this product</span>
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
                        {/* Review Form */}
                        <div className="bg-white p-4 md:p-6 rounded-xl mb-10 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Share Your Experience</h3>
                            <form onSubmit={handleSubmit}>
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
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Summarize your experience in a few words"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Would you recommend this product?
                                        </label>
                                        <div className="flex space-x-4">
                                            <button
                                                type="button"
                                                className="flex items-center"
                                                onClick={() => handleRecommendToggle(true)}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 mr-2 ${formData.recommend ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}></div>
                                                <span>Yes</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="flex items-center"
                                                onClick={() => handleRecommendToggle(false)}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 mr-2 ${!formData.recommend ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}></div>
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
                                        name="content"
                                        rows={5}
                                        value={formData.content}
                                        onChange={handleInputChange}
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
                                        disabled={loading}
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Customer Reviews ({ratingStats.total})
                                </h3>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600 mr-3">Sort by:</span>
                                    <select
                                        value={sort}
                                        onChange={handleSortChange}
                                        className="border-0 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-green-500 rounded-md"
                                    >
                                        <option value="most-recent">Most recent</option>
                                        <option value="highest-rated">Highest rated</option>
                                        <option value="lowest-rated">Lowest rated</option>
                                        <option value="most-helpful">Most helpful</option>
                                    </select>
                                </div>
                            </div>

                            {loading && reviews.length === 0 ? (
                                <p className="text-gray-600">Loading reviews...</p>
                            ) : reviews.length === 0 ? (
                                <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
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
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
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

                                        <div className="flex items-center text-sm text-gray-600">
                                            <button
                                                onClick={() => handleHelpful(review._id)}
                                                className="flex items-center hover:text-green-600 transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Helpful ({review.helpfulCount})
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}

                            {page < totalPages && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleLoadMore}
                                        className="bg-white border border-gray-200 rounded-lg px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center"
                                        disabled={loading}
                                    >
                                        Load More Reviews
                                        <ChevronDown className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;