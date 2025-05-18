import { Link } from 'react-router-dom';
import { FaShoppingBag, FaStar, FaRegStar } from 'react-icons/fa';
import { useState } from 'react';

export default function ProductCard({ product, variant = 'vertical', compact = false }) {
    const [isHovered, setIsHovered] = useState(false);

    // Render product rating stars
    const renderRating = () => !compact && (
        <div className="flex items-center mb-1">
            <div className="flex mr-1">
                {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating || 0) ?
                        <FaStar key={i} className="text-amber-400 text-xs" /> :
                        <FaRegStar key={i} className="text-amber-400 text-xs" />
                ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews || 0})</span>
        </div>
    );

    // Render price with discount if available
    const renderPrice = () => (
        <div className={compact ? "mt-1" : "mt-2"}>
            <span className={`${compact ? "text-base" : "text-lg"} font-bold text-gray-900`}>
                ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && !compact && (
                <span className="text-xs text-gray-400 line-through ml-1">
                    ${product.originalPrice.toFixed(2)}
                </span>
            )}
        </div>
    );

    // Horizontal card variant
    if (variant === 'horizontal') {
        return (
            <Link
                to={`/product/${product._id}`}
                className={`flex flex-col sm:flex-row bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden h-full ${compact ? "p-2" : "p-3"}`}
            >
                <div className={`relative ${compact ? "w-20 h-20" : "sm:w-1/3 aspect-square"}`}>
                    <img
                        src={product.images?.[0] || '/fallback.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <div className={`flex flex-col ${compact ? "pl-2 flex-grow" : "sm:w-2/3 p-2"}`}>
                    <h3 className={`${compact ? "text-sm" : "font-medium"} text-gray-900 line-clamp-2`}>
                        {product.name}
                    </h3>
                    {!compact && renderRating()}
                    {renderPrice()}
                    {!compact && (
                        <button
                            className="mt-2 flex items-center justify-center gap-1 bg-gray-900 text-white py-1.5 px-3 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
                            onClick={(e) => e.preventDefault()}
                        >
                            <FaShoppingBag size={12} />
                            <span>Add to Bag</span>
                        </button>
                    )}
                </div>
            </Link>
        );
    }

    // Compact vertical card
    if (compact) {
        return (
            <Link
                to={`/product/${product._id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow transition-all relative h-full flex flex-col p-3"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative aspect-square mb-2">
                    <img
                        src={product.images?.[0] || '/fallback.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                    />
                </div>
                <div className="flex flex-col flex-grow">
                    <h3 className="text-sm text-gray-900 line-clamp-2">{product.name}</h3>
                    {renderPrice()}
                </div>
            </Link>
        );
    }

    // Default vertical card
    return (
        <Link
            to={`/product/${product._id}`}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all relative h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-square">
                <img
                    src={product.images?.[0] || '/fallback.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                {product.category && (
                    <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                )}
                {renderRating()}
                {renderPrice()}
                <div className="mt-auto pt-4">
                    <button
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
                        onClick={(e) => e.preventDefault()}
                    >
                        <FaShoppingBag size={14} />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </Link>
    );
}
