export type HomeHeroContent = {
  subheading: string;
  heading: string;
  headingEmphasis?: string;
  description: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
};

export type HomeHeroConfig = {
  background: {
    imageSrc: string;
    imageAlt: string;
  };
  content: HomeHeroContent;
};

// Editable hero configuration:
// - Update `background.imageSrc` to swap the hero background image.
// - Update `content.*` to change all hero text/buttons without touching the hero layout.
export const homeHero: HomeHeroConfig = {
  background: {
    imageSrc: "/hero_bathroom_sanctuary.png",
    imageAlt: "Luxury bathroom sanctuary",
  },
  content: {
    subheading: "Premium Bathroom Accessories",
    heading: "Elevating Your Bathroom",
    headingEmphasis: "Sanctuary",
    description: "Luxury fittings crafted for modern interiors",
    primaryCta: { label: "Explore Collections", to: "/products" },
    secondaryCta: { label: "Send Enquiry", to: "/enquiries" },
  },
};

