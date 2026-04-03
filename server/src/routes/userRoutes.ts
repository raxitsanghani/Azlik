
import { Router } from 'express';
import { getProfile, updateProfile, changePassword, uploadAvatar, getAllUsers, deleteUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../uploads');
    cb(null, uploadPath);
  },
  filename: (req: any, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
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
router.get('/all', getAllUsers);
router.delete('/:id', deleteUser);

export default router;
