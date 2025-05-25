import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RotateCw } from 'lucide-react';
import axios from 'axios';
import HeadingText from "../components/HeadingText";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const accordionVariants = {
    closed: { height: 0, opacity: 0 },
    open: {
        height: "auto",
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25
        }
    }
};

export default function FAQsPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('http://localhost:5000/api/faqs/for-all');
                const faqsData = response.data.faqs || response.data;
                if (!Array.isArray(faqsData)) {
                    throw new Error('Invalid response format: FAQs is not an array');
                }
                setFaqs(faqsData);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to load FAQs';
                setError(errorMessage);
                console.error('Fetch FAQs error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="px-4 py-12 md:px-8 mx-auto max-w-7xl"
        >
            <motion.div variants={itemVariants}>
                <HeadingText
                    title="Frequently Asked Questions"
                    description="Find answers to common questions about your shopping experience."
                />
            </motion.div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 space-y-4"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="text-emerald-500"
                        >
                            <RotateCw className="h-8 w-8" />
                        </motion.div>
                        <p className="text-gray-500">Loading FAQs...</p>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 text-center space-y-4"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full">
                            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-red-500">{error}</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm hover:shadow-md"
                        >
                            Try Again
                        </motion.button>
                    </motion.div>
                ) : faqs.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 text-center space-y-4"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full">
                            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No FAQs available at the moment</p>
                    </motion.div>
                ) : (
                    <motion.section
                        key="content"
                        variants={containerVariants}
                        className="space-y-6 mt-8"
                    >
                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl font-semibold text-emerald-700 mb-4 pb-2 border-b border-emerald-100">
                                General Questions
                            </h2>
                        </motion.div>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <motion.button
                                        initial={false}
                                        onClick={() => toggleAccordion(index)}
                                        className={`flex items-center justify-between w-full px-6 py-4 text-left text-base font-medium transition-colors ${activeIndex === index ? 'text-emerald-600 bg-emerald-50' : 'text-gray-800 hover:bg-gray-50'}`}
                                    >
                                        <span>{faq.question}</span>
                                        <motion.div
                                            animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="h-5 w-5 text-current" />
                                        </motion.div>
                                    </motion.button>

                                    <AnimatePresence>
                                        {activeIndex === index && (
                                            <motion.div
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                variants={accordionVariants}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 py-4 text-gray-600 bg-gray-50 border-t border-gray-100">
                                                    {faq.answer || "No answer provided"}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
}