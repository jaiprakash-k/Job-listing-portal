import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  registerJobSeeker,
  registerEmployer,
  login,
  getMe,
  logout
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Job Seeker Registration Validation
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

// Employer Registration Validation
const employerRegisterValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required'),
  body('companyEmail')
    .trim()
    .notEmpty().withMessage('Company email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('termsAccepted')
    .isBoolean().withMessage('Terms acceptance is required')
    .equals('true').withMessage('You must accept the terms and conditions')
];

// Login Validation
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, handleValidation, registerJobSeeker);
router.post('/register-employer', employerRegisterValidation, handleValidation, registerEmployer);
router.post('/login', loginValidation, handleValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
