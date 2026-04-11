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
import CollectionsPage from './pages/collections/CollectionsPage';
import CollectionDetail from './pages/collections/CollectionDetail';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';
import About from './pages/About';

// Admin Imports
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCollections from './pages/admin/AdminCollections';
import AdminEnquiries from './pages/admin/AdminEnquiries';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:category" element={<ProductListing />} />
        <Route path="/accessories" element={<ProductListing />} />
        <Route path="/accessories/:category" element={<ProductListing />} />
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
           path="/admin-dashboard/collections" 
           element={
             <AdminProtectedRoute>
                <AdminCollections />
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MainLayout />
    </Router>
  );
}

export default App;
