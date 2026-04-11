
import React from 'react';
import { motion } from 'framer-motion';

const BrandStory: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 space-y-10"
          >
            <div className="space-y-4">
              <p className="premium-subheading">Our Philosophy</p>
              <h2 className="premium-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
                Where <span className="italic">Craftsmanship</span> <br /> Meets Modernity.
              </h2>
            </div>
            
            <div className="space-y-6 text-premium-charcoal/70 font-light leading-relaxed text-lg">
              <p>
                Founded on the principles of architectural integrity and uncompromising quality, 
                AZLIK has been at the forefront of luxury bathroom design for over three decades.
              </p>
              <p>
                We believe that the bathroom is more than just a functional space; it is a sanctuary 
                for rejuvenation. Our team of master craftsmen and visionary designers work in 
                unison to create pieces that are as beautiful to behold as they are rewarding to use.
              </p>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col"
              >
                <span className="text-3xl font-serif text-premium-charcoal">30+</span>
                <span className="premium-subheading !text-[8px]">Years of Excellence</span>
              </motion.div>
              <div className="w-[1px] h-12 bg-premium-platinum"></div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col"
              >
                <span className="text-3xl font-serif text-premium-charcoal">150+</span>
                <span className="premium-subheading !text-[8px]">Design Awards</span>
              </motion.div>
              <div className="w-[1px] h-12 bg-premium-platinum"></div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col"
              >
                <span className="text-3xl font-serif text-premium-charcoal">50k+</span>
                <span className="premium-subheading !text-[8px]">Sanctuaries Created</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="relative z-10 aspect-[4/5] overflow-hidden shadow-2xl">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                src="/brand_story_craftsmanship.png" 
                alt="Master Craftsman sketching" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decors */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-premium-navy/5 -z-0"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -bottom-10 -left-10 w-64 h-64 border border-premium-charcoal/5 -z-0"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
