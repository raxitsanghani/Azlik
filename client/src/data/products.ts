export interface ProductVariant {
  colorName: string;
  images: string[];
  stock: number;
  price?: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  description: string;
  category: 'faucets' | 'showers' | 'mirrors' | 'accessories' | 'towel-holders' | string;
  material: string;
  finish: string;
  dimensions: string;
  featured?: boolean;
  status?: string;
  variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: 'f-001',
    name: 'Aura Waterfall Faucet',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
    description: 'A sleek, wall-mounted waterfall faucet that brings a touch of nature into your modern bathroom.',
    category: 'faucets',
    material: 'Solid Brass',
    finish: 'Brushed Gold',
    dimensions: '200mm x 150mm',
    featured: true
  },
  {
    id: 's-001',
    name: 'Zenith Rain Shower',
    image: 'https://images.unsplash.com/photo-1559839734-2b71fa9962c7?q=80&w=2070&auto=format&fit=crop',
    description: 'Experience the sensation of natural rainfall with our ultra-slim Zenith rain shower head.',
    category: 'showers',
    material: 'Stainless Steel',
    finish: 'Matte Black',
    dimensions: '300mm Diameter',
    featured: true
  },
  {
    id: 'm-001',
    name: 'Luminae Smart Mirror',
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7b5970c?q=80&w=2070&auto=format&fit=crop',
    description: 'An intelligent mirror featuring integrated LED ambient lighting and anti-fog technology.',
    category: 'mirrors',
    material: 'High-Definition Glass',
    finish: 'Frameless',
    dimensions: '800mm x 600mm',
    featured: true
  },
  {
    id: 'th-001',
    name: 'Linear Towel Holder',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    description: 'Minimalist linear design for the perfect organization of your premium towels.',
    category: 'towel-holders',
    material: 'Zinc Alloy',
    finish: 'Chrome',
    dimensions: '600mm Long'
  },
  {
    id: 'a-001',
    name: 'Orb Soap Dispenser',
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?q=80&w=2070&auto=format&fit=crop',
    description: 'A sculptural soap dispenser that adds a touch of elegance to any vanity.',
    category: 'accessories',
    material: 'Ceramic',
    finish: 'Marble Texture',
    dimensions: '180mm x 80mm'
  },
  {
    id: 'f-002',
    name: 'Nordic Mono Mixer',
    image: 'https://images.unsplash.com/photo-1631675591413-3e05a7a5903b?q=80&w=2070&auto=format&fit=crop',
    description: 'Single handle mixer with a minimalist Nordic design, perfect for contemporary basins.',
    category: 'faucets',
    material: 'Brass',
    finish: 'Gunmetal Grey',
    dimensions: '160mm Height'
  }
];
