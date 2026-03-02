import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaClipboardList } from 'react-icons/fa';

const STATUS = {
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    placed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    preparing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ready: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const axios = useAxios();

    useEffect(() => {
        axios.get('/orders/myorders')
            .then(({ data }) => setOrders(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="glass rounded-3xl h-36 animate-pulse border border-white/5" />)}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <FaClipboardList className="text-orange-400" /> My Orders
            </h2>

            {orders.length === 0 ? (
                <div className="text-center py-20 text-white/30">
                    <FaClipboardList size={48} className="mx-auto mb-4" />
                    <p className="font-semibold text-lg">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="glass-white rounded-3xl p-5 shadow-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Order ID</p>
                                    <p className="text-sm font-black text-gray-800 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex flex-col gap-1.5 items-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS[order.orderStatus] || 'bg-gray-100 text-gray-500'}`}>
                                        {order.orderStatus.toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                        {order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 border-t border-b border-gray-100 py-3 mb-3">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm text-gray-600">
                                        <span>{item.name} × {item.qty}</span>
                                        <span className="font-semibold">₹{item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between font-black text-gray-800">
                                <span>Total</span>
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
