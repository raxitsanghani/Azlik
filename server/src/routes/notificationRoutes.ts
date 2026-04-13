import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  clearAllNotifications 
} from '../controllers/notificationController';
import { protect, adminProtect } from '../middleware/authMiddleware';

const router = express.Router();

// All notification routes are protected and admin-only
router.use(protect, adminProtect);

router.get('/', getNotifications);
router.patch('/mark-read/:id', markAsRead);
router.patch('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/clear-all', clearAllNotifications);

export default router;
