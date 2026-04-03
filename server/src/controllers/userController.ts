
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (phone !== undefined) user.phone = phone;

      const updatedUser = await user.save();
      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid current password' });
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      res.status(200).json({ message: 'Password changed successfully' });
    } else if (user && !user.password) {
      // User registered with Google and doesn't have a password yet
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      res.status(200).json({ message: 'Password set successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const avatarUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    
    const user = await User.findById(req.user._id);

    if (user) {
      user.avatar = avatarUrl;
      const updatedUser = await user.save();
      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User permanently deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

