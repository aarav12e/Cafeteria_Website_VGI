import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBan, FaFire } from 'react-icons/fa';

const FoodCard = ({ item }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="glass-white rounded-3xl overflow-hidden shadow-xl hover:shadow-orange-500/20 hover:shadow-2xl transition-all duration-300 flex flex-col group"
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'; }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                            <FaBan size={10} /> Out of Stock
                        </span>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="glass text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 shadow">
                        {item.category}
                    </span>
                </div>

                {/* Popular badge (optional) */}
                {item.available && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <FaFire size={9} /> Hot
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-extrabold text-gray-900 mb-0.5 line-clamp-1">{item.name}</h3>
                {item.description && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-lg font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            ₹{item.price}
                        </span>
                    </div>
                    <button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${item.available
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-orange-400/50 active:scale-95 hover:scale-105'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <FaShoppingCart size={11} />
                        Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FoodCard;
