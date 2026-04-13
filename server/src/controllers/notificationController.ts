import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ isRead: false });
    res.status(200).json({ notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const clearAllNotifications = async (req: Request, res: Response) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Internal utility to create notifications
export const createNotification = async (data: { title: string, message: string, type: string, metadata?: any }) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};
