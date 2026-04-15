
import React, { useState, useRef, useEffect } from 'react';
import { User, ArrowRight, Check, X, Camera } from 'lucide-react';
import { userService } from '../../api/apiService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../../utils/imageUtils';

interface ProfileCardProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if user changes from parent
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
  }, [user]);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return toast.error("Only JPG, PNG and WEBP formats are allowed");
    }

    // Instant preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      // Client-side compression
      const compressedFile = await compressImage(file, 800, 800, 0.7);
      
      const response = await userService.uploadAvatar(compressedFile);
      onUpdate(response.data);
      toast.success("Profile photo updated successfully");
      setPreviewImage(null); // Clear preview as we have real URL now
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload image. Please try a smaller file.");
      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userService.updateProfile(formData);
      onUpdate(response.data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card p-10 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-premium-charcoal/5 flex items-center justify-center">
              <User size={18} className="text-premium-charcoal/60" />
            </div>
            <h3 className="premium-heading text-xl uppercase tracking-widest text-[14px] font-bold">Profile Info</h3>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-[10px] items-center gap-1 uppercase tracking-widest font-bold text-premium-charcoal/40 hover:text-premium-charcoal transition-colors border-b border-transparent hover:border-premium-charcoal/20"
            >
              Edit
            </button>
          )}
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-10">
          <div 
            className="relative group cursor-pointer"
            onClick={handleImageClick}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 rounded-full border-2 border-premium-charcoal/5 p-1 bg-white/40 backdrop-blur-sm shadow-inner overflow-hidden"
            >
              <div className="w-full h-full rounded-full bg-premium-platinum overflow-hidden flex items-center justify-center relative bg-gradient-to-br from-premium-platinum to-premium-beige/20">
                <AnimatePresence>
                  {uploading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10"
                    >
                      <div className="w-6 h-6 border-2 border-premium-charcoal border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  {(previewImage || user.avatar) ? (
                    <motion.img 
                      key={previewImage || user.avatar}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={previewImage || user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <motion.span 
                      key="initial"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-4xl font-serif text-premium-charcoal/30 uppercase select-none"
                    >
                      {getInitial(formData.name || user.name)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Edit Button Overlay (Bottom Right) - Only shows on hover for premium feel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-1 right-1 bg-white w-9 h-9 rounded-full shadow-lg flex items-center justify-center border border-premium-platinum z-20 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Camera size={16} className="text-premium-charcoal/60" />
            </motion.div>

            <input 
              type="file" 
              id="avatar-upload-trigger"
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
          <p className="premium-subheading mt-4 opacity-40 text-[10px] uppercase font-bold tracking-[0.1em]">Change Selection</p>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="premium-subheading opacity-60">Full Name</label>
              <input 
                type="text"
                className="w-full bg-transparent border-b border-premium-charcoal/10 py-2 focus:border-premium-charcoal outline-none transition-colors font-serif"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="premium-subheading opacity-60">Email Address</label>
              <input 
                type="email"
                className="w-full bg-transparent border-b border-premium-charcoal/10 py-2 focus:border-premium-charcoal outline-none transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="premium-subheading opacity-60">Phone</label>
              <input 
                type="text"
                className="w-full bg-transparent border-b border-premium-charcoal/10 py-2 focus:border-premium-charcoal outline-none transition-colors"
                placeholder="Ex: +1 234 567 890"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-premium-charcoal text-white py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-premium-navy transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? "Saving..." : <><Check size={12} /> Save Changes</>}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, email: user.email, phone: user.phone || '' });
                }}
                className="flex-1 border border-premium-charcoal/10 py-2 text-[10px] uppercase tracking-widest font-bold hover:border-premium-charcoal transition-colors flex items-center justify-center gap-2"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="premium-subheading opacity-60">Full Name</p>
              <p className="font-serif text-lg tracking-tight">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="premium-subheading opacity-60">Email Address</p>
              <p className="font-light tracking-wide text-sm">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="premium-subheading opacity-60">Phone</p>
              <p className="font-light tracking-wide text-premium-charcoal/40 italic text-sm">
                {user.phone || 'Not provided'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="premium-btn-outline w-full mt-12 flex items-center justify-center gap-2 group border-premium-charcoal/10 py-3"
        >
          Edit Profile Details
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ProfileCard;
