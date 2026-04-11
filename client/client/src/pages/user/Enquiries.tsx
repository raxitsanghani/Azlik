
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';

const Enquiries: React.FC = () => {
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
            <MessageSquare size={32} className="text-premium-charcoal/40" />
          </div>
          <h1 className="premium-heading text-4xl mb-4">My Enquiries</h1>
          <p className="text-premium-charcoal/60 font-light max-w-md mx-auto italic mb-12">
            "Communication is the soul of luxury service. Your personal concierge will respond to your enquiries here."
          </p>
          <div className="w-full h-[1px] bg-premium-platinum mb-12"></div>
          <p className="premium-subheading">No active enquiries at this time</p>
        </div>
      </div>
    </div>
  );
};

export default Enquiries;
