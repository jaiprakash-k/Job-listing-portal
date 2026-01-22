const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

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
            return res.status(400).json({ message: 'Invalid credentials' });
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

module.exports = router;
