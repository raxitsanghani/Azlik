import { Request, Response } from 'express';
import Enquiry from '../models/Enquiry';
import User from '../models/User';
import sendEmail from '../services/emailService';

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { productId, fullName, email, phone, city, message, userId } = req.body;

    if (!productId || !fullName || !email || !phone || !message) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newEnquiry = new Enquiry({
      product: productId,
      user: userId,
      fullName,
      email,
      phone,
      city,
      message,
    });

    await newEnquiry.save();

    // Optionally increment user enquiries count
    if (userId) {
      await User.findByIdAndUpdate(userId, { $inc: { enquiriesCount: 1 } });
    }

    // Send notification email (assuming admin email is configured in process.env.ADMIN_EMAIL)
    try {
      await sendEmail({
        to: email, // Copy to user
        subject: 'Enquiry Received - AZLIK',
        text: `Dear ${fullName},\n\nWe have received your enquiry for our product. Our team will contact you shortly.\n\nMessage: ${message}`,
        html: `<div><h2>Thank you for your enquiry</h2><p>Our team will get back to you within 24 hours.</p></div>`
      });
      
      // Notify Admin
      if (process.env.ADMIN_EMAIL) {
         await sendEmail({
           to: process.env.ADMIN_EMAIL,
           subject: 'New Product Enquiry',
           text: `A new enquiry has been submitted by ${fullName} (${email}).\n\nMessage: ${message}`,
         });
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.status(201).json(newEnquiry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserEnquiries = async (req: Request, res: Response) => {
  try {
    // This assumes req.user was populated by authMiddleware (which we'll check/add)
    const userId = (req as any).user?.id || req.params.userId;
    if (!userId) {
       return res.status(400).json({ message: 'User ID is required' });
    }
    const enquiries = await Enquiry.find({ user: userId })
      .populate('product')
      .sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnquiryById = async (req: Request, res: Response) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
       .populate('product')
       .populate('user', 'name email');
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.status(200).json(enquiry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
