
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: [0.4, 0, 0.2, 1], // Custom easing for smoother feel
            delayChildren: 0.3,
            staggerChildren: 0.2,
        },
    },
};

const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -2 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 1, ease: [0.4, 0, 0.2, 1] },
    },
    hover: {
        scale: 1.05,
        rotate: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
};

const benefitVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
    hover: {
        scale: 1.03,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
        transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
};

const decorSkewVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: {
        opacity: 1,
        x: -50,
        transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
    },
};

const decorCircleVariants = {
    hidden: { opacity: 0, scale: 0.4 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.5,
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 1,
        },
    },
};

const ProductSection = ({ productName, description, benefits, imageSrc, imageAlt }) => {
    return (
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-green-50/50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Decorative elements with animation */}
            <motion.div
                className="absolute top-0 left-0 w-1/3 h-full bg-green-100/10 -skew-x-12 -translate-x-1/2"
                variants={decorSkewVariants}
                initial="hidden"
                animate="visible"
            ></motion.div>
            <motion.div
                className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-green-200/20 blur-3xl"
                variants={decorCircleVariants}
                initial="hidden"
                animate="visible"
            ></motion.div>

            <motion.div
                className="max-w-7xl mx-auto relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* Image Section - Equal height */}
                    <motion.div
                        className="relative group flex items-center justify-center"
                        variants={imageVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                    >
                        <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-green-200/30 border-8 border-white w-full h-full min-h-[400px] lg:min-h-[600px]">
                            <motion.img
                                src={imageSrc}
                                alt={imageAlt}
                                className="w-full h-full object-cover"
                                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"></div>
                        </div>
                        <motion.div
                            className="absolute -z-10 -inset-4 bg-gradient-to-tr from-green-100 to-blue-100 rounded-[3.5rem] opacity-70"
                            animate={{ opacity: [0.7, 1] }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            whileHover={{ opacity: 1 }}
                        ></motion.div>
                    </motion.div>

                    {/* Content Section - Equal height */}
                    <motion.div
                        className="space-y-8 flex flex-col justify-center h-full min-h-[400px] lg:min-h-[600px]"
                        variants={childVariants}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight bg-clip-text bg-gradient-to-r from-green-600 to-green-800"
                            variants={childVariants}
                        >
                            {productName}
                        </motion.h2>

                        {/* Description */}
                        <motion.div className="space-y-4" variants={childVariants}>
                            <div className="inline-flex items-center space-x-2">
                                <motion.span
                                    className="w-4 h-0.5 bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: 16, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
                                ></motion.span>
                                <span className="text-sm font-medium tracking-wider text-green-600 uppercase">Overview</span>
                            </div>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{description}</p>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div className="space-y-6" variants={childVariants}>
                            <div className="inline-flex items-center space-x-2">
                                <motion.span
                                    className="w-4 h-0.5 bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: 16, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
                                ></motion.span>
                                <span className="text-sm font-medium tracking-wider text-green-600 uppercase">Key Benefits</span>
                            </div>

                            {Array.isArray(benefits) && benefits.length > 0 ? (
                                <ul className="space-y-2">
                                    {benefits.map((benefit, index) => (
                                        <motion.li
                                            key={index}
                                            className="p-4 rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm"
                                            variants={benefitVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                        >
                                            <div className="flex items-start">
                                                <motion.div
                                                    className="flex-shrink-0 mt-1"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                                                >
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                </motion.div>
                                                <div className="ml-4">
                                                    <h4 className="text-lg font-semibold text-gray-900">{benefit.title}</h4>
                                                    <p className="mt-1 text-gray-600">{benefit.description}</p>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No benefits available for this product.</p>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
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
};

export default ProductSection;
