import { useEffect, useState } from 'react';
import axios from 'axios';
import FoodCard from '../../components/FoodCard';
import { FaSearch, FaUtensils } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HERO_IMAGES = ['/1.jpeg', '/2.jpeg', '/3.jpeg'];

const Menu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [heroIdx, setHeroIdx] = useState(0);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/menu');
                setMenu(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load menu. Please try again later.');
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // Auto-cycle hero images
    useEffect(() => {
        const timer = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 3500);
        return () => clearInterval(timer);
    }, []);

    const categories = ['All', ...new Set(menu.map(item => item.category))];

    const filteredMenu = menu
        .filter(item => filter === 'All' || item.category === filter)
        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="pb-6">
            {/* Hero Banner */}
            <div className="relative w-full h-56 md:h-72 rounded-3xl overflow-hidden mb-8 shadow-xl">
                {HERO_IMAGES.map((src, idx) => (
                    <img
                        key={src}
                        src={src}
                        alt={`VGI Cafeteria Menu ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === heroIdx ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-8">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                            VGI Campus Cafeteria
                        </span>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                            Vishveshwarya Group<br />
                            <span className="text-orange-400">of Institution</span>
                        </h1>
                        <p className="text-white/80 text-sm md:text-base">Fresh. Tasty. Affordable. 🍽️</p>
                    </motion.div>
                </div>
                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {HERO_IMAGES.map((_, idx) => (
                        <button key={idx} onClick={() => setHeroIdx(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === heroIdx ? 'bg-orange-400 w-6' : 'bg-white/50'}`} />
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm font-medium"
                />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm border transition-all duration-200 ${filter === cat
                                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-2 mb-5">
                <FaUtensils className="text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">
                    {filter === 'All' ? 'All Dishes' : filter}
                    <span className="ml-2 text-sm font-normal text-gray-400">({filteredMenu.length} items)</span>
                </h2>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <div className="text-center py-16">
                    <p className="text-red-500 font-semibold">{error}</p>
                </div>
            )}

            {!loading && !error && filteredMenu.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <FaUtensils size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-semibold">No items found</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenu.map(item => (
                        <FoodCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;
