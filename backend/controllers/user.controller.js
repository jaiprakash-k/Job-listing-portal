import { User, Employer } from '../models/index.js';

/**
 * @desc    Get all job seekers
 * @route   GET /api/users/jobseekers
 * @access  Private/Admin
 */
export const getAllJobSeekers = async (req, res) => {
  try {
    const users = await User.find({ role: 'jobseeker' });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all job seekers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job seekers',
      error: error.message
    });
  }
};

/**
 * @desc    Get all employers
 * @route   GET /api/users/employers
 * @access  Private/Admin
 */
export const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find();
    
    res.status(200).json({
      success: true,
      count: employers.length,
      data: employers
    });
  } catch (error) {
    console.error('Get all employers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employers',
      error: error.message
    });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find in User collection first
    let user = await User.findById(id);
    
    // If not found, try Employer collection
    if (!user) {
      user = await Employer.findById(id);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;
    
    // Fields that cannot be updated
    const restrictedFields = ['password', 'email', 'companyEmail', 'role'];
    
    // Remove restricted fields from update
    const updateData = { ...req.body };
    restrictedFields.forEach(field => delete updateData[field]);
    
    let updatedUser;
    
    if (role === 'employer') {
      updatedUser = await Employer.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
    }
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/profile
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;
    
    if (role === 'employer') {
      await Employer.findByIdAndDelete(userId);
    } else {
      await User.findByIdAndDelete(userId);
    }
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};
