
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const collections = [
  { id: 1, title: 'Designer Faucets', subtitle: 'The Flow of Elegance', image: '/collection_faucets.png' },
  { id: 2, title: 'Luxury Showers', subtitle: 'Pure Revitalization', image: '/collection_showers.png' },
  { id: 3, title: 'Bespoke Accessories', subtitle: 'Refining Details', image: '/collection_accessories.png' },
  { id: 4, title: 'Marble Basins', subtitle: 'Sculptural Sanctuary', image: '/collection_basins.png' }
];

const Collections: React.FC = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="premium-subheading mb-4"
            >
              Curated Selections
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="premium-heading text-4xl md:text-5xl lg:text-6xl text-premium-charcoal"
            >
              Featured Collections
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-premium-charcoal/60 font-light max-w-sm mb-2"
          >
            Explore our architectural ranges, each carefully crafted to bring a sense of harmony and luxury to your bathroom.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {collections.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }
              }}
              className="group relative h-[520px] overflow-hidden cursor-pointer rounded-sm shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
              <motion.div 
                className="absolute inset-0 z-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <img 
                   src={item.image} 
                   alt={item.title} 
                   className="w-full h-full object-cover transition-all duration-1000"
                />
                {/* Refined gradient overlay for text readability without obscuring product color */}
                <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 p-8 z-10 transition-transform duration-500 transform translate-y-4 group-hover:translate-y-0">
                <p className="premium-subheading text-white/80 mb-2 !tracking-widest">{item.subtitle}</p>
                <h3 className="premium-heading text-2xl text-white mb-4 drop-shadow-md">{item.title}</h3>
                <div className="h-12 flex items-center">
                  <span className="text-white text-[11px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                    View Collection <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Collections;
