
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Pencil, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Timeless Quality",
    desc: "Every piece is crafted using marine-grade materials to ensure it withstands the test of time."
  },
  {
    icon: Pencil,
    title: "Architectural Design",
    desc: "Our designs are inspired by minimalist architecture, focusing on clean lines and balanced proportions."
  },
  {
    icon: Sparkles,
    title: "Curated Finishes",
    desc: "Choose from our exclusive palette of hand-finished surfaces, from matte charcoal to platinum grey."
  },
  {
    icon: Clock,
    title: "Luxury Service",
    desc: "A dedicated concierge for your bathroom sanctuary, providing expert advice from concept to installation."
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-32 bg-premium-ivory relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-premium-platinum/10 -skew-x-12 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="premium-subheading mb-4">The AZLIK Heritage</p>
          <h2 className="premium-heading text-4xl md:text-5xl">Design Excellence</h2>
          <div className="w-12 h-[1px] bg-premium-charcoal/20 mx-auto mt-8"></div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }
              }}
              className="group text-center"
            >
              <div className="w-20 h-20 bg-white shadow-xl shadow-premium-charcoal/5 flex items-center justify-center mx-auto mb-8 relative transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="absolute inset-0 border border-premium-charcoal/5 scale-90 group-hover:scale-110 transition-transform duration-700"></div>
                <feature.icon size={28} className="text-premium-charcoal/60 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="premium-heading text-xl mb-4 group-hover:text-premium-navy transition-colors">{feature.title}</h3>
              <p className="text-premium-charcoal/50 font-light text-sm leading-relaxed px-4">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
