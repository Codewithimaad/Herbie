
import { useState } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { Loader2, Check } from 'lucide-react';

export default function AddToCartButton({ id, quantity, name, price, size = 'medium', onClick, className = '' }) {
    const { addToCart } = useCart();
    const { token } = useAuth();
    const [status, setStatus] = useState('idle');

    const handleClick = async (e) => {
        e.stopPropagation();

        if (!token) {
            toast.error('Please log in to add items to your cart', {
                className: 'rounded-lg shadow-lg bg-gray-800 text-white',
                bodyClassName: 'text-sm',
            });
            if (onClick) onClick(e);
            return onClick(e);
        }

        setStatus('loading');
        try {
            await addToCart(id, quantity || 1);
            setStatus('added');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            console.error('Add to cart failed', err);
            toast.error('Failed to add product to cart', {
                className: 'rounded-lg shadow-lg bg-red-50 text-red-800',
                bodyClassName: 'text-sm',
            });
            setStatus('idle');
        }
        if (onClick) onClick(e);
    };

    // Size-specific styles
    const sizeStyles = {
        small: 'px-2 py-2 text-xs',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
    };

    // Base button styles
    const baseClassName = `flex items-center justify-center gap-2 font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed ${sizeStyles[size]} ${className}`;

    // State-specific styles
    const statusClassName = {
        idle: 'bg-gradient-to-r from-green-400 to-green-700 hover:from-green-500 hover:to-green-800',
        loading: 'bg-gradient-to-r from-green-600 to-green-700 animate-pulse',
        added: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
    };

    return (
        <button
            className={`${baseClassName} ${statusClassName[status]}`}
            aria-label={
                status === 'loading' ? 'Adding to cart' :
                    status === 'added' ? 'Added to cart' :
                        'Add to cart'
            }
            aria-busy={status === 'loading'}
            onClick={handleClick}
            disabled={status === 'loading' || status === 'added'}
        >
            {status === 'loading' && (
                <Loader2 className="animate-spin" size={size === 'small' ? 16 : 20} />
            )}
            {status === 'added' && (
                <Check className="animate-scale-in" size={size === 'small' ? 16 : 20} />
            )}
            <span>
                {status === 'loading' && 'Adding...'}
                {status === 'added' && 'Added'}
                {status === 'idle' && 'Add to Cart'}
            </span>
        </button>
    );
}