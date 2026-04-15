import React from 'react';
import { motion } from 'framer-motion';
import type { HomeHeroContent } from '../../data/homeHero';

type HeroContentProps = {
  content: HomeHeroContent;
  showcaseImage?: {
    imageSrc: string;
    imageAlt: string;
  };
};

const HeroContent: React.FC<HeroContentProps> = ({ content, showcaseImage }) => {
  return (
    <div className="container mx-auto px-6 relative z-10 flex min-h-[90vh] items-center w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center py-12 sm:py-20">
        
        {/* Left Side: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-left w-full max-w-xl mx-auto lg:mx-0"
        >
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-cinzel text-[12px] sm:text-[14px] uppercase tracking-[0.4em] text-white/90 mb-6 font-bold flex items-center gap-4"
          >
            <span className="w-12 h-[1px] bg-premium-marble/60"></span>
            {content.subheading}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-cinzel text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] mb-6 leading-[1.05] hero-glow-text font-bold tracking-wide drop-shadow-2xl"
            id="hero2"
          >
            {content.heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/85 text-lg sm:text-xl font-light max-w-lg leading-relaxed mb-10 drop-shadow-lg"
            id="hero3"
          >
            {content.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <a 
                href={content.primaryCta.to}
                className="block sm:inline-block px-8 py-4 bg-white text-premium-charcoal uppercase text-[11px] font-bold tracking-[0.25em] transition-all duration-500 luxury-button-shine hero-border-glow shadow-2xl hover:bg-white/90 text-center w-full sm:w-auto"
              >
                {content.primaryCta.label}
              </a>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <a 
                href={content.secondaryCta.to}
                className="block sm:inline-block px-8 py-4 border border-white/40 text-white backdrop-blur-md bg-white/5 uppercase text-[11px] font-bold tracking-[0.25em] transition-all duration-500 luxury-button-shine hover:bg-white/10 text-center w-full sm:w-auto"
              >
                {content.secondaryCta.label}
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side: Showcase Image */}
        {showcaseImage && (
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="hidden lg:flex justify-end w-full"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-lg aspect-square lg:aspect-[4/5] xl:aspect-square overflow-hidden rounded-2xl border border-white/20 p-2 bg-white/5 backdrop-blur-sm hero-border-glow shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform rotate-1 hover:rotate-0 hover:shadow-[0_45px_75px_rgba(201,162,39,0.15)] transition-all duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-premium-charcoal/80 to-transparent z-10 opacity-30 pointer-events-none rounded-2xl"></div>
              <img
                src={showcaseImage.imageSrc}
                alt={showcaseImage.imageAlt}
                className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-105 text-transparent outline-none border-none pointer-events-none"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HeroContent;
