// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    return (
        <div className="border rounded-lg shadow-sm hover:shadow-md transition p-4 bg-white flex flex-col">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-green-700 font-bold mt-auto">${product.price.toFixed(2)}</p>
            <Link
                to={`/product/${product._id}`}
                className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
            >
                View Details
            </Link>
        </div>
    );
}
