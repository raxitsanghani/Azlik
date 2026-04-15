import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Compass } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-premium-ivory flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-white pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <Compass className="w-20 h-20 text-premium-charcoal/10 mx-auto mb-12 animate-pulse" />
        
        <p className="premium-subheading mb-4 !text-premium-charcoal/40 font-bold">404 — Mist in the sanctuary</p>
        <h1 className="premium-heading text-6xl md:text-8xl mb-8">Page Not Found</h1>
        
        <p className="max-w-md mx-auto text-premium-charcoal/60 font-light mb-12 leading-relaxed">
          It seems you've wandered into an uncharted corner of our collection.
          Allow us to guide you back to the sanctuary.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" to="/">
            Return Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-20 left-10 text-[100px] font-serif text-premium-charcoal/5 pointer-events-none italic">AZLIK</div>
    </div>
  );
};

export default NotFound;
