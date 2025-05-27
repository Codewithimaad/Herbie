
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

// Animation variants
const panelVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delayChildren: 0.3, staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
    hover: {
        scale: 1.02,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
};

const errorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const AnalyticsPanel = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { backendUrl, token } = useAdmin();
    const [activeUsers, setActiveUsers] = useState('0');


    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [pagesRes, usersRes] = await Promise.all([
                    axios.get(`${backendUrl}/api/analytics/most-viewed-pages`),
                    axios.get(`${backendUrl}/api/analytics/active-users`)
                ]);
                console.log('Google Analytic Pages:', pagesRes.data);
                console.log('Active Users:', usersRes.data.activeUsers);
                setPages(pagesRes.data);
                setActiveUsers(usersRes.data.activeUsers);
            } catch (err) {
                setError('Failed to load analytics');
                console.error('Analytics fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [backendUrl]);


    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchAnalytics();
    };

    return (
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-green-50/50 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Decorative background */}
            <motion.div
                className="absolute top-0 left-0 w-1/3 h-full bg-green-100/10 -skew-x-12 -translate-x-1/2"
                initial={{ opacity: 0, x: -150 }}
                animate={{ opacity: 1, x: -50, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
            ></motion.div>
            <motion.div
                className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-green-200/20 blur-3xl"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 },
                }}
            ></motion.div>

            <motion.div
                className="max-w-7xl mx-auto relative"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight bg-clip-text bg-gradient-to-r from-green-600 to-green-800 mb-8">
                    Active Users
                </h2>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg mb-6">
                    <motion.div
                        className="text-center"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-xl font-semibold text-green-700">
                            👥 Active Users: <span className="font-bold">{activeUsers}</span>
                        </p>
                    </motion.div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight bg-clip-text bg-gradient-to-r from-green-600 to-green-800 mb-8">
                    Top 10 Most Viewed Pages
                </h2>

                <AnimatePresence>
                    {loading ? (
                        <motion.div
                            className="flex items-center justify-center h-64"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-600 text-lg">Loading analytics...</p>
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            className="flex flex-col items-center justify-center h-64 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <p className="text-red-600 text-lg mb-4">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                            >
                                Retry
                            </button>
                        </motion.div>
                    ) : (
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg">
                            {pages.length === 0 ? (
                                <motion.p
                                    className="text-gray-600 text-center py-8"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    No data available yet
                                </motion.p>
                            ) : (
                                <ul className="space-y-4">
                                    {pages.map((page, i) => (
                                        <motion.li
                                            key={i}
                                            className="p-4 rounded-lg border border-gray-100 bg-white/30 hover:bg-white/70 transition-all duration-300"
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-green-600 font-semibold">{i + 1}.</span>
                                                    <p className="text-gray-900 font-medium">{page.path}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">{page.views} views</span>
                                                    <motion.div
                                                        className="w-2 h-2 rounded-full bg-green-500"
                                                        animate={{ scale: [1, 1.3, 1] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

AnalyticsPanel.propTypes = {
    // No props are directly passed to this component, but you could add PropTypes if needed
};

export default AnalyticsPanel;