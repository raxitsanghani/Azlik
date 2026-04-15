import { Router } from 'express';
import { getAllProducts, getProductById, getProductBySku, getFeaturedProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protect, adminProtect } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../uploads/products');
    cb(null, uploadPath);
  },
  filename: (req: any, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .webp format allowed!'));
  }
});

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/sku/:sku', getProductBySku);

// Admin Routes
router.post('/', protect, adminProtect, upload.array('images', 10), createProduct);
router.put('/:id', protect, adminProtect, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, adminProtect, deleteProduct);

export default router;
