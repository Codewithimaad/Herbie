import React from 'react';
import herbalHero from '../assets/images/HeroSection.jpeg'; // Replace with your actual image

const HeroSection = () => {
    return (
        <section
            className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: `url(${herbalHero})`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-green-600/30 z-0"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl text-white">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                    Discover Nature’s Healing Power
                </h1>
                <p className="text-lg md:text-xl mb-6 font-light drop-shadow-md">
                    Shop premium herbal remedies crafted with ancient wisdom and modern science.
                </p>
                <a
                    href="#shop"
                    className="inline-block bg-white text-green-800 hover:bg-green-100 font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md"
                >
                    Explore Our Products
                </a>
            </div>
        </section>
    );
};

export default HeroSection;
