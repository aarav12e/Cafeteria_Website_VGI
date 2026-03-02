import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaMoneyBillWave, FaShoppingBag, FaCheckCircle, FaClock, FaUtensils, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../hooks/useAdminAuth';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const axios = useAxios();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin-login');
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/orders/admin');
                const totalOrders = data.length;
                const totalRevenue = data.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
                const pendingOrders = data.filter(o => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled').length;
                const completedOrders = data.filter(o => o.orderStatus === 'completed').length;
                setStats({ totalOrders, totalRevenue, pendingOrders, completedOrders });
                setRecentOrders(data.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-3xl h-28 animate-pulse" />)}
            </div>
        </div>
    );

    const cards = [
        { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: <FaMoneyBillWave size={22} />, from: 'from-green-400', to: 'to-emerald-600' },
        { title: 'Total Orders', value: stats.totalOrders, icon: <FaShoppingBag size={22} />, from: 'from-blue-400', to: 'to-blue-600' },
        { title: 'Active Orders', value: stats.pendingOrders, icon: <FaClock size={22} />, from: 'from-orange-400', to: 'to-orange-600' },
        { title: 'Completed', value: stats.completedOrders, icon: <FaCheckCircle size={22} />, from: 'from-purple-400', to: 'to-purple-600' },
    ];

    const STATUS_COLORS = {
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        placed: 'bg-blue-100 text-blue-700',
        preparing: 'bg-yellow-100 text-yellow-700',
        ready: 'bg-purple-100 text-purple-700',
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h2>
                    <p className="text-gray-500 mt-1 text-sm">Vishveshwarya Group of Institution — Cafeteria Management</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition border border-red-100"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-3xl shadow-md p-5 flex flex-col gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.from} ${card.to} flex items-center justify-center text-white shadow-md`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium">{card.title}</p>
                            <h3 className="text-2xl font-extrabold text-gray-800">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Link to="/admin/menu" className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white flex items-center gap-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                        <FaUtensils size={24} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-lg">Manage Menu</h3>
                        <p className="text-white/80 text-sm">Add, edit or remove dishes</p>
                    </div>
                </Link>
                <Link to="/admin/orders" className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl p-6 text-white flex items-center gap-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                        <FaListAlt size={24} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-lg">View Orders</h3>
                        <p className="text-white/80 text-sm">Track & update order status</p>
                    </div>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-3xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                {recentOrders.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map(order => (
                            <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="font-bold text-sm text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-xs text-gray-400">{order.userId?.name || 'Guest'} · {order.items.length} item(s)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-orange-500 text-sm">₹{order.totalAmount}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
