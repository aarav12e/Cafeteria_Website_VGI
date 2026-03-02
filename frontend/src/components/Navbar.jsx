import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FaShoppingCart, FaUtensils } from 'react-icons/fa';
import { isAdminLoggedIn } from '../hooks/useAdminAuth';

const Navbar = () => {
    const { cartItems } = useCart();
    const { pathname } = useLocation();
    const isAdmin = isAdminLoggedIn();

    return (
        <nav className="hidden md:block sticky top-0 z-50"
            style={{ background: 'rgba(10,10,24,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="container mx-auto px-6 py-3.5 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
                        style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}>
                        <FaUtensils className="text-white text-sm" />
                    </div>
                    <div className="leading-tight">
                        <span className="block text-[10px] font-black tracking-widest uppercase" style={{ color: '#f97316' }}>VGI</span>
                        <span className="block text-sm font-extrabold text-white leading-none">Cafeteria</span>
                    </div>
                </Link>

                {/* Center Title */}
                <div className="text-center hidden lg:block">
                    <p className="text-sm font-bold text-white/80 tracking-wide">Vishveshwarya Group of Institution</p>
                    <p className="text-[11px] font-semibold tracking-wider" style={{ color: '#f97316' }}>Campus Cafeteria</p>
                </div>

                {/* Nav Links */}
                <div className="flex items-center space-x-5">
                    <Link to="/menu"
                        className="font-semibold text-sm transition-all"
                        style={{ color: pathname === '/menu' ? '#f97316' : 'rgba(255,255,255,0.65)' }}>
                        Menu
                    </Link>
                    <Link to="/myorders"
                        className="font-semibold text-sm transition-all"
                        style={{ color: pathname === '/myorders' ? '#f97316' : 'rgba(255,255,255,0.65)' }}>
                        My Orders
                    </Link>

                    {/* Admin panel only shows when logged in as admin */}
                    {isAdmin && (
                        <Link to="/admin/dashboard"
                            className="text-xs font-bold px-4 py-1.5 rounded-full text-white transition-all"
                            style={{ background: 'linear-gradient(to right, #7c3aed, #4f46e5)' }}>
                            Admin Panel
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart" className="relative p-2 rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <FaShoppingCart className="text-white" size={17} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
                    <SignedOut>
                        <Link to="/auth"
                            className="text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-all"
                            style={{ background: 'linear-gradient(to right, #f97316, #dc2626)' }}>
                            Sign In
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
