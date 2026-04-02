
import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[90vh] overflow-hidden flex items-center">
      {/* Background with Parallax effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/hero_bathroom_sanctuary.png"
          alt="Luxury Bathroom Sanctuary"
          className="w-full h-full object-cover"
        />
        {/* Focused gradient for text readability without darkening entire image */}
        <div className="absolute inset-0 bg-gradient-to-r from-premium-charcoal/80 via-premium-charcoal/20 to-transparent"></div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="premium-subheading text-white/90 mb-6 font-bold"
          >
            Since 1994 — The Art of Living
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="premium-heading text-6xl md:text-8xl text-[#F8F8F6] mb-8 leading-[1.1] drop-shadow-2xl"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
          >
            Crafting Your <br />
            <span className="italic font-normal">Bathroom Sanctuary</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/70 font-light max-w-xl mb-12 leading-relaxed"
          >
            Elevate your personal space with our curated collection of premium bathroom accessories,
            designed for those who appreciate the finer details.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Button to="/products" variant="primary" className="!bg-white !text-premium-charcoal hover:!bg-premium-ivory">
              Explore Collections
              <ArrowRight size={16} />
            </Button>
            <Button to="/enquiries" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-premium-charcoal font-bold">
              Send Enquiry
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        <span className="premium-subheading text-white/40 !tracking-[0.5em]">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
