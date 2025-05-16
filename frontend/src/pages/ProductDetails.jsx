import { useParams } from 'react-router-dom';
import { useState } from 'react';
import image1 from '../assets/images/HeroSection.jpeg';
import image2 from '../assets/images/Herb1.webp';
import image3 from '../assets/images/HeroSection.jpeg';
import image4 from '../assets/images/HeroSection.jpeg';
import { Star, Heart, ShieldCheck, Truck, ChevronRight } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const images = [image1, image2, image3, image4];
    const [mainImage, setMainImage] = useState(images[0]);

    const features = [
        { icon: <Truck size={18} />, text: "Free shipping on orders over $50" },
        { icon: <ShieldCheck size={18} />, text: "100% organic & natural guarantee" },
    ];

    return (
        <section className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8 py-12">


            <div className="flex flex-col lg:flex-row gap-12">
                {/* Product Image Gallery - Modified for full-width image */}
                <div className="lg:w-1/2">
                    {/* Main Image - Removed padding and changed object-contain to object-cover */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square mb-4 shadow-sm border border-gray-100">
                        <img
                            src={mainImage}
                            alt={`Herb ${id}`}
                            className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                            onError={(e) => (e.target.src = '/herbs/placeholder.jpg')}
                        />
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        >
                            <Heart
                                size={24}
                                className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                            />
                        </button>
                    </div>

                    {/* Thumbnails - Updated to match new full-width style */}
                    <div className="grid grid-cols-4 gap-3">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(img)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImage === img
                                    ? 'border-green-600 ring-2 ring-green-200'
                                    : 'border-gray-200 hover:border-green-400'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info (unchanged) */}
                <div className="lg:w-1/2">
                    <div className="sticky top-24">
                        {/* Badges */}
                        <div className="flex gap-2 mb-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Organic Certified
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Best Seller
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                            Premium Organic Herb Name
                        </h1>

                        <div className="flex items-center mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={`${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">(142 reviews)</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-gray-900">$9.99</span>
                            {false && ( // Example of showing original price
                                <span className="text-lg text-gray-400 line-through ml-2">$12.99</span>
                            )}
                            <p className="text-green-700 text-sm mt-1">In stock & ready to ship</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                This premium organic herb is carefully cultivated without synthetic pesticides or fertilizers.
                                Our herbs are hand-picked at peak freshness to ensure maximum flavor and nutritional value.
                                Perfect for culinary use, teas, and natural remedies.
                            </p>
                        </div>

                        <div className="space-y-3 mb-8">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center">
                                    <span className="text-green-600 mr-2">{feature.icon}</span>
                                    <span className="text-gray-600 text-sm">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex border border-gray-300 rounded-lg w-fit">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 text-center w-16">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                                aria-label="Add to cart"
                            >
                                Add to Cart
                            </button>
                            <button
                                className="flex-1 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-6 py-4 rounded-lg font-semibold text-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 items-center">
                            {/* Secure Payment Badge */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-sm text-gray-600">Secure Payment</span>
                            </div>

                            {/* Money Back Guarantee */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm text-gray-600">30-Day Guarantee</span>
                            </div>

                            {/* Organic Certified */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-sm text-gray-600">Organic Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}