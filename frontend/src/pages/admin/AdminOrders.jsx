import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaSync } from 'react-icons/fa';

const STATUS_COLORS = {
    completed: 'bg-white/10 text-white border border-white/20',
    cancelled: 'bg-red-900/50 text-red-200 border border-red-900/50',
    placed: 'bg-white/10 text-white border border-white/20',
    preparing: 'bg-white/10 text-white border border-white/20',
    ready: 'bg-white/10 text-white border border-white/20',
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const axios = useAxios();

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/orders/admin');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/orders/${id}/status`, { orderStatus: status });
            fetchOrders();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

    if (loading) return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="bg-white/5 rounded-3xl h-20 animate-pulse border border-white/10" />)}
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-3xl font-extrabold text-white">Manage Orders</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{orders.length} total orders</p>
                </div>
                <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] rounded-2xl border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5 shadow-sm transition">
                    <FaSync size={12} /> Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                {['all', 'placed', 'preparing', 'ready', 'completed', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${filter === s ? 'bg-white text-black border-white' : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        {s} {s !== 'all' && `(${orders.filter(o => o.orderStatus === s).length})`}
                    </button>
                ))}
            </div>

            {/* Orders Table (desktop) */}
            <div className="hidden md:block bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-[#111] border-b border-white/10">
                        <tr>
                            {['Order ID', 'Student', 'Items', 'Amount', 'Payment', 'Status', 'Actions'].map(col => (
                                <th key={col} className="py-4 px-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filteredOrders.map(order => (
                            <tr key={order._id} className="hover:bg-white/5 transition">
                                <td className="py-4 px-5 text-sm font-mono font-bold text-white">#{order._id.slice(-6).toUpperCase()}</td>
                                <td className="py-4 px-5 text-sm text-gray-300">{order.userId?.name || 'Unknown'}</td>
                                <td className="py-4 px-5 text-sm text-gray-400 max-w-[180px] truncate">
                                    {order.items.map(i => `${i.name}×${i.qty}`).join(', ')}
                                </td>
                                <td className="py-4 px-5 text-sm font-extrabold text-white">₹{order.totalAmount}</td>
                                <td className="py-4 px-5">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${order.paymentStatus === 'paid' ? 'bg-white/10 text-white border-white/20' : 'bg-red-900/50 text-red-200 border-red-900/50'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-5">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${STATUS_COLORS[order.orderStatus] || 'bg-white/10 text-gray-300 border-white/20'}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-5">
                                    <div className="flex gap-1.5 flex-wrap">
                                        {order.orderStatus === 'placed' && <button onClick={() => updateStatus(order._id, 'preparing')} className="text-xs px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition">Prepare</button>}
                                        {order.orderStatus === 'preparing' && <button onClick={() => updateStatus(order._id, 'ready')} className="text-xs px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition">Ready</button>}
                                        {order.orderStatus === 'ready' && <button onClick={() => updateStatus(order._id, 'completed')} className="text-xs px-3 py-1.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition">Complete</button>}
                                        {!['completed', 'cancelled'].includes(order.orderStatus) && (
                                            <button onClick={() => updateStatus(order._id, 'cancelled')} className="text-xs px-3 py-1.5 rounded-xl bg-red-900/50 border border-red-900/50 text-red-200 font-bold hover:bg-red-900/80 transition">Cancel</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500 text-sm font-semibold">No orders found</div>
                )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {filteredOrders.map(order => (
                    <div key={order._id} className="bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-md p-5">
                        <div className="flex justify-between mb-3">
                            <div>
                                <p className="font-bold text-sm text-white">#{order._id.slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-gray-400">{order.userId?.name || 'Unknown'}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-white mb-1">₹{order.totalAmount}</p>
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">{order.items.map(i => `${i.name}×${i.qty}`).join(', ')}</p>
                        <div className="flex gap-2 flex-wrap">
                            {order.orderStatus === 'placed' && <button onClick={() => updateStatus(order._id, 'preparing')} className="text-xs px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold">Prepare</button>}
                            {order.orderStatus === 'preparing' && <button onClick={() => updateStatus(order._id, 'ready')} className="text-xs px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold">Ready</button>}
                            {order.orderStatus === 'ready' && <button onClick={() => updateStatus(order._id, 'completed')} className="text-xs px-3 py-1.5 rounded-xl bg-white text-black font-bold">Complete</button>}
                            {!['completed', 'cancelled'].includes(order.orderStatus) && (
                                <button onClick={() => updateStatus(order._id, 'cancelled')} className="text-xs px-3 py-1.5 rounded-xl bg-red-900/50 text-red-200 border border-red-900/50 font-bold">Cancel</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
