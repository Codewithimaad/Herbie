import React from 'react';
import { FaCartPlus } from 'react-icons/fa';
import HeadingText from './HeadingText';
import image from '../assets/images/HeroSection.jpeg'

const products = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Herbal Product ${i + 1}`,
    price: `$${(9.99 + i).toFixed(2)}`,
    image: image, // Update paths as needed
}));

const FeaturedProducts = () => {
    return (
        <section className="py-20">
            <div className=" mx-auto">
                <HeadingText
                    title="Featured Herbal Products"
                    description="Explore our curated collection of premium herbal products, carefully selected for quality and efficacy."
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-3xl border border-gray-200 shadow-[0_10px_15px_-3px_rgba(16,185,129,0.25),0_4px_6px_-2px_rgba(16,185,129,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(5,150,105,0.4),0_10px_10px_-5px_rgba(5,150,105,0.2)] transition-shadow duration-400 p-6 flex flex-col items-center text-center"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-32 h-32 object-cover rounded-2xl mb-6 shadow-lg"
                            />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {product.name}
                            </h3>
                            <p className="text-green-700 font-semibold text-base mb-6">
                                {product.price}
                            </p>
                            <button className="flex items-center gap-3 mt-auto bg-green-700 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-green-800 shadow-md hover:shadow-lg transition-all duration-300">
                                <FaCartPlus size={18} />
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
