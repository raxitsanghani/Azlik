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
// Keeping session: true (default) because we have express-session configured for state management
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login?error=auth_failed' 
}), googleAuthCallback);

export default router;
