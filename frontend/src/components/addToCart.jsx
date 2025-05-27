import { useState } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';


export default function AddToCartButton({ id, quantity, name, price, size, onClick }) {
    const { addToCart } = useCart();
    const { token } = useAuth();
    const [status, setStatus] = useState('idle');

    const handleClick = async (e) => {
        e.stopPropagation();

        if (!token) {
            toast.error('Please log in to add items to your cart');
            if (onClick) onClick(e);
            return;
        }

        setStatus('loading');
        try {
            await addToCart(id, quantity);
            setStatus('added');

            // ✅ GA4 Add to Cart Event
            ReactGA.event('add_to_cart', {
                currency: 'PKR', // Or 'USD' etc.
                value: quantity * price, // total value of added items
                items: [{
                    item_id: id,
                    item_name: name, // optional but helpful
                    price: price,    // optional but helpful
                    quantity: quantity,
                }],
            });


            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            console.error('Add to cart failed', err);
            toast.error('Failed to add product to cart');
            setStatus('idle');
        }
        if (onClick) onClick(e);
    };



    // Define size-specific styles
    const sizeStyles = {
        small: 'px-6 py-3 text-sm',
        medium: 'px-6 py-4 text-lg',
        large: 'px-8 py-5 text-xl',
    };

    // Combine base styles with size-specific styles
    const buttonClassName = `flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60 ${sizeStyles[size] || sizeStyles.medium}`;

    return (
        <button
            className={buttonClassName}
            aria-label="Add to cart"
            onClick={handleClick}
            disabled={status === 'loading' || status === 'added'}
        >
            {status === 'loading' && 'Adding...'}
            {status === 'added' && 'Added'}
            {status === 'idle' && 'Add to Cart'}
        </button>
    );
}