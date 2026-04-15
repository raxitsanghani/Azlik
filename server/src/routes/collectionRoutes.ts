import express from 'express';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collectionController';
import { protect, adminProtect } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import { makeStorage } from '../config/cloudinary';

const router = express.Router();

const upload = multer({
  storage: makeStorage('collections'),
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

router.get('/', getAllCollections);
router.get('/:id', getCollectionById);

// Admin only routes
router.post('/', protect, adminProtect, upload.any(), createCollection);
router.put('/:id', protect, adminProtect, upload.any(), updateCollection);
router.delete('/:id', protect, adminProtect, deleteCollection);

export default router;
