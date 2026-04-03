import React from 'react';
import { motion } from 'framer-motion';

type HeroBackgroundProps = {
  imageSrc: string;
  imageAlt: string;
};

// Background-only layer: image + dark overlays for contrast.
// No text must live in this component so it can be edited independently.
const HeroBackground: React.FC<HeroBackgroundProps> = ({ imageSrc, imageAlt }) => {
  return (
    <motion.div
      initial={{ scale: 1.06 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-0"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />

      {/* Luxury vignette + dark gradient for guaranteed text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal/90 via-premium-charcoal/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-premium-charcoal/80 via-premium-charcoal/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(201,162,39,0.22)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(14,165,233,0.06)_0%,transparent_50%)]" />
    </motion.div>
  );
};

export default HeroBackground;

