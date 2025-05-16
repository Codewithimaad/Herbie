import { FaFire } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import HeadingText from '../components/HeadingText';
import Products from '../assets/products'


const BestSellers = () => {
    // Filter best sellers from all products
    const bestSellers = Products.filter(Products => Products.isBestSeller);

    if (bestSellers.length === 0) return null;

    return (
        <section className="py-12 bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <HeadingText
                    title="Our Best Sellers"
                    description="The herbal products our customers love most"
                    icon={<FaFire className="text-amber-500 mr-2" />}
                />

                <div className="mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {bestSellers.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                showBadges
                                className="transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                            />
                        ))}
                    </div>
                </div>

                {/* Optional view all button */}
                <div className="text-center mt-10">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-colors">
                        View All Best Sellers
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BestSellers;