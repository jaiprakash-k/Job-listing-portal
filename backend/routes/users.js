const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('GET Profile - User ID:', req.user.userId);
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            console.log('GET Profile - User Not Found for ID:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Flatten structure for frontend
        const userObj = user.toObject();
        const flattenedProfile = {
            ...userObj,
            ...userObj.profile, // Merge profile fields to top level
            fullName: userObj.name, // Frontend expects fullName
            currentTitle: userObj.profile?.title, // Frontend expects currentTitle
            id: userObj._id
        };

        res.json(flattenedProfile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    const { fullName, name, email, phone, bio, location, skills, experience, education, projects, noticePeriod, currentTitle, openToRemote, openToRelocation, summary,
        portfolioUrl, linkedInUrl, githubUrl, resumeUrl, preferences, availability, profileVisibility } = req.body;

    try {
        const userFields = {};
        if (fullName || name) userFields.name = fullName || name;
        if (email) userFields.email = email;

        // Nested profile fields
        if (phone !== undefined) userFields['profile.phone'] = phone;
        if (bio !== undefined) userFields['profile.bio'] = bio;
        if (location !== undefined) userFields['profile.location'] = location;
        if (skills) userFields['profile.skills'] = skills;
        if (experience) userFields['profile.experience'] = experience;
        if (education) userFields['profile.education'] = education;
        if (projects) userFields['profile.projects'] = projects;

        // Handle currentTitle mapping to title
        if (currentTitle !== undefined) {
            userFields['profile.title'] = currentTitle;
        }

        if (noticePeriod !== undefined) userFields['profile.noticePeriod'] = noticePeriod;
        if (openToRemote !== undefined) userFields['profile.openToRemote'] = openToRemote;
        if (openToRelocation !== undefined) userFields['profile.openToRelocation'] = openToRelocation;

        if (summary !== undefined) userFields['profile.summary'] = summary;
        if (portfolioUrl !== undefined) userFields['profile.portfolioUrl'] = portfolioUrl;
        if (linkedInUrl !== undefined) userFields['profile.linkedInUrl'] = linkedInUrl;
        if (githubUrl !== undefined) userFields['profile.githubUrl'] = githubUrl;
        if (resumeUrl !== undefined) userFields['profile.resumeUrl'] = resumeUrl;

        // Handle preferences and other flat mappings
        if (preferences) userFields['profile.preferences'] = preferences;
        if (availability) userFields['profile.availability'] = availability;
        if (profileVisibility) userFields['profile.profileVisibility'] = profileVisibility;
        // In User.js these might be top level or profile? userSchema has them in profile? 
        // Checking schema: keys like noticePeriod, openToRemote not explicitly in schema snippet I saw earlier? 
        // Let's assume they are mixed in or standard fields. 
        // Wait, I saw User.js earlier. It has: title, phone, location, summary, skills, experience, education, URLs.
        // It DOES NOT seem to have noticePeriod, openToRemote etc in strict schema.
        // Mongoose strict mode will ignore them if not in schema.
        // Handle preferences and other flat mappings
        // Handle preferences and other flat mappings
        if (preferences) userFields['profile.preferences'] = preferences;

        // currentTitle handled above with !== undefined check

        if (preferences) userFields['profile.preferences'] = preferences;
        console.log('Update Profile - User ID:', req.user.userId);
        console.log('Update Profile - Payload:', JSON.stringify(req.body, null, 2));
        console.log('Update Profile - Fields to Update:', JSON.stringify(userFields, null, 2));


        let user = await User.findById(req.user.userId);
        if (!user) {
            console.log('User not found'); // Debug
            return res.status(404).json({ message: 'User not found' });
        }

        // Use findByIdAndUpdate but ensure we don't clear existing nested fields if we only update partials?
        // Actually dot notation `profile.phone` updates specific field without clearing `profile`.
        // BUT `profile.preferences` = object replaces the whole preferences object. That is expected.

        user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: userFields },
            { new: true, runValidators: true } // Run validators to catch schema errors
        ).select('-password');

        console.log('Update Profile - Success. Updated User:', user);


        // Return flattened
        const userObj = user.toObject();
        const flattenedResponse = {
            ...userObj,
            ...userObj.profile,
            fullName: userObj.name,
            currentTitle: userObj.profile?.title, // Return currentTitle for immediate UI update
            id: userObj._id
        };

        res.json(flattenedResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

const multer = require('multer');
const path = require('path');

// Configure Multer for Resume Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, `resume-${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Upload Resume Route
router.post('/upload-resume', auth, (req, res, next) => {
    console.log('Upload Request Headers:', req.headers);
    upload.single('resume')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(500).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log('Upload File:', req.file);
        console.log('Upload Body:', req.body);

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file (req.file is undefined)' });
        }

        const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Update user profile
        await User.findByIdAndUpdate(
            req.user.userId,
            { $set: { 'profile.resumeUrl': resumeUrl } }
        );

        res.json({ resumeUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
