import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaSync } from 'react-icons/fa';

const STATUS_COLORS = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    placed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-purple-100 text-purple-700',
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
            {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-3xl h-20 animate-pulse" />)}
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Manage Orders</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{orders.length} total orders</p>
                </div>
                <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition">
                    <FaSync size={12} /> Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                {['all', 'placed', 'preparing', 'ready', 'completed', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filter === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300'}`}
                    >
                        {s} {s !== 'all' && `(${orders.filter(o => o.orderStatus === s).length})`}
                    </button>
                ))}
            </div>

            {/* Orders Table (desktop) */}
            <div className="hidden md:block bg-white rounded-3xl shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {['Order ID', 'Student', 'Items', 'Amount', 'Payment', 'Status', 'Actions'].map(col => (
                                <th key={col} className="py-4 px-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map(order => (
                            <tr key={order._id} className="hover:bg-orange-50/30 transition">
                                <td className="py-4 px-5 text-sm font-mono font-bold text-gray-600">#{order._id.slice(-6).toUpperCase()}</td>
                                <td className="py-4 px-5 text-sm text-gray-700">{order.userId?.name || 'Unknown'}</td>
                                <td className="py-4 px-5 text-sm text-gray-500 max-w-[180px] truncate">
                                    {order.items.map(i => `${i.name}×${i.qty}`).join(', ')}
                                </td>
                                <td className="py-4 px-5 text-sm font-extrabold text-orange-500">₹{order.totalAmount}</td>
                                <td className="py-4 px-5">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-5">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-5">
                                    <div className="flex gap-1.5 flex-wrap">
                                        {order.orderStatus === 'placed' && <button onClick={() => updateStatus(order._id, 'preparing')} className="text-xs px-3 py-1.5 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200 transition">Prepare</button>}
                                        {order.orderStatus === 'preparing' && <button onClick={() => updateStatus(order._id, 'ready')} className="text-xs px-3 py-1.5 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition">Ready</button>}
                                        {order.orderStatus === 'ready' && <button onClick={() => updateStatus(order._id, 'completed')} className="text-xs px-3 py-1.5 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 transition">Complete</button>}
                                        {!['completed', 'cancelled'].includes(order.orderStatus) && (
                                            <button onClick={() => updateStatus(order._id, 'cancelled')} className="text-xs px-3 py-1.5 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition">Cancel</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm font-semibold">No orders found</div>
                )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {filteredOrders.map(order => (
                    <div key={order._id} className="bg-white rounded-3xl shadow-md p-5">
                        <div className="flex justify-between mb-3">
                            <div>
                                <p className="font-bold text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-gray-400">{order.userId?.name || 'Unknown'}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-orange-500">₹{order.totalAmount}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{order.items.map(i => `${i.name}×${i.qty}`).join(', ')}</p>
                        <div className="flex gap-2 flex-wrap">
                            {order.orderStatus === 'placed' && <button onClick={() => updateStatus(order._id, 'preparing')} className="text-xs px-3 py-1.5 rounded-xl bg-yellow-100 text-yellow-700 font-bold">Prepare</button>}
                            {order.orderStatus === 'preparing' && <button onClick={() => updateStatus(order._id, 'ready')} className="text-xs px-3 py-1.5 rounded-xl bg-blue-100 text-blue-700 font-bold">Ready</button>}
                            {order.orderStatus === 'ready' && <button onClick={() => updateStatus(order._id, 'completed')} className="text-xs px-3 py-1.5 rounded-xl bg-green-100 text-green-700 font-bold">Complete</button>}
                            {!['completed', 'cancelled'].includes(order.orderStatus) && (
                                <button onClick={() => updateStatus(order._id, 'cancelled')} className="text-xs px-3 py-1.5 rounded-xl bg-red-100 text-red-600 font-bold">Cancel</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
