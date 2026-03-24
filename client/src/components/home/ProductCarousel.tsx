
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  { id: 1, name: 'Obsidian Matte Faucet', category: 'Platinum Series', price: '$450', image: '/collection_faucets.png' },
  { id: 2, name: 'Royal Navy Rain Shower', category: 'Azure Collection', price: '$1,200', image: '/collection_showers.png' },
  { id: 3, name: 'Carrara Marble Basin', category: 'Signature Series', price: '$2,800', image: '/collection_basins.png' },
  { id: 4, name: 'Charcoal Silk Soap Set', category: 'Essentials', price: '$180', image: '/collection_accessories.png' },
  { id: 5, name: 'Titanium Towel Rail', category: 'Modernist', price: '$320', image: '/brand_story_craftsmanship.png' },
  { id: 6, name: 'Slate Infinity Mirror', category: 'Reflexions', price: '$950', image: '/hero_bathroom_sanctuary.png' }
];

const ProductCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
        <div>
          <p className="premium-subheading mb-4">Summer 2026 Collection</p>
          <h2 className="premium-heading text-4xl">New Arrivals</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 border border-premium-charcoal/10 flex items-center justify-center hover:bg-premium-charcoal hover:text-white transition-all duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 border border-premium-charcoal/10 flex items-center justify-center hover:bg-premium-charcoal hover:text-white transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 px-6 md:px-[10%] no-scrollbar snap-x snap-mandatory pb-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -10 }}
            className="min-w-[300px] md:min-w-[400px] snap-start group"
          >
            <div className="aspect-[4/5] bg-premium-ivory relative overflow-hidden mb-6 rounded-sm shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-premium-charcoal shadow-sm">
                  {product.category}
                </span>
              </div>
              {/* Very light overlay on hover only */}
              <div className="absolute inset-0 bg-premium-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="premium-heading text-xl mb-1">{product.name}</h3>
                <p className="premium-subheading !text-[9px] !text-premium-charcoal/40 tracking-widest">Available for Enquiry</p>
              </div>
              <span className="font-serif text-lg">{product.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;
