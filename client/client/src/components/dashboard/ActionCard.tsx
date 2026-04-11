
import React from 'react';
import { ShoppingBag, MessageSquare, ExternalLink, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ActionCard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info("Logged out successfully");
    navigate('/login');
  };

  return (
    <div className="premium-card p-10 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-premium-charcoal/5 flex items-center justify-center">
            <ShoppingBag size={18} className="text-premium-charcoal/60" />
          </div>
          <h3 className="premium-heading text-xl uppercase tracking-widest text-[14px] font-bold">Quick Actions</h3>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/enquiries')}
            className="w-full text-left p-4 hover:bg-premium-charcoal/5 transition-all group flex items-center justify-between border border-transparent hover:border-premium-platinum"
          >
            <div className="flex items-center gap-4">
              <MessageSquare size={16} className="text-premium-charcoal/40" />
              <span className="text-sm tracking-wide">My Enquiries</span>
            </div>
            <ExternalLink size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </button>
          
          <button 
            onClick={() => navigate('/saved-products')}
            className="w-full text-left p-4 hover:bg-premium-charcoal/5 transition-all group flex items-center justify-between border border-transparent hover:border-premium-platinum"
          >
            <div className="flex items-center gap-4">
              <ShoppingBag size={16} className="text-premium-charcoal/40" />
              <span className="text-sm tracking-wide">Saved Products</span>
            </div>
            <ExternalLink size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </button>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="premium-btn-danger w-full mt-12 flex items-center justify-center gap-2"
      >
        <LogOut size={14} />
        Logout
      </button>
    </div>
  );
};

export default ActionCard;
