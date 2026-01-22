const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Get all applications for the current user (Job Seeker)
router.get('/my-applications', auth, async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.userId })
            .populate({
                path: 'job',
                populate: { path: 'company' }
            })
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Apply to a job
router.post('/', auth, async (req, res) => {
    const { jobId, coverLetter } = req.body;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.userId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        const application = new Application({
            job: jobId,
            applicant: req.user.userId,
            coverLetter,
            status: 'Applied'
        });

        await application.save();

        // Increment job application count (optional optimization)
        // job.applications.push(application._id);
        // await job.save();

        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
