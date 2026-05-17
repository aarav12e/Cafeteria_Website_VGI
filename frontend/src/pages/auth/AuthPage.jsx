import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { FaUtensils } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex min-h-[85vh] bg-[#050505] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Left Panel - Branding (Desktop) */}
            <div className="hidden lg:flex flex-1 bg-[#0a0a0a] items-center justify-center p-12 relative overflow-hidden border-r border-white/10">
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full" />
                    <div className="absolute bottom-20 right-10 w-56 h-56 bg-white rounded-full" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full" />
                </div>
                <div className="relative text-center text-white">
                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
                        <FaUtensils size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-3 leading-tight text-white">
                        Vishveshwarya<br />Group of Institution
                    </h1>
                    <p className="text-gray-400 text-xl font-semibold mb-6">Campus Cafeteria 🍽️</p>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {['/1.jpeg', '/2.jpeg', '/3.jpeg'].map((src, i) => (
                            <img key={i} src={src} alt="Food" className="w-full h-24 object-cover rounded-2xl shadow-lg border border-white/10 grayscale hover:grayscale-0 transition-all duration-500" />
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-6">Professional • Fast • Clean</p>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[#050505]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                            <FaUtensils className="text-white text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">VGI</p>
                            <p className="text-sm font-extrabold text-white leading-none">Cafeteria</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white/5 rounded-2xl p-1 mb-8 border border-white/10">
                        {['Sign In', 'Sign Up'].map((tab, i) => (
                            <button key={tab} onClick={() => setIsLogin(i === 0)}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${(isLogin ? i === 0 : i === 1) ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-white'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex justify-center"
                        >
                            {isLogin ? (
                                <SignIn 
                                    appearance={{ 
                                        elements: { 
                                            card: 'bg-transparent shadow-none w-full',
                                            headerTitle: 'text-white',
                                            headerSubtitle: 'text-gray-400',
                                            socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
                                            dividerLine: 'bg-white/10',
                                            dividerText: 'text-gray-500',
                                            formFieldLabel: 'text-gray-400',
                                            formFieldInput: 'bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white',
                                            formButtonPrimary: 'bg-white text-black hover:bg-gray-200',
                                            footerActionText: 'text-gray-400',
                                            footerActionLink: 'text-white hover:text-gray-300'
                                        } 
                                    }} 
                                />
                            ) : (
                                <SignUp 
                                    appearance={{ 
                                        elements: { 
                                            card: 'bg-transparent shadow-none w-full',
                                            headerTitle: 'text-white',
                                            headerSubtitle: 'text-gray-400',
                                            socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
                                            dividerLine: 'bg-white/10',
                                            dividerText: 'text-gray-500',
                                            formFieldLabel: 'text-gray-400',
                                            formFieldInput: 'bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white',
                                            formButtonPrimary: 'bg-white text-black hover:bg-gray-200',
                                            footerActionText: 'text-gray-400',
                                            footerActionLink: 'text-white hover:text-gray-300'
                                        } 
                                    }} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
