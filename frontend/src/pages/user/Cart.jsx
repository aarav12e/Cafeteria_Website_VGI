import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import useAxios from '../../hooks/useAxios';
import { useUser } from '@clerk/clerk-react';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaCreditCard } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Cart = () => {
    const { cartItems, updateQty, removeFromCart, totalAmount, clearCart } = useCart();
    const { user } = useUser();
    const axios = useAxios();
    const navigate = useNavigate();

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        if (!user) { navigate('/auth'); return; }
        const res = await loadRazorpay();
        if (!res) { alert('Razorpay SDK failed to load. Are you online?'); return; }

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    menuId: item._id, qty: item.qty, name: item.name, price: item.price
                })),
                totalAmount
            };
            const { data: dbOrder } = await axios.post('/orders', orderData);
            const { data: razorpayOrder } = await axios.post('/payments/create-order', {
                amount: totalAmount, orderId: dbOrder._id
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "VGI Cafeteria",
                description: "Vishveshwarya Group of Institution — Food Order",
                image: "/vite.svg",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        await axios.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: dbOrder._id
                        });
                        clearCart();
                        navigate('/myorders');
                    } catch (error) {
                        alert(error.response?.data?.message || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: user.fullName || user.firstName,
                    email: user.primaryEmailAddress?.emailAddress,
                },
                theme: { color: "#ea580c" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert('Something went wrong processing the order');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <FaShoppingBag className="text-orange-300" size={36} />
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6 text-sm">Add delicious dishes from our cafeteria menu</p>
                <button
                    onClick={() => navigate('/menu')}
                    className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition hover:scale-105"
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                <FaShoppingBag className="text-orange-500" />
                Your Cart
                <span className="text-sm font-normal text-gray-400 ml-1">({cartItems.length} items)</span>
            </h2>

            <div className="bg-white rounded-3xl shadow-md p-5 mb-4 space-y-4">
                {cartItems.map(item => (
                    <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                    >
                        <img
                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-2xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                            <p className="text-orange-500 font-bold text-sm">₹{item.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                                <button onClick={() => updateQty(item._id, item.qty - 1)} className="px-2.5 py-2 hover:bg-gray-200 transition text-gray-600">
                                    <FaMinus size={10} />
                                </button>
                                <span className="px-3 font-bold text-sm text-gray-800">{item.qty}</span>
                                <button onClick={() => updateQty(item._id, item.qty + 1)} className="px-2.5 py-2 hover:bg-gray-200 transition text-gray-600">
                                    <FaPlus size={10} />
                                </button>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                                <FaTrash size={13} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-md p-5">
                <h3 className="font-bold text-gray-700 mb-3">Order Summary</h3>
                <div className="space-y-2 mb-4">
                    {cartItems.map(item => (
                        <div key={item._id} className="flex justify-between text-sm text-gray-600">
                            <span>{item.name} × {item.qty}</span>
                            <span>₹{item.price * item.qty}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-extrabold text-lg text-gray-800">
                    <span>Total</span>
                    <span className="text-orange-500">₹{totalAmount}</span>
                </div>
                <button
                    onClick={handleCheckout}
                    className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <FaCreditCard />
                    Pay ₹{totalAmount} via UPI / Card
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">Powered by Razorpay · Secure Payment</p>
            </div>
        </div>
    );
};

export default Cart;
