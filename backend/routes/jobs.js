const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company');

const router = express.Router();

// GET all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Active' })
            .populate('companyId')
            .sort({ postedAt: -1 });

        // Transform data to match frontend expectations (if needed)
        // Frontend expects `company` object inside job, Mongoose `populate` gives that.

        // Mongoose populate puts the object in `companyId`. Frontend likely expects `company`.
        // We can map it or adjust frontend. Let's adjust response to map `companyId` -> `company`
        const formattedJobs = jobs.map(job => ({
            ...job.toObject(),
            company: job.companyId,
            companyId: undefined
        }));

        res.json(formattedJobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('companyId');
        if (!job) return res.status(404).json({ message: 'Job not found' });

        res.json({
            ...job.toObject(),
            company: job.companyId,
            companyId: undefined
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new job (Protected - to do via middleware later)
router.post('/', async (req, res) => {
    try {
        console.log('RECEIVED JOB POST HEADERS:', req.headers);
        console.log('RECEIVED JOB POST BODY:', req.body);

        // Basic implementation
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error('Job Save Error:', err);
        res.status(400).json({
            message: err.message,
            receivedBody: req.body // ECHO FOR DEBUGGING
        });
    }
});

// POST increment job views
router.post('/:id/view', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ views: job.views });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get saved jobs (Mock implementation for now or need a SavedJobs model)
// For now, let's just assume we store saved job IDs in the User model or separate collection.
// Let's implement a simple version that returns empty or random for now, or use User.savedJobs if we added it.
// We'll update User model to have savedJobs.

router.get('/saved', async (req, res) => {
    // Requires auth
    res.json([]);
});

module.exports = router;
