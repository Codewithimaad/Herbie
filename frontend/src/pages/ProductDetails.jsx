import { useParams } from 'react-router-dom';
import { useState } from 'react';
import image1 from '../assets/images/HeroSection.jpeg';
import image2 from '../assets/images/Herb1.webp';
import image3 from '../assets/images/HeroSection.jpeg';
import image4 from '../assets/images/HeroSection.jpeg';

export default function ProductDetails() {
    const { id } = useParams();

    const images = [image1, image2, image3, image4];
    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <section className="px-6 py-10 mt-12">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 tracking-tight">
                Product Details
            </h2>

            <p className="mb-8 text-gray-600 text-sm uppercase tracking-widest">
                Product ID: <span className="font-semibold text-green-700">{id}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Product Image Section */}
                <div className="md:w-1/2 space-y-4">
                    {/* Main Image */}
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <img
                            src={mainImage}
                            alt={`Herb ${id}`}
                            className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => (e.target.src = '/herbs/placeholder.jpg')}
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-4">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-transform duration-200 ${mainImage === img
                                    ? 'border-green-600 scale-105'
                                    : 'border-gray-300 hover:border-green-400'
                                    }`}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-wide">
                            Herb Name Placeholder
                        </h3>

                        <p className="text-3xl font-extrabold text-green-700 mb-6">$9.99</p>

                        <p className="text-gray-700 leading-relaxed text-lg mb-8">
                            This is a detailed description of the herb. Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit. Curabitur vehicula feugiat justo,
                            vel consequat nulla cursus ut. Praesent non suscipit arcu.
                        </p>
                    </div>

                    <button
                        className="self-start bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-transform transform hover:scale-105"
                        aria-label="Add to cart"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </section>
    );
}
