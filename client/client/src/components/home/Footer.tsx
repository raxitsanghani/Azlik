
import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { ArrowRight, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-premium-charcoal text-white pt-24 pb-12">
      {/* Enquiry Banner */}
      <div className="container mx-auto px-6 -mt-48 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-premium-navy p-12 md:p-20 relative overflow-hidden shadow-2xl"
        >
          {/* Decorative background circle */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
              <p className="premium-subheading text-premium-royal mb-4 tracking-[0.4em]">Get in Touch</p>
              <h2 className="premium-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Start Your <span className="italic">Sanctuary</span> Project
              </h2>
              <p className="text-white/60 font-light text-lg">
                Our design consultants are ready to assist you in selecting the perfect 
                elements for your premium bathroom space.
              </p>
            </div>
            <Button to="/enquiries" variant="primary" className="!bg-white !text-premium-navy hover:!bg-premium-ivory w-full md:w-auto min-w-[240px]">
              Send Enquiry Now
              <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <h2 className="text-2xl font-serif tracking-[0.2em] italic">AZLIK</h2>
            <p className="text-white/40 font-light text-sm leading-relaxed max-w-xs">
              Curating the world's finest bathroom sanctuary collections since 1994. 
              Excellence in every detail, luxury in every drop.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-premium-charcoal transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="premium-subheading text-white mb-8">Collections</h4>
            <ul className="space-y-4 text-white/40 text-sm font-light">
              {[
                { name: 'Designer Faucets', path: '/products/faucets' },
                { name: 'Rainfall Showers', path: '/products/showers' },
                { name: 'Bespoke Accessories', path: '/products/accessories' },
                { name: 'Smart Mirrors', path: '/products/mirrors' },
                { name: 'Towel Holders', path: '/products/towel-holders' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="premium-subheading text-white mb-8">Service</h4>
            <ul className="space-y-4 text-white/40 text-sm font-light">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Project Consultation', path: '/enquiries' },
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Saved Products', path: '/saved-products' },
                { name: 'Login', path: '/login' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-all duration-300">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="premium-subheading text-white mb-8">Corporate HQ</h4>
            <div className="text-white/40 text-sm font-light space-y-4">
              <p>SHREENATH INDUSTRIES<br />Flagship Brand: AZLIK<br />Gujarat, India</p>
              <p>enquiries@azlik.luxury</p>
              <p>Quality Crafted SS 304</p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            © 2026 AZLIK Luxury Bathrooms. All rights reserved.
          </p>
          <div className="flex gap-8 text-white/20 text-[10px] uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
