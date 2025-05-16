import React from 'react';
import { FaCartPlus, FaHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import HeadingText from './HeadingText';
import { Link } from 'react-router-dom'
import image from '../assets/images/Herb1.webp'

// Sample product data with realistic herbal products
const products = [
    {
        id: 1,
        name: 'Turmeric Golden Blend',
        price: 24.99,
        originalPrice: 29.99,
        rating: 4.5,
        reviews: 128,
        image: image,
        isNew: true,
        isBestSeller: true
    },
    {
        id: 2,
        name: 'Organic Ashwagandha',
        price: 19.99,
        originalPrice: 24.99,
        rating: 4.8,
        reviews: 215,
        image: image,
        isBestSeller: true
    },
    {
        id: 3,
        name: 'Moringa Leaf Powder',
        price: 16.99,
        rating: 4.2,
        reviews: 87,
        image: image,
        isNew: true
    },
    {
        id: 4,
        name: 'Holy Basil Tea',
        price: 12.99,
        originalPrice: 15.99,
        rating: 4.7,
        reviews: 176,
        image: image
    },
    {
        id: 5,
        name: 'Triphala Digestive',
        price: 18.99,
        rating: 4.4,
        reviews: 92,
        image: image,
        isNew: true
    },
    {
        id: 6,
        name: 'Neem Face Wash',
        price: 14.99,
        originalPrice: 17.99,
        rating: 4.6,
        reviews: 203,
        image: image,
        isBestSeller: true
    },
    {
        id: 7,
        name: 'Brahmi Memory Support',
        price: 22.99,
        rating: 4.3,
        reviews: 64,
        image: image
    },
    {
        id: 8,
        name: 'Ginger Turmeric Tea',
        price: 11.99,
        originalPrice: 14.99,
        rating: 4.9,
        reviews: 312,
        image: image,
        isBestSeller: true
    }
];

const FeaturedProducts = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <HeadingText
                    title="Premium Herbal Collections"
                    description="Discover nature's finest remedies, ethically sourced and scientifically validated for your wellness journey."
                    center
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Product Image with Badges */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                                    {product.isNew && (
                                        <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            NEW
                                        </span>
                                    )}
                                    {product.isBestSeller && (
                                        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            BESTSELLER
                                        </span>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                        <FaHeart className="text-gray-600 hover:text-red-500" />
                                    </button>
                                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                        <FiEye className="text-gray-600 hover:text-blue-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                                        <div className="flex items-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                i < Math.floor(product.rating) ?
                                                    <FaStar key={i} className="text-amber-400 text-sm" /> :
                                                    <FaRegStar key={i} className="text-amber-400 text-sm" />
                                            ))}
                                            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center mt-2">
                                    <span className="text-xl font-bold text-green-700">${product.price.toFixed(2)}</span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through ml-2">
                                            ${product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Add to Cart */}
                                <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg">
                                    <FaCartPlus />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link to='/products' className="border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-medium py-3 px-8 rounded-full transition-colors duration-300">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;