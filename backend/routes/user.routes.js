import express from 'express';
import {
  getAllJobSeekers,
  getAllEmployers,
  getUserById,
  updateProfile,
  deleteAccount
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Profile routes
router.route('/profile')
  .put(updateProfile)
  .delete(deleteAccount);

// Admin only routes
router.get('/jobseekers', authorize('admin'), getAllJobSeekers);
router.get('/employers', authorize('admin'), getAllEmployers);

// Get user by ID
router.get('/:id', getUserById);

export default router;
