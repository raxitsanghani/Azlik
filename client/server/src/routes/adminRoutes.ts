import { Router } from 'express';
import { getStats } from '../controllers/adminController';
import { protect, adminProtect } from '../middleware/authMiddleware';

const router = Router();

router.get('/stats', protect, adminProtect, getStats);

export default router;
