import { Request, Response } from 'express';
import Product from '../models/Product';
import User from '../models/User';
import Enquiry from '../models/Enquiry';

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();
    
    // For demo purposes, we'll return some mock trend data as well
    res.status(200).json({
      totalProducts,
      totalUsers,
      totalEnquiries,
      totalVisitors: 24592, // Mock for now
      trends: {
        products: '+3.1%',
        users: '-1.4%',
        enquiries: '+8.2%',
        visitors: '+12.5%'
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
