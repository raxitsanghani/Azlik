
import { Router } from 'express';
import { getProfile, updateProfile, changePassword, uploadAvatar, getAllUsers, deleteUser } from '../controllers/userController';
import { protect, adminProtect } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import { makeStorage } from '../config/cloudinary';

const router = Router();

const upload = multer({
  storage: makeStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/change-password', protect, changePassword);
router.get('/all', protect, adminProtect, getAllUsers);
router.delete('/:id', protect, adminProtect, deleteUser);

export default router;
