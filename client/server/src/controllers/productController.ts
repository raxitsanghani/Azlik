import { Request, Response } from 'express';
import Product from '../models/Product';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;
    const query: any = { status: 'Active' };
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ featured: true, status: 'Active' }).limit(10);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySku = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku, status: 'Active' });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    let images: string[] = [];
    
    if (req.body.existingImages) {
        if (Array.isArray(req.body.existingImages)) {
            images.push(...req.body.existingImages);
        } else {
            images.push(req.body.existingImages);
        }
    }
    
    if (req.files && Array.isArray(req.files)) {
      const host = req.get('host');
      const protocol = req.protocol;
      const baseUrl = `${protocol}://${host}`;
      const newImages = req.files.map((file: any) => `${baseUrl}/uploads/products/${file.filename}`);
      images.push(...newImages);
    }

    const productData = { ...req.body };
    if (images.length > 0) {
      productData.image = images[0];
      productData.images = images;
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    let images: string[] = [];
    
    if (req.body.existingImages) {
        if (Array.isArray(req.body.existingImages)) {
            images.push(...req.body.existingImages);
        } else {
            images.push(req.body.existingImages);
        }
    }
    
    if (req.files && Array.isArray(req.files)) {
      const host = req.get('host');
      const protocol = req.protocol;
      const baseUrl = `${protocol}://${host}`;
      const newImages = req.files.map((file: any) => `${baseUrl}/uploads/products/${file.filename}`);
      images.push(...newImages);
    }

    const productData = { ...req.body };
    if (images.length > 0) {
      productData.image = images[0];
      productData.images = images;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
