
import React, { useState, useEffect, useRef } from 'react';
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
  Layers,
  Tag,
  CheckCheck,
  Trash2,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Logo from '../common/Logo';
import { notificationService } from '../../api/apiService';

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Real-time polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.delete(id);
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all notifications permanentally?')) {
      try {
        await notificationService.clearAll();
        fetchNotifications();
      } catch (err) {
        toast.error('Failed to clear notifications');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin-dashboard/products', icon: Package },
    { label: 'Collections', path: '/admin-dashboard/collections', icon: Layers },
    { label: 'Categories', path: '/admin-dashboard/categories', icon: Tag },
    { label: 'Enquiries', path: '/admin-dashboard/enquiries', icon: MessageSquare },
    { label: 'Users', path: '/admin-dashboard/users', icon: Users },
  ];

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'user_signup': return <Users size={16} className="text-blue-500" />;
      case 'enquiry_new': return <MessageSquare size={16} className="text-amber-500" />;
      case 'product_request': return <Package size={16} className="text-emerald-500" />;
      case 'collection_added': return <Layers size={16} className="text-purple-500" />;
      case 'product_added': return <Tag size={16} className="text-indigo-500" />;
      case 'system_error': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Bell size={16} className="text-premium-charcoal/40" />;
    }
  };

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
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 z-[40] sticky top-0">
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
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 text-gray-400 hover:text-black transition-all rounded-full hover:bg-gray-50 ${notificationsOpen ? 'bg-gray-50 text-black' : ''}`}
              >
                <Bell size={20} />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-[380px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-[50]"
                  >
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                       <h3 className="font-bold text-premium-charcoal flex items-center gap-2">
                        Notifications
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{notifications.length}</span>
                       </h3>
                       <div className="flex items-center gap-1">
                          <button 
                            onClick={handleMarkAllRead}
                            className="p-2 text-gray-400 hover:text-emerald-500 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark all as read"
                          >
                            <CheckCheck size={16} />
                          </button>
                          <button 
                            onClick={handleClearAll}
                            className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                            title="Clear all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>

                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-gray-50/30">
                      {notifications.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                           <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                              <Bell size={32} />
                           </div>
                           <p className="text-gray-400 font-medium text-sm">All caught up!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100/50">
                          {notifications.map((notif) => (
                            <div 
                              key={notif._id}
                              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                              className={`p-5 flex gap-4 cursor-pointer transition-all relative group
                                ${notif.isRead ? 'opacity-60 grayscale-[0.5]' : 'bg-white hover:bg-gray-50 shadow-sm z-10'}`}
                            >
                               {!notif.isRead && (
                                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-premium-charcoal"></div>
                               )}
                               
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 
                                 ${notif.isRead ? 'bg-gray-100' : 'bg-premium-charcoal/5 border border-premium-charcoal/5'}`}>
                                  {getNotificationIcon(notif.type)}
                               </div>

                               <div className="flex-1 space-y-1">
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className={`text-sm tracking-tight leading-none ${notif.isRead ? 'font-medium text-gray-500' : 'font-bold text-premium-charcoal'}`}>
                                      {notif.title}
                                    </h4>
                                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 shrink-0">
                                      <Clock size={10} />
                                      {timeAgo(new Date(notif.createdAt))}
                                    </span>
                                  </div>
                                  <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {notif.message}
                                  </p>
                                  
                                  <div className="flex items-center justify-between pt-1">
                                     <div className="flex items-center gap-3">
                                       {!notif.isRead && (
                                         <span className="text-[9px] uppercase tracking-widest font-black text-premium-gold">Unread</span>
                                       )}
                                     </div>
                                     <button 
                                        onClick={(e) => handleDeleteNotification(notif._id, e)}
                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                  </div>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-4 bg-white border-t border-gray-50 flex justify-center">
                         <button className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-premium-charcoal transition-colors flex items-center gap-2 group">
                            View All Activity
                            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center text-premium-charcoal font-bold border border-gray-200 overflow-hidden shadow-inner">
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
              layout
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

const AlertTriangle = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export default AdminLayout;
