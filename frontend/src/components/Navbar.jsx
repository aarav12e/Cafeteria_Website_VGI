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
        <nav className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <FaUtensils className="text-white text-sm" />
                    </div>
                    <div className="leading-tight">
                        <span className="block text-xs font-semibold text-gray-500 tracking-wide uppercase">VGI</span>
                        <span className="block text-sm font-extrabold text-orange-600 leading-none">Cafeteria</span>
                    </div>
                </Link>

                {/* Center Title */}
                <div className="text-center hidden lg:block">
                    <h1 className="text-base font-bold text-gray-800">Vishveshwarya Group of Institution</h1>
                    <p className="text-xs text-orange-500 font-medium">Campus Cafeteria</p>
                </div>

                {/* Nav Links */}
                <div className="flex items-center space-x-6">
                    <Link to="/menu" className={`font-semibold text-sm transition ${pathname === '/menu' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}>
                        Menu
                    </Link>
                    <Link to="/myorders" className={`font-semibold text-sm transition ${pathname === '/myorders' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}>
                        My Orders
                    </Link>

                    {isAdmin ? (
                        <Link to="/admin/dashboard" className="font-semibold text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition">
                            Admin Panel
                        </Link>
                    ) : (
                        <Link to="/admin-login" className="font-semibold text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-orange-100 hover:text-orange-600 transition">
                            Admin Login
                        </Link>
                    )}

                    <Link to="/cart" className="relative p-2 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                        <FaShoppingCart className="text-orange-600" size={18} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <Link to="/auth" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all">
                            Sign In
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
