import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaClipboardList } from 'react-icons/fa';

const STATUS_COLORS = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    placed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-purple-100 text-purple-700',
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const axios = useAxios();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-4 mt-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-3xl h-36 animate-pulse" />)}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                <FaClipboardList className="text-orange-500" />
                My Orders
            </h2>

            {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <FaClipboardList size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-semibold text-lg">No orders yet</p>
                    <p className="text-sm mt-1">Your order history will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white p-5 rounded-3xl shadow-md">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Order ID</p>
                                    <p className="text-sm font-bold text-gray-700 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="text-right flex flex-col gap-1.5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.orderStatus.toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-1 mb-3 border-t border-b py-3 border-gray-50">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                                        <span>{item.name} × {item.qty}</span>
                                        <span>₹{item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between font-extrabold text-gray-800">
                                <span>Total Amount</span>
                                <span className="text-orange-500">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
