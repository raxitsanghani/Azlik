
import React, { useState } from 'react';
import { Shield, Lock, Clock, Check, X, Eye, EyeOff } from 'lucide-react';
import { userService } from '../../api/apiService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const SecurityCard: React.FC = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card p-10 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-premium-charcoal/5 flex items-center justify-center">
            <Shield size={18} className="text-premium-charcoal/60" />
          </div>
          <h3 className="premium-heading text-xl uppercase tracking-widest text-[14px] font-bold">Security</h3>
        </div>

        {isChangingPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="premium-subheading opacity-60">Current Password</label>
              <div className="relative flex items-center">
                <input 
                  type={showCurrent ? "text" : "password"}
                  className="w-full bg-transparent border-b border-premium-charcoal/10 py-2 pr-10 focus:border-premium-charcoal outline-none transition-colors"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-0 text-premium-charcoal/20 hover:text-premium-charcoal transition-colors p-1"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showCurrent ? 'eye' : 'eye-off'}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="premium-subheading opacity-60">New Password</label>
              <div className="relative flex items-center">
                <input 
                  type={showNew ? "text" : "password"}
                  className="w-full bg-transparent border-b border-premium-charcoal/10 py-2 pr-10 focus:border-premium-charcoal outline-none transition-colors"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-0 text-premium-charcoal/20 hover:text-premium-charcoal transition-colors p-1"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showNew ? 'eye' : 'eye-off'}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="premium-subheading opacity-60">Confirm New Password</label>
              <div className="relative flex items-center">
                <input 
                  type={showConfirm ? "text" : "password"}
                  className="w-full bg-transparent border-b border-premium-charcoal/10 py-2 pr-10 focus:border-premium-charcoal outline-none transition-colors"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-0 text-premium-charcoal/20 hover:text-premium-charcoal transition-colors p-1"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showConfirm ? 'eye' : 'eye-off'}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-premium-charcoal text-white py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-premium-navy transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Updating..." : <><Check size={12} /> Update</>}
              </button>
              <button 
                type="button" 
                onClick={() => setIsChangingPassword(false)}
                className="flex-1 border border-premium-charcoal/10 py-2 text-[10px] uppercase tracking-widest font-bold hover:border-premium-charcoal transition-colors flex items-center justify-center gap-2"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-premium-charcoal/5">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-premium-charcoal/60" />
                <span className="text-sm font-medium">Password</span>
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-green-600 bg-green-50 px-3 py-1">Secure</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-premium-charcoal/5">
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957a8.996 8.996 0 000 8.088l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.956L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium">Google Account</span>
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-premium-charcoal/40">Linked</span>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 text-premium-charcoal/40 mb-1">
                <Clock size={12} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Last Login</span>
              </div>
              <p className="text-xs font-light">Today, March 13, 2026 at 12:45 PM</p>
            </div>
          </div>
        )}
      </div>

      {!isChangingPassword && (
        <button 
          onClick={() => setIsChangingPassword(true)}
          className="premium-btn-classic w-full mt-12"
        >
          Change Password
        </button>
      )}
    </div>
  );
};

export default SecurityCard;
