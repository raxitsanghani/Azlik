import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import OTPVerification from './pages/auth/OTPVerification';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/user/Enquiries';
import SavedProducts from './pages/user/SavedProducts';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ProductListing from './pages/products/ProductListing';
import ProductDetail from './pages/products/ProductDetail';
import CollectionsPage from './pages/categories/CollectionsPage';
import FaucetsPage from './pages/categories/FaucetsPage';
import ShowersPage from './pages/categories/ShowersPage';
import MirrorsPage from './pages/categories/MirrorsPage';
import AccessoriesPage from './pages/categories/AccessoriesPage';
import TowelHoldersPage from './pages/categories/TowelHoldersPage';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';

// Admin Imports
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminUsers from './pages/admin/AdminUsers';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:category" element={<ProductListing />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/faucets" element={<FaucetsPage />} />
        <Route path="/showers" element={<ShowersPage />} />
        <Route path="/mirrors" element={<MirrorsPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/towel-holders" element={<TowelHoldersPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <AdminProtectedRoute>
               <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard/products" 
          element={
            <AdminProtectedRoute>
               <AdminProducts />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard/users" 
          element={
            <AdminProtectedRoute>
               <AdminUsers />
            </AdminProtectedRoute>
          } 
        />
        <Route 
           path="/admin-dashboard/enquiries" 
           element={
             <AdminProtectedRoute>
                <AdminEnquiries />
             </AdminProtectedRoute>
           } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enquiries" 
          element={
            <ProtectedRoute>
              <Enquiries />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/saved-products" 
          element={
            <ProtectedRoute>
              <SavedProducts />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-dashboard');

  return (
    <div className="min-h-screen">
      {!isAdminRoute && <Navbar />}
      <AnimatedRoutes />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
