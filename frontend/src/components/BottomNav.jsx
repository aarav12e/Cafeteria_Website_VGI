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

    if (pathname === '/auth' || pathname === '/admin-login') return null;

    const navItems = [
        { path: '/menu', icon: <FaUtensils size={18} />, label: 'Menu' },
        { path: '/cart', icon: <FaShoppingCart size={18} />, label: 'Cart', badge: cartItems.length },
        { path: isSignedIn ? '/myorders' : '/auth', icon: <FaUser size={18} />, label: isSignedIn ? 'Orders' : 'Login' },
        { path: isAdmin ? '/admin/dashboard' : '/admin-login', icon: <FaTachometerAlt size={18} />, label: 'Admin' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
            <div className="glass border-t border-white/10 px-2 py-2 flex justify-around items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                    return (
                        <Link key={item.label} to={item.path}
                            className="flex flex-col items-center py-1.5 px-3">
                            <div className={`relative p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-500/20' : 'hover:bg-white/10'}`}>
                                <span className={isActive ? 'text-orange-400' : 'text-white/50'}>
                                    {item.icon}
                                </span>
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'text-orange-400' : 'text-white/40'}`}>
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
