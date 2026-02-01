const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
const auth = require('../middleware/auth');

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

// Get saved jobs
router.get('/saved', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate({
            path: 'savedJobs',
            populate: { path: 'companyId' }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const formattedJobs = user.savedJobs.map(job => ({
            ...job.toObject(),
            company: job.companyId,
            companyId: undefined
        }));

        res.json(formattedJobs);
    } catch (err) {
        console.error('Error fetching saved jobs:', err);
        res.status(500).json({ message: err.message });
    }
});

// Toggle save job
router.post('/:id/save', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const jobId = req.params.id;
        const index = user.savedJobs.indexOf(jobId);

        if (index === -1) {
            // Not saved, so save it
            user.savedJobs.push(jobId);
            await user.save();
            res.json({ message: 'Job saved', isSaved: true });
        } else {
            // Already saved, so unsave it
            user.savedJobs.splice(index, 1);
            await user.save();
            res.json({ message: 'Job removed from saved', isSaved: false });
        }
    } catch (err) {
        console.error('Error toggling saved job:', err);
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

// PUT update a job by ID
router.put('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        console.error('Job Update Error:', err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE a job by ID
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error('Job Delete Error:', err);
        res.status(500).json({ message: err.message });
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



module.exports = router;
