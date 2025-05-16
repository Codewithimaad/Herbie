import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import HeadingText from '../components/HeadingText';
import image from '../assets/images/Herb1.webp'

const allProducts = [
    { _id: '1', name: 'Chamomile', price: 5.99, image: image },
    { _id: '2', name: 'Mint Leaves', price: 3.49, image: image },
    { _id: '3', name: 'Lavender', price: 6.99, image: image },
    { _id: '4', name: 'Echinacea', price: 7.99, image: image },
    { _id: '5', name: 'Rosemary', price: 4.99, image: image },
    { _id: '6', name: 'Thyme', price: 4.49, image: image },
];

const featuredProducts = allProducts.slice(0, 3);
const relatedProducts = allProducts.slice(-3);

export default function Products() {
    const [showMore, setShowMore] = useState(false);
    const visibleProducts = showMore ? allProducts : allProducts.slice(0, 4);

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            {/* Page Title & Description */}
            <HeadingText
                title='Our Herbal Collection'
                description='Discover the finest quality herbs sourced naturally to enhance your health and wellness.'
            />

            {/* All Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-6">
                {visibleProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        className="transform hover:scale-105 transition-transform shadow-md hover:shadow-lg rounded-lg"
                    />
                ))}
            </div>

            {/* Show More / Less Button */}
            {allProducts.length > 4 && (
                <div className="text-center mb-16">
                    <button
                        onClick={() => setShowMore((prev) => !prev)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                    >
                        {showMore ? 'Show Less' : 'Show More'}
                    </button>
                </div>
            )}

            {/* Featured Products */}
            <section className="mb-16">
                <HeadingText title='Featured Herbs' />
                <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 px-1">
                    {featuredProducts.map((product) => (
                        <div key={product._id} className="min-w-[200px] flex-shrink-0">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Products */}
            <section>
                <HeadingText title='You might also like this' />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>
        </section>
    );
}
