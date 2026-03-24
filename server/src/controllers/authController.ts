import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import sendEmail from '../services/emailService';

import passport from 'passport';

const generateToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

// Controller for handling authentication logic
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true // Assume auto-verified for signup as per request details (OTP is for forgot password flow mostly)
    });

    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({ token, user: { id: newUser._id, name, email } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || (user.password && !(await bcrypt.compare(password, user.password)))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    if (!user) {
      return res.redirect('http://localhost:5173/login?error=auth_failed');
    }

    const token = generateToken(user._id);
    // Redirect to frontend with token in the URL (it will be caught and saved in localStorage)
    res.redirect(`http://localhost:5173/login?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user._id, name: user.name, email: user.email }))}`);
  } catch (error: any) {
    res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(error.message)}`);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Password Reset OTP - AZLIK',
      text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
      html: `<div style="padding: 20px; text-align: center;"><h2>AZLIK Password Reset</h2><p>Use the following OTP to reset your password:</p><h1>${otp}</h1><p>Expired in 10 minutes.</p></div>`
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Session expired or invalid. Please try again.' });
    }

    user.password = await bcrypt.hash(password, 12);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. Please login.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
