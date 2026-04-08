import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const products = [
  // Faucets
  {
    sku: 'F-101',
    name: 'Aura Waterfall Faucet',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
    description: 'A sleek, wall-mounted waterfall faucet that brings a touch of nature into your modern bathroom.',
    category: 'faucets',
    material: 'Solid Brass',
    finish: 'Brushed Gold',
    dimensions: '200mm x 150mm',
    featured: true,
    status: 'Active'
  },
  {
    sku: 'F-102',
    name: 'Nordic Mono Mixer',
    image: 'https://images.unsplash.com/photo-1631675591413-3e05a7a5903b?q=80&w=2070&auto=format&fit=crop',
    description: 'Single handle mixer with a minimalist Nordic design, perfect for contemporary basins.',
    category: 'faucets',
    material: 'Brass',
    finish: 'Gunmetal Grey',
    dimensions: '160mm Height',
    status: 'Active'
  },
  {
    sku: 'F-103',
    name: 'Prism Basin Mixer',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=2070&auto=format&fit=crop',
    description: 'Geometric precision meets fluid functionality in this premium chrome basin mixer.',
    category: 'faucets',
    material: 'Solid Brass',
    finish: 'Chrome',
    dimensions: '180mm Height',
    status: 'Active'
  },

  // Showers
  {
    sku: 'S-201',
    name: 'Zenith Rain Shower',
    image: 'https://images.unsplash.com/photo-1559839734-2b71fa9962c7?q=80&w=2070&auto=format&fit=crop',
    description: 'Experience the sensation of natural rainfall with our ultra-slim Zenith rain shower head.',
    category: 'showers',
    material: 'Stainless Steel',
    finish: 'Matte Black',
    dimensions: '300mm Diameter',
    featured: true,
    status: 'Active'
  },
  {
    sku: 'S-202',
    name: 'Elysian Hand Shower',
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7b5970c?q=80&w=2070&auto=format&fit=crop',
    description: 'Versatile hand shower with multiple spray patterns for a personalized cleaning experience.',
    category: 'showers',
    material: 'Zinc Alloy',
    finish: 'Brushed Gold',
    dimensions: '250mm Length',
    status: 'Active'
  },

  // Mirrors
  {
    sku: 'M-301',
    name: 'Luminae Smart Mirror',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2070&auto=format&fit=crop',
    description: 'An intelligent mirror featuring integrated LED ambient lighting and anti-fog technology.',
    category: 'mirrors',
    material: 'High-Definition Glass',
    finish: 'Frameless',
    dimensions: '800mm x 600mm',
    featured: true,
    status: 'Active'
  },
  {
    sku: 'M-302',
    name: 'Halo Backlit Mirror',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop',
    description: 'Circular mirror with soft halo backlighting, perfect for mood lighting in the bathroom.',
    category: 'mirrors',
    material: 'High-Definition Glass',
    finish: 'Chrome Frame',
    dimensions: '700mm Diameter',
    status: 'Active'
  },

  // Accessories
  {
    sku: 'A-401',
    name: 'Orb Soap Dispenser',
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?q=80&w=2070&auto=format&fit=crop',
    description: 'A sculptural soap dispenser that adds a touch of elegance to any vanity.',
    category: 'accessories',
    material: 'Ceramic',
    finish: 'Marble Texture',
    dimensions: '180mm x 80mm',
    status: 'Active'
  },
  {
    sku: 'A-402',
    name: 'Vault Storage Jar',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    description: 'Elegant glass storage jar with a weighted metal lid for bathroom essentials.',
    category: 'accessories',
    material: 'Glass & Zinc',
    finish: 'Matte Black',
    dimensions: '120mm Height',
    status: 'Active'
  },

  // Towel Holders
  {
    sku: 'TH-501',
    name: 'Linear Towel Rail',
    image: 'https://images.unsplash.com/photo-1595428774751-2495ea501633?q=80&w=2070&auto=format&fit=crop',
    description: 'Minimalist linear design for the perfect organization of your premium towels.',
    category: 'towel-holders',
    material: 'Stainless Steel',
    finish: 'Chrome',
    dimensions: '600mm Long',
    status: 'Active'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/azlik';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');
    
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropCollection('products');
        console.log('Dropped existing products collection');
      }
    } catch (e) {
      console.log('Collection "products" did not exist, skipping drop.');
    }
    
    await Product.insertMany(products);
    console.log('Seed products inserted successfully');
    
    // Seed Admin User
    const adminEmail = 'azlikadmin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('azlikadmin21', 12);
      await User.create({
        name: 'Azlik Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('Seed admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
