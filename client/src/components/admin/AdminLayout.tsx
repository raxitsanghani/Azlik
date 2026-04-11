import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Menu,
  X,
  Users,
  MessageSquare,
  Bell,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Logo from '../common/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken'); // Cleanup legacy keys if any
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin-dashboard/products', icon: Package },
    { label: 'Collections', path: '/admin-dashboard/collections', icon: Layers },
    { label: 'Enquiries', path: '/admin-dashboard/enquiries', icon: MessageSquare },
    { label: 'Users', path: '/admin-dashboard/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30 lg:relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
              <Link to="/admin-dashboard" className="flex items-center gap-1.5 group">
                <Logo isDark={true} className="scale-75 origin-left" />
                <span className="text-[10px] font-bold tracking-widest text-gray-300 mt-2 uppercase transition-colors group-hover:text-premium-charcoal">Admin</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin-dashboard' && location.pathname.startsWith(item.path));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
                      ${isActive ? 'bg-premium-charcoal text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-premium-charcoal'}`}
                  >
                    <Icon size={20} className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white" 
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-50">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-premium-charcoal hidden sm:block">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center text-premium-charcoal font-bold border border-gray-200">
                {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-premium-charcoal">
                  {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).name : 'Admin'}
                </p>
                <p className="text-xs text-gray-400">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FAFAFA] p-6 lg:p-10">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
