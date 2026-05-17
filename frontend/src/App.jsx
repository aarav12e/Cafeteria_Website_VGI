import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
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

const AdminRoute = ({ children }) => {
  return (
    isAdminLoggedIn() ? children : <Navigate to="/vgi-secret-admin" replace />
  );
};

function App() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-200 overflow-x-hidden font-sans selection:bg-gray-700 selection:text-white">
      {/* ── TRUE ANIMATED BACKGROUND ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
        overflow: 'hidden',
      }}>
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
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
              <><SignedIn><Cart /></SignedIn><SignedOut><Navigate to="/auth" /></SignedOut></>
            } />
            <Route path="/myorders" element={
              <><SignedIn><MyOrders /></SignedIn><SignedOut><Navigate to="/auth" /></SignedOut></>
            } />
            <Route path="/vgi-secret-admin" element={<AdminLogin />} />
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
