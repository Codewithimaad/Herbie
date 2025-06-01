import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import HeadingText from '../components/HeadingText';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaChevronDown, FaChevronUp, FaFire, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import ReactGA from 'react-ga4';
import { useNavigate } from 'react-router-dom';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { backendUrl } = useAuth();
    const { currency } = useCart();
    const navigate = useNavigate();

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/products`);
                let fetchedProducts = Array.isArray(res.data) ? res.data : res.data.products || [];
                setProducts(fetchedProducts);
            } catch (err) {
                console.error('Failed to load products:', err);
                setProducts([]);
            }
        };
        fetchProducts();
    }, [backendUrl]);

    // Handle product click with GA4 tracking
    const handleProductClick = (product) => {
        ReactGA.event({
            category: 'Product Interaction',
            action: 'click',
            label: product.name,
            value: product.price,
        });
        navigate(`/product/${product._id}`);
    };

    // Extract categories
    const categories = ['All', 'New Arrivals', 'Best Sellers', ...new Set(products.map(p => p.category || 'Other'))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesCategory = true;
        if (selectedCategory === 'Best Sellers') {
            matchesCategory = product.isBestSeller;
        } else if (selectedCategory === 'New Arrivals') {
            matchesCategory = product.isNewArrival;
        } else if (selectedCategory !== 'All') {
            matchesCategory = product.category === selectedCategory;
        }
        return matchesSearch && matchesCategory;
    });

    const visibleProducts = showMore ? filteredProducts : filteredProducts.slice(0, 8);

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
            <HeadingText
                title="Our Herbal Collection"
                description="Discover premium quality herbs sourced from organic farms to enhance your health and wellness naturally."
            />
            {/* Search and Filters */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search herbs..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FaFilter />
                        Filters
                        {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close filters"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Categories</h4>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <motion.button
                                            key={category}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${selectedCategory === category
                                                ? 'bg-green-600 text-white border-green-600 shadow-md'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {category === 'Best Sellers'}
                                            {category === 'New Arrivals'}
                                            {category}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional filter sections can be added here */}
                            {/* <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Price Range</h4>
                ...
            </div> */}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Clear all
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                        {visibleProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                                className="transform hover:-translate-y-2 transition-all duration-300"
                            />
                        ))}
                    </div>
                    {filteredProducts.length > 8 && (
                        <div className="text-center mb-16">
                            <button
                                onClick={() => setShowMore(prev => !prev)}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg"
                            >
                                {showMore ? 'Show Less' : 'View All Products'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            )}
        </section>
    );
}
