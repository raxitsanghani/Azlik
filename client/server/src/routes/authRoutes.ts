import { Router } from 'express';
import { signup, login, forgotPassword, verifyOtp, resetPassword, googleAuthCallback } from '../controllers/authController';
import passport from 'passport';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

export default router;
