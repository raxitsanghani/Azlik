import React, { useEffect } from 'react';
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
