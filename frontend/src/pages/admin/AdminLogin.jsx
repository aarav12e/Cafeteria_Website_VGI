import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/admin-auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                // Store token in sessionStorage (cleared when browser tab closes)
                sessionStorage.setItem('adminToken', data.token);
                sessionStorage.setItem('adminUser', data.username || username);
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Cannot connect to server. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaUtensils size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-white mb-1">Admin Panel</h1>
                        <p className="text-gray-400 text-sm">Vishveshwarya Group of Institution</p>
                        <p className="text-orange-400 text-xs font-semibold mt-0.5">Cafeteria Management</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm p-3 rounded-2xl mb-5 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Username</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                                    placeholder="Enter username"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 pl-11 pr-12 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
                                    placeholder="Enter password"
                                    required
                                    autoComplete="current-password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold py-4 rounded-2xl shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2"
                        >
                            {loading ? '🔐 Verifying...' : '🚪 Enter Admin Panel'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/menu')} className="text-gray-500 text-xs hover:text-gray-300 transition">
                            ← Back to Cafeteria
                        </button>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-4">
                    VGI Cafeteria Admin · Secured
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
