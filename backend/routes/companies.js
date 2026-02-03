const express = require('express');
const Company = require('../models/Company');
const auth = require('../middleware/auth');

const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure Multer for Company Logo Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Safe filename: logo-companyId-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `logo-${req.user.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'));
    }
});

const router = express.Router();

// Upload Logo Route
router.post('/upload-logo', auth, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Find company associated with the user and update logo
        const company = await Company.findOneAndUpdate(
            { employerId: req.user.userId },
            { logo: logoUrl },
            { new: true }
        );

        if (!company) {
            // Delete uploaded file if company not found to avoid orphans (optional but good practice)
            fs.unlink(req.file.path, (err) => { if (err) console.error('Failed to delete orphan file:', err); });
            return res.status(404).json({ message: 'Company not found for this user' });
        }

        res.json({ logoUrl, message: 'Logo uploaded successfully' });
    } catch (err) {
        console.error('Logo upload error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get current employer's company
router.get('/my-company', auth, async (req, res) => {
    try {
        const company = await Company.findOne({ employerId: req.user.userId });
        if (!company) {
            // It's valid to not have a company yet
            return res.json(null);
        }
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all companies
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET company by ID
router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new company (Employer only)
router.post('/', async (req, res) => {
    try {
        const newCompany = new Company(req.body);
        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update company by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(updatedCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
