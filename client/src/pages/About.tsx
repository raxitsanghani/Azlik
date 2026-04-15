
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, Globe, CheckCircle, ExternalLink } from 'lucide-react';
import PageLayout from '../components/common/PageLayout';
import Footer from '../components/home/Footer';

const AboutPage: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const stats = [
    { label: 'Founded', value: '1994' },
    { label: 'Crafted Products', value: '500k+' },
    { label: 'Global Presence', value: '12+' },
    { label: 'Quality Awards', value: '25+' }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-white overflow-hidden">
        {/* Luxury Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="w-full h-full"
            >
              <img 
                src="/marble_texture.png" 
                alt="Marble Background" 
                className="w-full h-full object-cover opacity-60"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="premium-subheading mb-6 tracking-[0.4em]"
            >
              The Essence of Luxury
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="premium-heading text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight"
            >
              Azlik <span className="italic block mt-2 text-4xl md:text-6xl text-premium-charcoal/30 font-normal tracking-normal">by Shreenath Industries</span>
            </motion.h1>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="w-24 h-[1px] bg-premium-charcoal mx-auto"
            ></motion.div>
          </div>
        </section>

        {/* Brand Core Identity */}
        <section className="py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div {...fadeIn}>
              <h2 className="premium-heading text-4xl md:text-5xl mb-8">Crafting <span className="italic">Excellence</span> Since 1994.</h2>
              <div className="space-y-6 text-premium-charcoal/70 font-light leading-relaxed text-lg">
                <p>
                  SHREENATH INDUSTRIES, our flagship brand **AZLIK**, specializes in the manufacture of premium bathroom accessories crafted from SS 304, known for durability, elegance, and unmatched quality.
                </p>
                <p>
                  With years of industry expertise, we are committed to delivering premium craftsmanship, modern design, and exceptional customer satisfaction.
                </p>
                <p>
                  Our focus is on building long-term relationships with dealers, distributors, and customers while continuously innovating premium bathroom solutions.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-12">
                {stats.map((stat, i) => (
                  <div key={i} className="border-l border-premium-platinum pl-6">
                    <p className="premium-heading text-3xl mb-1">{stat.value}</p>
                    <p className="premium-subheading !text-[9px]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-square lg:aspect-[4/5] bg-premium-ivory overflow-hidden premium-card"
            >
              <img 
                src="/about_factory.png" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-premium-charcoal/10 mix-blend-overlay"></div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision (Glassmorphism) */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <img src="/marble_texture.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div 
                {...fadeIn}
                className="premium-card p-12 hover:bg-white/80 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-full bg-premium-charcoal text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <h3 className="premium-heading text-3xl mb-6">Our Mission</h3>
                <p className="text-premium-charcoal/60 font-light leading-relaxed">
                  To elevate the bathroom experience from functional to ceremonial. We strive to provide architectural solutions that blend seamless utility with unparalleled aesthetic grandeur.
                </p>
              </motion.div>

              <motion.div 
                {...fadeIn}
                transition={{ ...fadeIn.transition, delay: 0.2 }}
                className="premium-card p-12 bg-premium-charcoal text-white hover:bg-premium-navy transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-full bg-white text-premium-charcoal flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Award size={20} />
                </div>
                <h3 className="premium-heading text-3xl mb-6 text-white">Our Vision</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  To be the global benchmark for luxury bathroom accessories, recognized not just for the products we create, but for the sanctuaries we help build.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-32 bg-premium-ivory">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <motion.div {...fadeIn}>
              <p className="premium-subheading mb-6 tracking-widest">Collaborations</p>
              <h2 className="premium-heading text-5xl md:text-6xl mb-12">Dealer & Distributor <span className="italic">Partnerships</span></h2>
              <p className="text-premium-charcoal/60 font-light text-lg mb-12 leading-relaxed">
                We are expanding our prestigious network. Join Azlik in our journey to redefine luxury interiors. We offer exclusive support, premium marketing assets, and a partnership built on mutual growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                <button className="premium-button min-w-[240px] flex items-center justify-center gap-2 group">
                  Become a Partner <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button className="premium-btn-outline min-w-[240px]">
                  Download Catalog
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-24 opacity-30">
               <div className="flex flex-col items-center gap-4">
                  <Globe size={40} strokeWidth={1} />
                  <span className="premium-subheading !text-[8px]">Global Export</span>
               </div>
               <div className="flex flex-col items-center gap-4">
                  <Users size={40} strokeWidth={1} />
                  <span className="premium-subheading !text-[8px]">Dealer Network</span>
               </div>
               <div className="flex flex-col items-center gap-4">
                  <Shield size={40} strokeWidth={1} />
                  <span className="premium-subheading !text-[8px]">100% SS 304</span>
               </div>
               <div className="flex flex-col items-center gap-4">
                  <CheckCircle size={40} strokeWidth={1} />
                  <span className="premium-subheading !text-[8px]">Quality Assured</span>
               </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="premium-heading text-4xl mb-12">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 border border-gray-100 shadow-sm rounded-xl hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-premium-charcoal text-lg mb-4">Corporate Office</h4>
                <p className="text-gray-500 text-sm">Shreenath Industries,<br/>GIDC Phase 2,<br/>Rajkot, Gujarat - 360004</p>
              </div>
              <div className="p-8 border border-gray-100 shadow-sm rounded-xl hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-premium-charcoal text-lg mb-4">Direct Inquiry</h4>
                <p className="text-gray-500 text-sm mb-2">Phone: +91 99999 88888</p>
                <p className="text-gray-500 text-sm">Sales: +91 88888 77777</p>
              </div>
              <div className="p-8 border border-gray-100 shadow-sm rounded-xl hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-premium-charcoal text-lg mb-4">Digital Support</h4>
                <p className="text-gray-500 text-sm mb-2">info@shreenath-industries.com</p>
                <p className="text-gray-500 text-sm">support@azlik.com</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageLayout>
  );
};

export default AboutPage;
