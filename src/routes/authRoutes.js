import express from 'express';
import { 
  login, 
  user, 
  verifyOTP, 
  refreshToken, 
  Signup, 
  register,
  getProfile 
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/signup', Signup);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.get('/user', authMiddleware, user);
router.post('/user', authMiddleware, user);

export default router;