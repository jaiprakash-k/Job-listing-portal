const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const auth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, companyName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'job_seeker',
        });

        await newUser.save();

        // If employer and companyName provided, create company
        let createdCompany = null;
        if (role === 'employer' && companyName) {
            try {
                createdCompany = new Company({
                    name: companyName,
                    employerId: newUser._id,
                    description: 'Company profile pending',
                });
                await createdCompany.save();
                console.log('Company created during signup:', createdCompany.name);
            } catch (companyErr) {
                console.error('Failed to create company during signup:', companyErr);
                // Continue anyway - the dashboard will create it later
            }
        }

        // Generate Token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                companyName: createdCompany?.name || companyName, // Return company name in response
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Account not found. Please create an account.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// SOCIAL LOGIN (Mock)
router.post('/social-login', async (req, res) => {
    try {
        const { provider, email, name } = req.body; // Frontend sends these mock details

        let user = await User.findOne({ email });

        if (!user) {
            // Create new social user
            user = new User({
                name,
                email,
                role: 'job_seeker', // Default to job seeker for social login
                socialProvider: provider,
                socialId: `mock-${provider}-${Date.now()}`
            });
            await user.save();
        }

        // Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Social login error:', error);
        res.status(500).json({ message: 'Server error during social login' });
    }
});

// CHANGE PASSWORD
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has a password (they might have registered via social login only)
        if (!user.password && user.socialId) {
            // For social login users setting a password for the first time
            // We can allow them to set it without currentPassword, or require a specific flow.
            // For simplicity here, assuming they can just set it if they don't have one.
            // But usually frontend won't show "Change Password" but "Set Password".
            // Let's enforce currentPassword checking only if user.password exists.
        }

        if (user.password) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid current password' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE ACCOUNT
router.delete('/delete-account', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If employer, delete company? Or keep it? Usually delete cascades.
        // For simplicity, we just delete the user here. 
        // In a real app, we'd delete Company, Jobs, Applications, etc.
        if (user.role === 'employer') {
            await Company.deleteOne({ employerId: user._id });
            // Also delete jobs... (requires Job model)
        }

        await User.findByIdAndDelete(req.user.userId);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
