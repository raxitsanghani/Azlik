import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { userService, getFullImageUrl } from '../api/apiService';
import { DashboardSkeleton } from '../components/dashboard/Skeleton';
import ProfileCard from '../components/dashboard/ProfileCard';
import SecurityCard from '../components/dashboard/SecurityCard';
import ActionCard from '../components/dashboard/ActionCard';
import { motion } from 'framer-motion';
import PageLayout from '../components/common/PageLayout';

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserData(response.data);
        // Sync with localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to fetch profile", error);
        // Fallback to localStorage if API fails
        const userStr = localStorage.getItem('user');
        if (userStr) setUserData(JSON.parse(userStr));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateUser = (updatedUser: any) => {
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  if (loading) return <DashboardSkeleton />;
  if (!userData) return null;

  return (
    <PageLayout>
      <div className="min-h-screen dashboard-gradient py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link 
            to="/" 
            className="flex items-center gap-2 premium-subheading !text-premium-charcoal/40 hover:!text-premium-charcoal transition-all duration-300 group mb-6"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <p className="premium-subheading mb-2">My Account</p>
          <h1 className="premium-heading text-4xl md:text-5xl lg:text-6xl mb-4">
            Welcome back, <span className="italic">{userData.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-premium-charcoal/60 font-light tracking-wide max-w-md">
            Manage your premium bathroom collections, account security, and personal preferences.
          </p>
        </div>

        <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload-trigger')?.click()}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-premium-charcoal/5 p-2 bg-white/40 backdrop-blur-sm shadow-lg overflow-hidden"
          >
            <div className="w-full h-full rounded-full bg-premium-platinum overflow-hidden flex items-center justify-center relative bg-gradient-to-br from-premium-platinum to-premium-beige/20">
               {userData.avatar ? (
                 <img src={getFullImageUrl(userData.avatar)} alt={userData.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               ) : (
                 <span className="text-4xl font-serif text-premium-charcoal/40 uppercase">
                   {getInitial(userData.name)}
                 </span>
               )}
            </div>
          </motion.div>
          
          {/* Subtle bottom-right camera icon for header too - only on hover */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute bottom-1 right-1 bg-white w-9 h-9 rounded-full shadow-xl flex items-center justify-center border border-premium-platinum z-20 transition-opacity duration-300 group-hover:opacity-100"
          >
            <Camera size={16} className="text-premium-charcoal/60" />
          </motion.div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute top-2 right-2 bg-white w-5 h-5 rounded-full shadow-lg flex items-center justify-center border border-premium-platinum z-30"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProfileCard user={userData} onUpdate={handleUpdateUser} />
        <SecurityCard />
        <ActionCard />
      </div>

      {/* Activity Section */}
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="premium-card p-12 text-center overflow-hidden relative group"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-premium-platinum to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="max-w-md mx-auto space-y-6 flex flex-col items-center">
            <div className="w-20 h-20 mb-2 opacity-5 grayscale transition-all duration-700 group-hover:opacity-10 group-hover:scale-110">
               <ShoppingBag size={80} strokeWidth={0.5} />
            </div>
            <h3 className="premium-heading text-2xl tracking-tight">Your journey starts here.</h3>
            <p className="text-premium-charcoal/60 font-light tracking-wide italic leading-relaxed">
              "Every masterpiece begins with a single selection. Explore our premium bathroom accessories to start your collection."
            </p>
            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="w-12 h-[1px] bg-premium-platinum group-hover:w-20 transition-all duration-700"></div>
              <p className="premium-subheading">No activity yet</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-6xl mx-auto text-center pt-8 pb-4">
        <p className="premium-subheading opacity-20">AZLIK Luxury Bathrooms — Curating Excellence since 1994</p>
      </div>
    </div>
    </PageLayout>
  );
};

export default Dashboard;
