import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import HeadingText from '../components/HeadingText';
import {
    FaFilter, FaSearch, FaChevronDown,
    FaChevronUp, FaFire, FaLeaf
} from 'react-icons/fa';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { backendUrl } = useAuth();
    const { currency } = useCart();

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/products`);
                let fetchedProducts = [];

                if (Array.isArray(res.data)) {
                    fetchedProducts = res.data;
                } else if (Array.isArray(res.data.products)) {
                    fetchedProducts = res.data.products;
                } else {
                    console.warn('Expected "products" to be an array.');
                }

                setProducts(fetchedProducts);
            } catch (err) {
                console.error('Failed to load products:', err);
                setProducts([]);
            }
        };
        fetchProducts();
    }, [backendUrl]);

    // Extract categories
    const categories = ['All', 'New Arrivals', 'Best Sellers', ...new Set(products.map(p => p.category || 'Other'))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesCategory = true;

        if (selectedCategory === 'Best Sellers') {
            matchesCategory = product.isBestSeller;
        } else if (selectedCategory === 'New Arrivals') {
            matchesCategory = product.isNew;
        } else if (selectedCategory !== 'All') {
            matchesCategory = product.category === selectedCategory;
        }

        return matchesSearch && matchesCategory;
    });

    const visibleProducts = showMore ? filteredProducts : filteredProducts.slice(0, 8);




    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

                {/* Filter Categories */}
                {showFilters && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="font-medium text-lg mb-4">Filter by Category</h3>
                        <div className="flex flex-wrap gap-3">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${selectedCategory === category
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {category === 'Best Sellers' && <FaFire className="text-amber-500" />}
                                    {category === 'New Arrivals' && <FaLeaf className="text-green-500" />}
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
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
