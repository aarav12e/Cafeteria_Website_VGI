import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBan } from 'react-icons/fa';

const FoodCard = ({ item }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-orange-50">
                <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <FaBan size={10} /> Out of Stock
                        </span>
                    </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {item.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">{item.name}</h3>
                {item.description && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="text-lg font-extrabold text-orange-600">₹{item.price}</span>
                    <button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${item.available
                                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-orange-200 active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <FaShoppingCart size={12} />
                        Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FoodCard;
