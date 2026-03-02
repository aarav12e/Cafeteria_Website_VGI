import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUtensils } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
    const { isLoaded: isSignUpLoaded, signUp, setActive: setActiveSignUp } = useSignUp();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setError(''); setLoading(true);
        try {
            const result = await signIn.create({ identifier: email, password });
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                navigate('/menu');
            }
        } catch (err) {
            setError(err.errors[0]?.message || 'Login failed. Please check your credentials.');
        } finally { setLoading(false); }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setError(''); setLoading(true);
        try {
            await signUp.create({ emailAddress: email, password, firstName: name });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifying(true);
        } catch (err) {
            setError(err.errors[0]?.message || 'Registration failed.');
        } finally { setLoading(false); }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
            if (completeSignUp.status === "complete") {
                await setActiveSignUp({ session: completeSignUp.createdSessionId });
                navigate('/menu');
            }
        } catch (err) {
            setError(err.errors[0]?.message || 'Verification failed.');
        }
    };

    if (verifying) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
                <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUtensils className="text-orange-500" size={24} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Check Your Email</h2>
                    <p className="text-gray-500 text-sm mb-6">We sent a verification code to <strong>{email}</strong></p>
                    {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100">{error}</div>}
                    <form onSubmit={handleVerify} className="space-y-4">
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-300 focus:outline-none text-center text-2xl font-bold tracking-widest"
                            placeholder="000000" required maxLength={6} />
                        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-2xl hover:bg-orange-600 transition shadow-md">
                            Verify Email
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            {/* Left Panel - Branding (Desktop) */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 to-red-600 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full" />
                    <div className="absolute bottom-20 right-10 w-56 h-56 bg-white rounded-full" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full" />
                </div>
                <div className="relative text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                        <FaUtensils size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-3 leading-tight">
                        Vishveshwarya<br />Group of Institution
                    </h1>
                    <p className="text-white/80 text-xl font-semibold mb-6">Campus Cafeteria 🍽️</p>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {['/1.jpeg', '/2.jpeg', '/3.jpeg'].map((src, i) => (
                            <img key={i} src={src} alt="Food" className="w-full h-24 object-cover rounded-2xl shadow-lg border-2 border-white/30" />
                        ))}
                    </div>
                    <p className="text-white/60 text-sm mt-6">Fresh • Tasty • Affordable</p>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                            <FaUtensils className="text-white text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">VGI</p>
                            <p className="text-sm font-extrabold text-gray-800 leading-none">Cafeteria</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
                        {isLogin ? 'Welcome back! 👋' : 'Join us today! 🎉'}
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                        {isLogin ? 'Sign in to order your favorite campus food' : 'Create an account to start ordering food'}
                    </p>

                    {/* Tabs */}
                    <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                        {['Sign In', 'Sign Up'].map((tab, i) => (
                            <button key={tab} onClick={() => { setIsLogin(i === 0); setError(''); }}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${(isLogin ? i === 0 : i === 1) ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={isLogin ? handleSignIn : handleSignUp}
                            className="space-y-4"
                        >
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-300 focus:outline-none focus:bg-white transition text-sm"
                                        placeholder="Enter your full name" required />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-300 focus:outline-none focus:bg-white transition text-sm"
                                    placeholder="your@email.com" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-300 focus:outline-none focus:bg-white transition text-sm pr-12"
                                        placeholder="Enter your password" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">{error}</div>
                            )}

                            <button type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-base">
                                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        By continuing, you agree to VGI Cafeteria's Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
