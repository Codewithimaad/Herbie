// src/components/CartItem.jsx
export default function CartItem({ item, onRemove, onQuantityChange }) {
    return (
        <div className="flex items-center border rounded p-4 bg-white shadow-sm">
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1 ml-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-green-700 font-bold">${item.price.toFixed(2)}</p>

                <div className="mt-2 flex items-center gap-2">
                    <label htmlFor={`qty-${item.id}`} className="text-sm">Qty:</label>
                    <input
                        type="number"
                        id={`qty-${item.id}`}
                        min="1"
                        value={item.quantity}
                        onChange={e => onQuantityChange(Number(e.target.value))}
                        className="w-16 border rounded px-2 py-1"
                    />
                </div>
            </div>

            <button
                onClick={onRemove}
                className="ml-4 text-red-600 hover:text-red-800 font-bold text-xl"
                aria-label={`Remove ${item.name} from cart`}
            >
                &times;
            </button>
        </div>
    );
}
