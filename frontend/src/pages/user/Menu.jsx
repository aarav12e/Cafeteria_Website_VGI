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
            } catch {
                setError('Failed to load menu. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    useEffect(() => {
        const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 3500);
        return () => clearInterval(t);
    }, []);

    const categories = ['All', ...new Set(menu.map(item => item.category))];
    const filteredMenu = menu
        .filter(item => filter === 'All' || item.category === filter)
        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="pb-6">
            {/* Hero */}
            <div className="relative w-full h-60 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-2xl">
                {HERO_IMAGES.map((src, idx) => (
                    <img key={src} src={src} alt={`VGI Menu ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${idx === heroIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest shadow-lg">
                            VGI Campus Cafeteria
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">
                            Vishveshwarya<br />
                            <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">Group of Institution</span>
                        </h1>
                        <p className="text-white/70 text-sm md:text-base font-medium">Fresh • Tasty • Affordable 🍽️</p>
                    </motion.div>
                </div>
                {/* Dot nav */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {HERO_IMAGES.map((_, i) => (
                        <button key={i} onClick={() => setHeroIdx(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? 'w-8 bg-orange-400' : 'w-2 bg-white/40'}`} />
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full pl-11 pr-4 py-3.5 glass rounded-2xl border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm font-medium" />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)}
                        className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 ${filter === cat
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                                : 'glass border border-white/10 text-white/70 hover:border-orange-400/50 hover:text-white'
                            }`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 mb-5">
                <FaUtensils className="text-orange-400" />
                <h2 className="text-lg font-bold text-white">
                    {filter === 'All' ? 'All Dishes' : filter}
                    <span className="ml-2 text-sm font-normal text-white/40">({filteredMenu.length} items)</span>
                </h2>
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass rounded-3xl h-64 animate-pulse" />
                    ))}
                </div>
            )}
            {error && <p className="text-center py-16 text-red-400 font-semibold">{error}</p>}
            {!loading && !error && filteredMenu.length === 0 && (
                <div className="text-center py-16 text-white/30">
                    <FaUtensils size={40} className="mx-auto mb-4" />
                    <p className="font-semibold">No items found</p>
                </div>
            )}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenu.map(item => <FoodCard key={item._id} item={item} />)}
                </div>
            )}
        </div>
    );
};

export default Menu;
