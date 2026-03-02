import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
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

function App() {
  return (
    <div className="relative min-h-screen">
      {/* ── Animated Motion Background ── */}
      <div className="motion-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* ── Page Content ── */}
      <div className="page-content pb-24 md:pb-0">
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
              <>
                <SignedIn><Cart /></SignedIn>
                <SignedOut><RedirectToSignIn redirectUrl="/cart" /></SignedOut>
              </>
            } />
            <Route path="/myorders" element={
              <>
                <SignedIn><MyOrders /></SignedIn>
                <SignedOut><RedirectToSignIn redirectUrl="/myorders" /></SignedOut>
              </>
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
