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
        <nav className="hidden md:block sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/10"
            style={{ backdropFilter: 'blur(20px)' }}>
            <div className="container mx-auto px-6 py-3.5 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 bg-white/5 group-hover:bg-white/10 transition-colors">
                        <FaUtensils className="text-white text-sm" />
                    </div>
                    <div className="leading-tight">
                        <span className="block text-[10px] font-black tracking-widest uppercase text-gray-400">VGI</span>
                        <span className="block text-sm font-extrabold text-white leading-none">Cafeteria</span>
                    </div>
                </Link>

                {/* Center Title */}
                <div className="text-center hidden lg:block">
                    <p className="text-sm font-bold text-gray-200 tracking-wide">Vishveshwarya Group of Institution</p>
                    <p className="text-[11px] font-semibold tracking-wider text-gray-500">Campus Cafeteria</p>
                </div>

                {/* Nav Links */}
                <div className="flex items-center space-x-5">
                    <Link to="/menu"
                        className={`font-semibold text-sm transition-all hover:text-white ${pathname === '/menu' ? 'text-white' : 'text-gray-400'}`}>
                        Menu
                    </Link>
                    <Link to="/myorders"
                        className={`font-semibold text-sm transition-all hover:text-white ${pathname === '/myorders' ? 'text-white' : 'text-gray-400'}`}>
                        My Orders
                    </Link>

                    {/* Admin panel only shows when logged in as admin */}
                    {isAdmin && (
                        <Link to="/admin/dashboard"
                            className="text-xs font-bold px-4 py-1.5 rounded-full text-black bg-white hover:bg-gray-200 transition-all">
                            Admin Panel
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart" className="relative p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                        <FaShoppingCart className="text-white" size={17} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
                    <SignedOut>
                        <Link to="/auth"
                            className="text-black bg-white px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all">
                            Sign In
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
