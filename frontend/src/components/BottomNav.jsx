import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaShoppingCart, FaUser, FaTachometerAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useUser } from '@clerk/clerk-react';

const BottomNav = () => {
    const { pathname } = useLocation();
    const { cartItems } = useCart();
    const { isSignedIn, user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin' || user?.emailAddresses[0]?.emailAddress?.includes('admin');

    if (pathname === '/auth') return null;

    const navItems = [
        { path: '/menu', icon: <FaUtensils size={19} />, label: 'Menu' },
        { path: '/cart', icon: <FaShoppingCart size={19} />, label: 'Cart', badge: cartItems.length },
        { path: isSignedIn ? '/myorders' : '/auth', icon: <FaUser size={19} />, label: isSignedIn ? 'Orders' : 'Login' },
    ];

    if (isAdmin) {
        navItems.push({ path: '/admin/dashboard', icon: <FaTachometerAlt size={19} />, label: 'Admin' });
    }

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-t-3xl px-4 py-2 flex justify-around items-center md:hidden z-50">
            {navItems.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                return (
                    <Link
                        key={item.label}
                        to={item.path}
                        className="flex flex-col items-center py-2 px-3 min-w-[56px]"
                    >
                        <div className={`relative p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-100' : ''}`}>
                            <span className={isActive ? 'text-orange-600' : 'text-gray-400'}>
                                {item.icon}
                            </span>
                            {item.badge > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
