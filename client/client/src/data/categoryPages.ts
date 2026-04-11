import type { Product } from './products';

export type CategorySlug = 'collections' | 'faucets' | 'showers' | 'mirrors' | 'accessories' | 'towel-holders';

export type CategoryPageHero = {
  subheading: string;
  title: string;
  description: string;
  imageSrc: string;
};

export type CategoryPageGroup = {
  title: string;
  categories: Product['category'][];
  description?: string;
};

export type CategoryPageConfig = {
  slug: CategorySlug;
  hero: CategoryPageHero;
  // Which products belong to this page.
  allowedCategories: Product['category'][];
  // Optional premium grouping (e.g. "Featured Collections").
  groups?: CategoryPageGroup[];
};

export const categoryPages: Record<CategorySlug, CategoryPageConfig> = {
  collections: {
    slug: 'collections',
    hero: {
      subheading: 'Featured Collections',
      title: 'Luxury Bathroom Showpieces',
      description:
        'Explore our most-coveted premium fittings and accessories, curated for modern interiors and refined everyday rituals.',
      imageSrc: '/brand_story_craftsmanship.png',
    },
    allowedCategories: ['collections', 'faucets', 'showers', 'mirrors', 'accessories'],
    groups: [
      { title: 'Faucets', categories: ['faucets'], description: 'Watercraft with architectural precision.' },
      { title: 'Showers', categories: ['showers'], description: 'Rainfall experiences, sculpted for calm.' },
      { title: 'Mirrors', categories: ['mirrors'], description: 'Smart reflections with anti-fog performance.' },
      { title: 'Accessories', categories: ['accessories', 'towel-holders'], description: 'Finishing touches designed to elevate.' },
    ],
  },
  faucets: {
    slug: 'faucets',
    hero: {
      subheading: 'Premium Faucets',
      title: 'Sculpted Water Essentials',
      description: 'Minimal forms, premium materials, and smooth-flow performance for refined bathrooms.',
      imageSrc: '/collection_faucets.png',
    },
    allowedCategories: ['faucets'],
  },
  showers: {
    slug: 'showers',
    hero: {
      subheading: 'Luxury Showers',
      title: 'Rainfall & Ritual',
      description: 'Ultra-sleek shower fittings that transform daily routines into calm, elevated experiences.',
      imageSrc: '/collection_showers.png',
    },
    allowedCategories: ['showers'],
  },
  mirrors: {
    slug: 'mirrors',
    hero: {
      subheading: 'Smart Mirrors',
      title: 'Light, Clarity, Control',
      description: 'Anti-fog performance and elegant ambient illumination for a modern showroom finish.',
      imageSrc: '/modern_hero.jpg',
    },
    allowedCategories: ['mirrors'],
  },
  accessories: {
    slug: 'accessories',
    hero: {
      subheading: 'Bathroom Accessories',
      title: 'The Finishing Touch',
      description: 'Premium accessories designed to complement your space with timeless elegance.',
      imageSrc: '/collection_accessories.png',
    },
    allowedCategories: ['accessories', 'towel-holders'],
  },
  'towel-holders': {
    slug: 'towel-holders',
    hero: {
      subheading: 'Towel Holders',
      title: 'Functional Elegance',
      description: 'Premium towel holders engineered for durability, balance, and minimal luxury styling.',
      imageSrc: '/collection_accessories.png',
    },
    allowedCategories: ['towel-holders'],
  },
};

