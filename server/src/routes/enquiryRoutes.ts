import { Router } from 'express';
import { createEnquiry, getUserEnquiries, getEnquiryById } from '../controllers/enquiryController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', createEnquiry);
router.get('/user/:userId', protect, getUserEnquiries);
router.get('/:id', protect, getEnquiryById);

export default router;
