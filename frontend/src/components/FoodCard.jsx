import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBan } from 'react-icons/fa';

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
    
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

    const hasVariants = item.variants && item.variants.length > 0;
    const currentPrice = hasVariants ? item.variants[selectedVariantIndex].price : item.price;

    const handleAddToCart = () => {
        if (hasVariants) {
            const variant = item.variants[selectedVariantIndex];
            addToCart({
                ...item,
                _id: `${item._id}-${variant.name}`,
                name: `${item.name} (${variant.name})`,
                price: variant.price
            });
        } else {
            addToCart(item);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="rounded-3xl overflow-hidden shadow-2xl flex flex-col group bg-[#0a0a0a] border border-white/10"
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-[#111]">
                <img
                    src={item.image || fallbackImg}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale hover:grayscale-0"
                    onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />

                {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-900/50 text-red-200 border border-red-900/50 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                            <FaBan size={10} /> Out of Stock
                        </span>
                    </div>
                )}

                <div className="absolute top-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                        {item.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-extrabold text-white mb-0.5 line-clamp-1">{item.name}</h3>
                {item.description && (
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                )}
                
                {item.variants && item.variants.length > 0 && (
                    <div className="mb-3">
                        <select 
                            value={selectedVariantIndex}
                            onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                            className="w-full bg-[#111] border border-white/10 text-white p-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-white"
                        >
                            {item.variants.map((v, idx) => (
                                <option key={idx} value={idx}>{v.name} - ₹{v.price}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                    <span className="text-lg font-black text-white">
                        ₹{currentPrice}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        disabled={!item.available}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${item.available
                                ? 'bg-white text-black shadow-md active:scale-95 hover:bg-gray-200'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <FaShoppingCart size={11} /> Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FoodCard;
