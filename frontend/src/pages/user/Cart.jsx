import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import useAxios from '../../hooks/useAxios';
import { useUser } from '@clerk/clerk-react';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaCreditCard, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, updateQty, removeFromCart, totalAmount, clearCart } = useCart();
    const { user } = useUser();
    const axios = useAxios();
    const navigate = useNavigate();

    const loadRazorpay = () => new Promise(resolve => {
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

    const handleCheckout = async () => {
        if (!user) { navigate('/auth'); return; }
        const ok = await loadRazorpay();
        if (!ok) { alert('Razorpay failed to load. Are you online?'); return; }
        try {
            const orderData = { items: cartItems.map(i => ({ menuId: i._id, qty: i.qty, name: i.name, price: i.price })), totalAmount };
            const { data: dbOrder } = await axios.post('/orders', orderData);
            const { data: rzpOrder } = await axios.post('/payments/create-order', { amount: totalAmount, orderId: dbOrder._id });
            new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
                amount: rzpOrder.amount, currency: rzpOrder.currency,
                name: 'VGI Cafeteria', description: 'Food Order', order_id: rzpOrder.id,
                handler: async (res) => {
                    try {
                        await axios.post('/payments/verify', { razorpay_order_id: res.razorpay_order_id, razorpay_payment_id: res.razorpay_payment_id, razorpay_signature: res.razorpay_signature, orderId: dbOrder._id });
                        clearCart(); navigate('/myorders');
                    } catch (e) { alert(e.response?.data?.message || 'Payment verification failed'); }
                },
                prefill: { name: user.fullName, email: user.primaryEmailAddress?.emailAddress },
                theme: { color: '#ea580c' },
            }).open();
        } catch { alert('Order creation failed. Please try again.'); }
    };

    if (cartItems.length === 0) return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 glass rounded-full flex items-center justify-center mb-6 border border-white/10">
                <FaShoppingBag className="text-white/30" size={36} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
            <p className="text-white/40 mb-6 text-sm">Add some amazing dishes from our menu</p>
            <button onClick={() => navigate('/menu')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-all">
                Browse Menu <FaArrowRight size={13} />
            </button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <FaShoppingBag className="text-orange-400" />
                Your Cart
                <span className="text-sm font-normal text-white/30 ml-1">({cartItems.length} items)</span>
            </h2>

            <div className="glass rounded-3xl p-5 mb-4 space-y-4 border border-white/10">
                <AnimatePresence>
                    {cartItems.map(item => (
                        <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                            <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'}
                                alt={item.name} className="w-16 h-16 object-cover rounded-2xl flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                <p className="text-orange-400 font-bold text-sm">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center glass rounded-xl border border-white/10 overflow-hidden">
                                    <button onClick={() => updateQty(item._id, item.qty - 1)} className="px-2.5 py-2 text-white/60 hover:text-white hover:bg-white/10 transition"><FaMinus size={10} /></button>
                                    <span className="px-3 font-bold text-sm text-white">{item.qty}</span>
                                    <button onClick={() => updateQty(item._id, item.qty + 1)} className="px-2.5 py-2 text-white/60 hover:text-white hover:bg-white/10 transition"><FaPlus size={10} /></button>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"><FaTrash size={13} /></button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="glass rounded-3xl p-5 border border-white/10">
                <h3 className="font-bold text-white mb-3">Order Summary</h3>
                <div className="space-y-2 mb-4">
                    {cartItems.map(item => (
                        <div key={item._id} className="flex justify-between text-sm text-white/50">
                            <span>{item.name} × {item.qty}</span>
                            <span className="text-white/70">₹{item.price * item.qty}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-black text-lg">
                    <span className="text-white">Total</span>
                    <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">₹{totalAmount}</span>
                </div>
                <button onClick={handleCheckout}
                    className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-black text-base shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <FaCreditCard /> Pay ₹{totalAmount} — UPI / Card
                </button>
                <p className="text-center text-xs text-white/20 mt-3">Secured by Razorpay</p>
            </div>
        </div>
    );
};

export default Cart;
