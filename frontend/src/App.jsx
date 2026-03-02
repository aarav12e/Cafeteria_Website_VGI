import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import UserSync from './components/UserSync';
import AuthPage from './pages/auth/AuthPage';
import Menu from './pages/user/Menu';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';

const AdminRoute = ({ children }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="p-10 text-center">Loading...</div>;

  // Check if user has admin role (stored in publicMetadata or check email)
  // For now, let's assume a hardcoded check or metadata
  // In production, sync Clerk user to your DB and check DB role
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.emailAddresses[0]?.emailAddress?.includes('admin');

  return isAdmin ? children : <Navigate to="/menu" />;
};

function App() {
  return (
    <div className="min-h-screen bg-yummies-bg pb-20 md:pb-0">
      <UserSync />
      <Navbar /> {/* Top Nav for Desktop */}

      <div className="container mx-auto p-4 md:p-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/menu" />} />
          <Route path="/auth" element={
            <>
              <SignedOut>
                <AuthPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/menu" />
              </SignedIn>
            </>
          } />
          <Route path="/login" element={<Navigate to="/auth" />} />
          <Route path="/register" element={<Navigate to="/auth" />} />

          <Route path="/menu" element={<Menu />} />

          {/* User Routes (Protected) */}
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

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <SignedIn><AdminRoute><AdminDashboard /></AdminRoute></SignedIn>
          } />
          <Route path="/admin/menu" element={
            <SignedIn><AdminRoute><AdminMenu /></AdminRoute></SignedIn>
          } />
          <Route path="/admin/orders" element={
            <SignedIn><AdminRoute><AdminOrders /></AdminRoute></SignedIn>
          } />
        </Routes>
      </div>

      <BottomNav /> {/* Bottom Nav for Mobile */}
    </div>
  );
}

export default App;
