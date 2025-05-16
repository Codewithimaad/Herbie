import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import HeadingText from '../components/HeadingText';
import { FaFilter, FaSearch, FaChevronDown, FaChevronUp, FaFire, FaLeaf } from 'react-icons/fa';
import image from '../assets/images/HeroSection.jpeg';

const allProducts = [
    {
        _id: '1',
        name: 'Organic Chamomile Flowers',
        price: 5.99,
        originalPrice: 7.99,
        image: image,
        rating: 4.5,
        reviews: 128,
        category: 'Tea Herbs',
        isFeatured: true,
        isBestSeller: true
    },
    {
        _id: '2',
        name: 'Peppermint Leaves',
        price: 3.49,
        image: image,
        rating: 4.2,
        reviews: 87,
        category: 'Culinary Herbs',
        isNew: true
    },
    {
        _id: '3',
        name: 'Premium Lavender Buds',
        price: 6.99,
        originalPrice: 8.99,
        image: image,
        rating: 4.8,
        reviews: 215,
        category: 'Aromatherapy',
        isFeatured: true,
        isBestSeller: true
    },
    {
        _id: '4',
        name: 'Echinacea Root',
        price: 7.99,
        image: image,
        rating: 4.3,
        reviews: 64,
        category: 'Medicinal Herbs'
    },
    {
        _id: '5',
        name: 'Rosemary Leaves',
        price: 4.99,
        image: image,
        rating: 4.6,
        reviews: 176,
        category: 'Culinary Herbs',
        isNew: true
    },
    {
        _id: '6',
        name: 'Lemon Thyme',
        price: 4.49,
        originalPrice: 5.99,
        image: image,
        rating: 4.4,
        reviews: 92,
        category: 'Culinary Herbs',
        isNew: true
    },
    {
        _id: '7',
        name: 'Holy Basil (Tulsi)',
        price: 5.49,
        image: image,
        rating: 4.7,
        reviews: 203,
        category: 'Medicinal Herbs',
        isBestSeller: true
    },
    {
        _id: '8',
        name: 'Dandelion Root',
        price: 6.49,
        originalPrice: 7.99,
        image: image,
        rating: 4.1,
        reviews: 53,
        category: 'Medicinal Herbs',
        isNew: true
    }
];



export default function Products() {
    const [showMore, setShowMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'New Arrivals', 'Best Sellers', ...new Set(allProducts.map(product => product.category))];

    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
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

            {/* Search and Filter Bar */}
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

                {/* Expanded Filters */}
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

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                        {visibleProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                className="transform hover:-translate-y-2 transition-all duration-300"
                            />
                        ))}
                    </div>

                    {/* Show More/Less Button */}
                    {filteredProducts.length > 8 && (
                        <div className="text-center mb-16">
                            <button
                                onClick={() => setShowMore((prev) => !prev)}
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