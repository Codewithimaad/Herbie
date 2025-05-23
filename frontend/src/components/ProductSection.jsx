import React from 'react';
import PropTypes from 'prop-types';

const ProductSection = ({
    productName,
    description,
    benefits,
    imageSrc,
    imageAlt,
    ctaText,
    ctaLink
}) => {
    return (
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-green-50/50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-1/3 h-full bg-green-100/10 -skew-x-12 -translate-x-1/2"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-green-200/20 blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Section - More dynamic */}
                    <div className="relative group">
                        <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-green-200/30 border-8 border-white">
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"></div>
                        </div>
                        <div className="absolute -z-10 -inset-4 bg-gradient-to-tr from-green-100 to-blue-100 rounded-[3.5rem] opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Content Section - More polished */}
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                            {productName}
                        </h2>

                        {/* Description */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2">
                                <span className="w-4 h-0.5 bg-green-500"></span>
                                <span className="text-sm font-medium tracking-wider text-green-600 uppercase">Overview</span>
                            </div>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Benefits - More interactive */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center space-x-2">
                                <span className="w-4 h-0.5 bg-green-500"></span>
                                <span className="text-sm font-medium tracking-wider text-green-600 uppercase">Key Benefits</span>
                            </div>

                            {Array.isArray(benefits) && benefits.length > 0 ? (
                                <ul className="space-y-2">
                                    {benefits.map((benefit, index) => (
                                        <li
                                            key={index}
                                            className="p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-lg font-semibold text-gray-900">{benefit.title}</h4>
                                                    <p className="mt-1 text-gray-600">{benefit.description}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No benefits available for this product.</p>
                            )}
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
};

ProductSection.propTypes = {
    productName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    benefits: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
        })
    ).isRequired,
    imageSrc: PropTypes.string.isRequired,
    imageAlt: PropTypes.string.isRequired,
}

export default ProductSection;