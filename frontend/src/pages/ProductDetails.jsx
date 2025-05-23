import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Heart, ShieldCheck, Truck } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext'; // Add this import
import AddToCartButton from '../components/addToCart';



export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [mainImage, setMainImage] = useState('');
    const { backendUrl } = useAuth();
    const { addToCart, currency } = useCart(); // Get addToCart from cart context



    useEffect(() => {
        // Fetch product details by id from backend API
        async function fetchProduct() {
            try {
                const res = await fetch(`${backendUrl}/api/products/${id}`); // adjust URL to your backend route
                if (!res.ok) throw new Error('Failed to fetch product');
                const data = await res.json();
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className="text-center py-20">Loading product details...</div>;
    }

    const features = [
        { icon: <Truck size={18} />, text: "Free shipping on orders over PKR 1,399" },
        { icon: <ShieldCheck size={18} />, text: "100% organic & natural guarantee" },
    ];

    return (
        <section className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Product Image Gallery */}
                <div className="lg:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square mb-4 shadow-sm border border-gray-100">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                            onError={(e) => (e.target.src = '/herbs/placeholder.jpg')}
                        />
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        >
                            <Heart
                                size={24}
                                className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                            />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(img)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImage === img
                                    ? 'border-green-600 ring-2 ring-green-200'
                                    : 'border-gray-200 hover:border-green-400'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.target.src = '/herbs/placeholder.jpg')}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:w-1/2">
                    <div className="sticky top-24">
                        <div className="flex gap-2 mb-4">
                            {product.isOrganic && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Organic Certified
                                </span>
                            )}
                            {product.isBestSeller && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Best Seller
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">({product.reviewCount} reviews)</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-gray-900">{currency}{product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through ml-2">{currency}{product.originalPrice.toFixed(2)}</span>
                            )}
                            <p className={`text-sm mt-1 ${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
                                {product.inStock ? 'In stock & ready to ship' : 'Out of stock'}
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="space-y-3 mb-8">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center">
                                    <span className="text-green-600 mr-2">{feature.icon}</span>
                                    <span className="text-gray-600 text-sm">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex border border-gray-300 rounded-lg w-fit">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 text-center w-16">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <AddToCartButton id={id} quantity={quantity} size='medium' />


                            <button
                                className="flex-1 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-6 py-4 rounded-lg font-semibold text-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 items-center">
                            {/* Secure Payment Badge */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-sm text-gray-600">Secure Payment</span>
                            </div>

                            {/* Money Back Guarantee */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm text-gray-600">30-Day Guarantee</span>
                            </div>

                            {/* Organic Certified */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-sm text-gray-600">Organic Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional: Include Review Section if you have */}
            <ReviewSection productId={id} />
        </section>
    );
}
