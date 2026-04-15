import { Request, Response } from 'express';
import Product from '../models/Product';
import { createNotification } from './notificationController';

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
    
    // 1. Process Main Images (Files + Existing)
    if (req.body.existingImages) {
        if (Array.isArray(req.body.existingImages)) {
            images.push(...req.body.existingImages);
        } else {
            images.push(req.body.existingImages);
        }
    }
    
    if (req.files && Array.isArray(req.files)) {
      const mainImages = req.files.filter((f: any) => f.fieldname === 'images' || f.fieldname === 'image');
      const newImages = mainImages.map((file: any) => file.path);
      images.push(...newImages);
    }

    // 2. Prepare Product Data (Exclude variants for now)
    const { variants: rawVariants, existingImages, ...basicBody } = req.body;
    const productData: any = { ...basicBody };

    // Sanitize numeric fields
    if (productData.price === '' || productData.price === undefined || productData.price === 'null') {
      delete productData.price;
    } else {
      productData.price = Number(productData.price);
    }

    if (productData.featured === 'true') productData.featured = true;
    if (productData.featured === 'false') productData.featured = false;

    // 3. Handle Variants and Variant Images
    let finalVariants: any[] = [];
    if (rawVariants) {
      try {
        const parsedVariants = typeof rawVariants === 'string' ? JSON.parse(rawVariants) : rawVariants;
        finalVariants = parsedVariants.map((v: any, index: number) => {
          let variantImages: string[] = [];
          if (v.existingImages && Array.isArray(v.existingImages)) {
            variantImages.push(...v.existingImages);
          } else if (v.existingImages) {
            variantImages.push(v.existingImages);
          }

          if (req.files && Array.isArray(req.files)) {
            const vFiles = req.files.filter((f: any) => f.fieldname === `variantImages_${index}`);
            const vNewImages = vFiles.map((file: any) => file.path);
            variantImages.push(...vNewImages);
          }
          
          return {
            ...v,
            images: variantImages,
            stock: v.stock === '' || v.stock === undefined ? 0 : Number(v.stock),
            price: v.price === '' || v.price === undefined ? undefined : Number(v.price)
          };
        });
        productData.variants = finalVariants;
      } catch (err) {
         console.error('Failed to parse variants:', err);
      }
    }

    // 4. Final Image Assignment (Fallback to variant image if main is missing)
    if (images.length > 0) {
      productData.image = images[0];
      productData.images = images;
    } else if (finalVariants.length > 0 && finalVariants[0].images?.length > 0) {
      // If no main image but variants have images, pick the first variant's first image
      productData.image = finalVariants[0].images[0];
      productData.images = [finalVariants[0].images[0]];
    }

    const product = new Product(productData);
    await product.save();

    // Create Notification
    await createNotification({
      title: 'New Product Added',
      message: `${productData.name} was successfully added to the catalog.`,
      type: 'product_added',
      metadata: { productId: product._id }
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Create Product Error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    let images: string[] = [];
    
    // 1. Process Main Images (Files + Existing)
    if (req.body.existingImages) {
        if (Array.isArray(req.body.existingImages)) {
            images.push(...req.body.existingImages);
        } else {
            images.push(req.body.existingImages);
        }
    }
    
    if (req.files && Array.isArray(req.files)) {
      const mainImages = req.files.filter((f: any) => f.fieldname === 'images' || f.fieldname === 'image');
      const newImages = mainImages.map((file: any) => file.path);
      images.push(...newImages);
    }

    // 2. Prepare Product Data (Exclude variants for now)
    const { variants: rawVariants, existingImages, ...basicBody } = req.body;
    const productData: any = { ...basicBody };

    // Sanitize numeric fields
    if (productData.price === '' || productData.price === undefined || productData.price === 'null') {
      delete productData.price;
    } else {
      productData.price = Number(productData.price);
    }

    if (productData.featured === 'true') productData.featured = true;
    if (productData.featured === 'false') productData.featured = false;

    // 3. Handle Variants and Variant Images
    let finalVariants: any[] = [];
    if (rawVariants) {
      try {
        const parsedVariants = typeof rawVariants === 'string' ? JSON.parse(rawVariants) : rawVariants;
        finalVariants = parsedVariants.map((v: any, index: number) => {
          let variantImages: string[] = [];
          if (v.existingImages && Array.isArray(v.existingImages)) {
            variantImages.push(...v.existingImages);
          } else if (v.existingImages) {
            variantImages.push(v.existingImages);
          }

          if (req.files && Array.isArray(req.files)) {
            const vFiles = req.files.filter((f: any) => f.fieldname === `variantImages_${index}`);
            const vNewImages = vFiles.map((file: any) => file.path);
            variantImages.push(...vNewImages);
          }
          
          return {
            ...v,
            images: variantImages,
            stock: v.stock === '' || v.stock === undefined ? 0 : Number(v.stock),
            price: v.price === '' || v.price === undefined ? undefined : Number(v.price)
          };
        });
        productData.variants = finalVariants;
      } catch (err) {
         console.error('Failed to parse variants:', err);
      }
    }

    // 4. Final Image Assignment (Fallback to variant image if main is missing)
    if (images.length > 0) {
      productData.image = images[0];
      productData.images = images;
    } else if (finalVariants.length > 0 && finalVariants[0].images?.length > 0) {
      productData.image = finalVariants[0].images[0];
      productData.images = [finalVariants[0].images[0]];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error: any) {
    console.error('Update Product Error:', error);
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
