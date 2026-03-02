import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import UserSync from './components/UserSync';
import AuthPage from './pages/auth/AuthPage';
import Menu from './pages/user/Menu';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import { isAdminLoggedIn } from './hooks/useAdminAuth';

const AdminRoute = ({ children }) =>
  isAdminLoggedIn() ? children : <Navigate to="/admin-login" replace />;

// Orb config: each orb has unique color, size, start position, and keyframe path
const ORBS = [
  {
    size: 520,
    color: 'radial-gradient(circle, #f97316cc, #ea580c88)',
    x: [-180, 80, 200, -100, -180],
    y: [-160, 120, -60, 200, -160],
    duration: 20,
  },
  {
    size: 420,
    color: 'radial-gradient(circle, #7c3aedcc, #4f46e588)',
    x: [300, -60, 400, 100, 300],
    y: [500, 200, -80, 380, 500],
    duration: 25,
    delay: -6,
  },
  {
    size: 280,
    color: 'radial-gradient(circle, #ec4899bb, #be185d77)',
    x: [150, 400, 50, 350, 150],
    y: [250, -50, 400, 150, 250],
    duration: 18,
    delay: -10,
  },
  {
    size: 340,
    color: 'radial-gradient(circle, #06b6d4aa, #0891b266)',
    x: [-80, 320, -120, 200, -80],
    y: [400, 100, 350, -80, 400],
    duration: 22,
    delay: -15,
  },
];

const MovingOrb = ({ orb }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: orb.size,
      height: orb.size,
      borderRadius: '50%',
      background: orb.color,
      filter: 'blur(90px)',
      opacity: 0.5,
      pointerEvents: 'none',
    }}
    animate={{ x: orb.x, y: orb.y }}
    transition={{
      duration: orb.duration,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
      delay: orb.delay || 0,
    }}
  />
);

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ── TRUE ANIMATED BACKGROUND ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, #0a0a18 0%, #120924 40%, #0c1a30 70%, #0a0a18 100%)',
        overflow: 'hidden',
      }}>
        {ORBS.map((orb, i) => <MovingOrb key={i} orb={orb} />)}

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }} className="pb-24 md:pb-0">
        <UserSync />
        <Navbar />
        <div className="container mx-auto px-4 py-6 md:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/menu" />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/auth" element={
              <>
                <SignedOut><AuthPage /></SignedOut>
                <SignedIn><Navigate to="/menu" /></SignedIn>
              </>
            } />
            <Route path="/login" element={<Navigate to="/auth" />} />
            <Route path="/register" element={<Navigate to="/auth" />} />
            <Route path="/cart" element={
              <><SignedIn><Cart /></SignedIn><SignedOut><RedirectToSignIn redirectUrl="/cart" /></SignedOut></>
            } />
            <Route path="/myorders" element={
              <><SignedIn><MyOrders /></SignedIn><SignedOut><RedirectToSignIn redirectUrl="/myorders" /></SignedOut></>
            } />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/menu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

export default App;
