import React from 'react';
import { motion } from 'framer-motion';
import type { HomeHeroContent } from '../../data/homeHero';

type HeroContentProps = {
  content: HomeHeroContent;
};

// Text-only layer kept independent from the background.
const HeroContent: React.FC<HeroContentProps> = ({ content }) => {
  return (
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-3xl rounded-none bg-premium-charcoal/35 backdrop-blur-xs border border-white/10 p-8 sm:p-10 text-left">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="premium-subheading text-premium-ivory/85 mb-6 font-bold"
        >
          {content.subheading}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="premium-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F8F8F6] mb-6 leading-[1.05]"
        >
          {content.heading}{' '}
          {content.headingEmphasis ? (
            <span className="italic font-normal text-premium-marble">
              {content.headingEmphasis}
            </span>
          ) : null}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-premium-platinum/70 font-light max-w-xl leading-relaxed"
        >
          {content.description}
        </motion.p>
      </div>
    </div>
  );
};

export default HeroContent;

