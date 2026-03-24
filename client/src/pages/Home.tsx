import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import Collections from '../components/home/Collections';
import WhyChooseUs from '../components/home/WhyChooseUs';
import BrandStory from '../components/home/BrandStory';
import ProductCarousel from '../components/home/ProductCarousel';
import Footer from '../components/home/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';
import PageLayout from '../components/common/PageLayout';

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <PageLayout>
      <div className="relative bg-white select-none overflow-x-hidden">
        {/* ... progress bar ... */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-premium-charcoal origin-left z-[100]"
          style={{ scaleX }}
        />

        {/* Navigation (Simplified Overlay) */}
        <header className="fixed top-0 inset-x-0 z-[90] flex justify-between items-center px-10 py-8 mix-blend-difference pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-2xl font-serif text-white tracking-[0.2em] italic">AZLIK</h1>
          </div>
          <div className="pointer-events-auto hidden md:flex items-center gap-12">
            {['Collections', 'Story', 'Showcase', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="premium-subheading !text-white hover:!text-white/60 transition-colors"
              >
                {item}
              </a>
            ))}
            {isLoggedIn ? (
              <Link to="/dashboard" className="premium-subheading !text-white border border-white/20 px-6 py-2 hover:bg-white hover:!text-black transition-all duration-500 pointer-events-auto">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="premium-subheading !text-white border border-white/20 px-6 py-2 hover:bg-white hover:!text-black transition-all duration-500 pointer-events-auto">
                Login
              </Link>
            )}
          </div>
        </header>

        <main>
          <div id="hero"><Hero /></div>
          <div id="collections"><Collections /></div>
          <div id="story"><BrandStory /></div>
          <WhyChooseUs />
          <div id="showcase"><ProductCarousel /></div>
        </main>

        <Footer />
      </div>
    </PageLayout>
  );
};

export default Home;
