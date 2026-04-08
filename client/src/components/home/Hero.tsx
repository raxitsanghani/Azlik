
import React from 'react';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import { homeHero } from '../../data/homeHero';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-premium-charcoal min-h-[90vh]">
      <HeroBackground
        imageSrc={homeHero.background.imageSrc}
        imageAlt={homeHero.background.imageAlt}
      />

      <div className="relative z-10 min-h-[90vh] flex items-center w-full">
        <HeroContent content={homeHero.content} showcaseImage={homeHero.showcaseImage} />
      </div>
    </section>
  );
};

export default Hero;
