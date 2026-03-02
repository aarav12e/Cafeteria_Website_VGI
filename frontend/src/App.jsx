import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

// Guard for admin pages — checks sessionStorage token
const AdminRoute = ({ children }) => {
  return isAdminLoggedIn() ? children : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <div className="min-h-screen bg-vgi-bg pb-20 md:pb-0">
      <UserSync />
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:px-8">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/menu" />} />
          <Route path="/menu" element={<Menu />} />

          {/* Auth */}
          <Route path="/auth" element={
            <>
              <SignedOut><AuthPage /></SignedOut>
              <SignedIn><Navigate to="/menu" /></SignedIn>
            </>
          } />
          <Route path="/login" element={<Navigate to="/auth" />} />
          <Route path="/register" element={<Navigate to="/auth" />} />

          {/* User Protected */}
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

          {/* Admin Auth */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/menu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        </Routes>
      </div>

      <BottomNav />
    </div>
  );
}

export default App;
