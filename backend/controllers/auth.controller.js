import { User, Employer } from '../models/index.js';
import { sendTokenResponse } from '../utils/generateToken.js';

/**
 * @desc    Register a new job seeker
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerJobSeeker = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: 'jobseeker'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * @desc    Register a new employer
 * @route   POST /api/auth/register-employer
 * @access  Public
 */
export const registerEmployer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      companyEmail,
      password,
      phone,
      state,
      city,
      address,
      termsAccepted
    } = req.body;

    // Check if employer already exists
    const existingEmployer = await Employer.findOne({ companyEmail });

    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new employer
    const employer = await Employer.create({
      firstName,
      lastName,
      companyEmail,
      password,
      phone: phone.replace(/\D/g, ''), // Remove non-digits
      state,
      city,
      address,
      termsAccepted
    });

    sendTokenResponse(employer, 201, res);
  } catch (error) {
    console.error('Employer register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * @desc    Login user (job seeker or employer)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Try to find user (job seeker first, then employer)
    let user = await User.findOne({ email }).select('+password');
    let isEmployer = false;

    if (!user) {
      user = await Employer.findOne({ companyEmail: email }).select('+password');
      isEmployer = true;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

/**
 * @desc    Logout user / clear token
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
