import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category';

const toSlug = (text: string) => text.toLowerCase().replace(/\./g, '').replace(/ \+ /g, '-').replace(/ /g, '-');

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const defaults = [
      'Towel Rack', 'Towel Rod', 'Napkin Ring', 'Robe Hook', 
      'Tumbler Holder', 'Liquid Dispenser', 'Dual Soapdish', 
      'Soapdish + Tumbler', 'Paper Holder'
    ];

    // Check if current categories match defaults. If there's an 'Xyz' or other unwanted ones, we reset.
    const currentNames = categories.map(c => c.name);
    const hasUnwanted = currentNames.some(name => ['Bath Accessories', 'Jali Accessories', 'Showers', 'Xyz'].includes(name));

    if (categories.length === 0 || hasUnwanted) {
      if (hasUnwanted) {
        await Category.deleteMany({ name: { $in: ['Bath Accessories', 'Jali Accessories', 'Showers', 'Xyz'] } });
      }
      
      const seedData = defaults.map(name => ({
        name,
        slug: toSlug(name),
        type: 'accessory'
      }));
      
      // Only insert if not already present
      for (const item of seedData) {
        await Category.findOneAndUpdate(
          { slug: item.slug },
          item,
          { upsert: true, new: true }
        );
      }
      
      const updatedCategories = await Category.find().sort({ name: 1 });
      return res.status(200).json(updatedCategories);
    }
    
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    // According to requirement: Remove / delete all products mapped to that category
    // We match by product.accessoryCategory (the category name)
    const Product = mongoose.model('Product');
    await Product.deleteMany({ accessoryCategory: category.name });
    
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category and its products deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    
    const slug = toSlug(name);
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({
      name,
      slug,
      type: 'accessory'
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
