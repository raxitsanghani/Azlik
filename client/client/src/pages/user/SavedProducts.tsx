
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const SavedProducts: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen dashboard-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 premium-subheading hover:text-black transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        
        <div className="premium-card p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-premium-charcoal/5 flex items-center justify-center rounded-full">
            <ShoppingBag size={32} className="text-premium-charcoal/40" />
          </div>
          <h1 className="premium-heading text-4xl mb-4">Saved Products</h1>
          <p className="text-premium-charcoal/60 font-light max-w-md mx-auto italic mb-12">
            "Curating your private sanctuary. Your hand-selected pieces from our collections will appear here."
          </p>
          <div className="w-full h-[1px] bg-premium-platinum mb-12"></div>
          <p className="premium-subheading">Your wishlist is currently empty</p>
        </div>
      </div>
    </div>
  );
};

export default SavedProducts;
