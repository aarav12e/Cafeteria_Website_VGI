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
        <nav className="hidden md:block sticky top-0 z-50 glass border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-6 py-3.5 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg glow-orange group-hover:scale-105 transition-transform">
                        <FaUtensils className="text-white text-sm" />
                    </div>
                    <div className="leading-tight">
                        <span className="block text-[10px] font-bold text-orange-400 tracking-widest uppercase">VGI</span>
                        <span className="block text-sm font-extrabold text-white leading-none">Cafeteria</span>
                    </div>
                </Link>

                {/* Center */}
                <div className="text-center hidden lg:block">
                    <h1 className="text-sm font-bold text-white/90 tracking-wide">Vishveshwarya Group of Institution</h1>
                    <p className="text-[11px] text-orange-400 font-medium tracking-wide">Campus Cafeteria</p>
                </div>

                {/* Nav Links */}
                <div className="flex items-center space-x-5">
                    {[
                        { to: '/menu', label: 'Menu' },
                        { to: '/myorders', label: 'My Orders' },
                    ].map(link => (
                        <Link key={link.to} to={link.to}
                            className={`font-semibold text-sm transition-all ${pathname === link.to ? 'text-orange-400' : 'text-white/70 hover:text-white'}`}>
                            {link.label}
                        </Link>
                    ))}

                    {isAdmin ? (
                        <Link to="/admin/dashboard"
                            className="text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-purple-500/40 hover:scale-105 transition-all">
                            Admin Panel
                        </Link>
                    ) : (
                        <Link to="/admin-login"
                            className="text-xs font-bold px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-orange-400 transition-all">
                            Admin Login
                        </Link>
                    )}

                    <Link to="/cart" className="relative p-2 rounded-xl bg-white/10 hover:bg-orange-500/20 border border-white/10 transition-all">
                        <FaShoppingCart className="text-white" size={17} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
                    <SignedOut>
                        <Link to="/auth" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-all">
                            Sign In
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
