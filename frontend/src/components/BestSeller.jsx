import { FaFire } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import HeadingText from '../components/HeadingText';
import Products from '../assets/products'


const BestSellers = () => {
    // Filter best sellers from all products
    const bestSellers = Products.filter(Products => Products.isBestSeller).slice(0, 8);

    if (bestSellers.length === 0) return null;

    return (
        <section className="py-12 bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8">
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


            </div>
        </section>
    );
};

export default BestSellers;