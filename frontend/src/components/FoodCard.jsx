import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBan, FaFire } from 'react-icons/fa';

// The 3 menu images from the public folder — used as fallbacks
const PUBLIC_IMAGES = ['/1.jpeg', '/2.jpeg', '/3.jpeg'];

// Pick a deterministic public image based on item name (no random flicker on re-render)
const getPublicImage = (name = '') => {
    const code = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return PUBLIC_IMAGES[code % PUBLIC_IMAGES.length];
};

const FoodCard = ({ item }) => {
    const { addToCart } = useCart();
    const fallbackImg = getPublicImage(item.name);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="rounded-3xl overflow-hidden shadow-2xl flex flex-col group"
            style={{ background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(10px)' }}
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                    src={item.image || fallbackImg}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                            <FaBan size={10} /> Out of Stock
                        </span>
                    </div>
                )}

                <div className="absolute top-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                        {item.category}
                    </span>
                </div>
                {item.available && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-lg font-black"
                        style={{ background: 'linear-gradient(to right, #f97316, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ₹{item.price}
                    </span>
                    <button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${item.available
                                ? 'text-white shadow-md hover:shadow-orange-400/50 active:scale-95 hover:scale-105'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        style={item.available ? { background: 'linear-gradient(to right, #f97316, #dc2626)' } : {}}
                    >
                        <FaShoppingCart size={11} /> Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FoodCard;
