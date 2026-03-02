import { Link, useLocation } from 'react-router-dom';
import { FaUtensils, FaShoppingCart, FaUser, FaTachometerAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useUser } from '@clerk/clerk-react';
import { isAdminLoggedIn } from '../hooks/useAdminAuth';

const BottomNav = () => {
    const { pathname } = useLocation();
    const { cartItems } = useCart();
    const { isSignedIn } = useUser();
    const isAdmin = isAdminLoggedIn();

    // Hide on auth pages
    if (pathname === '/auth' || pathname === '/admin-login') return null;

    const navItems = [
        { path: '/menu', icon: <FaUtensils size={18} />, label: 'Menu' },
        { path: '/cart', icon: <FaShoppingCart size={18} />, label: 'Cart', badge: cartItems.length },
        { path: isSignedIn ? '/myorders' : '/auth', icon: <FaUser size={18} />, label: isSignedIn ? 'Orders' : 'Sign In' },
        // Admin tab ONLY shows if logged in as admin
        ...(isAdmin ? [{ path: '/admin/dashboard', icon: <FaTachometerAlt size={18} />, label: 'Admin' }] : []),
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
            <div className="px-2 py-2 flex justify-around items-center"
                style={{ background: 'rgba(10,10,24,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                    return (
                        <Link key={item.label} to={item.path} className="flex flex-col items-center py-1.5 px-4">
                            <div className={`relative p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-500/20' : ''}`}>
                                <span style={{ color: isActive ? '#f97316' : 'rgba(255,255,255,0.4)' }}>
                                    {item.icon}
                                </span>
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] mt-0.5 font-semibold"
                                style={{ color: isActive ? '#f97316' : 'rgba(255,255,255,0.3)' }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
