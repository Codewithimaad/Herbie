import { useState } from 'react';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'Chamomile', price: 5.99, quantity: 2, image: '/herbs/chamomile.jpg' },
        { id: '2', name: 'Mint Leaves', price: 3.49, quantity: 1, image: '/herbs/mint.jpg' },
    ]);

    const handleRemove = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(items =>
            items.map(item => (item.id === id ? { ...item, quantity: newQty } : item))
        );
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <section className="flex flex-col items-center justify-center py-28 space-y-6 text-center">
                <FiShoppingCart className="text-green-600 w-20 h-20" />
                <h2 className="text-3xl font-bold text-gray-700">Your cart is empty</h2>
                <Link
                    to="/products"
                    className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-lg font-semibold"
                >
                    Shop Now
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mb-10 tracking-tight">
                Your Cart
            </h2>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
                {/* Cart Items */}
                <div className="flex-1 space-y-6">
                    {cartItems.map(item => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                onError={(e) => (e.target.src = '/herbs/placeholder.jpg')}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border"
                            />

                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-green-700 text-lg font-bold mt-1">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Quantity Control */}
                                    <div className="flex items-center mt-4 sm:mt-0 border rounded-full overflow-hidden bg-gray-50 shadow-inner">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="p-2 px-3 text-green-600 hover:bg-green-100 transition"
                                            aria-label="Decrease quantity"
                                        >
                                            <FiMinus size={18} />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                            className="w-12 text-center border-0 bg-transparent focus:outline-none font-medium"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="p-2 px-3 text-green-600 hover:bg-green-100 transition"
                                            aria-label="Increase quantity"
                                        >
                                            <FiPlus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition self-start sm:self-auto"
                                aria-label={`Remove ${item.name}`}
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <aside className="w-full max-w-full lg:max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-green-100">
                    <h3 className="text-2xl font-bold mb-6 text-green-900">
                        Order Summary
                    </h3>
                    <div className="flex justify-between text-lg font-medium mb-4">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {/* Taxes/discounts can be added here */}
                    <hr className="my-4" />
                    <Link
                        to="/checkout"
                        className="block w-full text-center py-4 rounded-full bg-green-700 text-white font-semibold text-lg hover:bg-green-800 transition"
                    >
                        Proceed to Checkout
                    </Link>
                </aside>
            </div>
        </section>
    );
}
