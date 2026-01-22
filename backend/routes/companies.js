const express = require('express');
const Company = require('../models/Company');
const auth = require('../middleware/auth');

const router = express.Router();

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
