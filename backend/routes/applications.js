const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all applications for the current user (Job Seeker)
router.get('/my-applications', auth, async (req, res) => {
    try {
        console.log('Fetching applications for user:', req.user.userId);

        const applications = await Application.find({ applicantId: req.user.userId })
            .populate({
                path: 'jobId',
                populate: { path: 'companyId' }
            })
            .sort({ appliedAt: -1 });

        console.log('Found applications:', applications.length);

        // Transform to frontend-friendly format
        const formatted = applications.map(app => {
            const jobData = app.jobId;
            return {
                _id: app._id,
                id: app._id,
                jobId: jobData?._id,
                job: jobData ? {
                    _id: jobData._id,
                    title: jobData.title,
                    location: jobData.location,
                    workType: jobData.workType,
                    salaryMin: jobData.salaryMin,
                    salaryMax: jobData.salaryMax,
                    company: jobData.companyId ? {
                        _id: jobData.companyId._id,
                        name: jobData.companyId.name,
                        location: jobData.companyId.location
                    } : { name: 'Unknown Company' }
                } : null,
                status: app.status,
                coverLetter: app.coverLetter,
                resumeUrl: app.resumeUrl,
                linkedIn: app.linkedIn,
                appliedAt: app.appliedAt
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error('Error fetching my-applications:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get applications for employer's jobs (for Candidates page)
router.get('/employer', auth, async (req, res) => {
    try {
        // First, get the company for this employer
        const Company = require('../models/Company');
        const company = await Company.findOne({ employerId: req.user.userId });

        if (!company) {
            return res.json([]); // No company = no applications
        }

        // Get all jobs for this company
        const companyJobs = await Job.find({ companyId: company._id });
        const jobIds = companyJobs.map(j => j._id);

        // Get all applications for those jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('jobId')
            .populate('applicantId', 'name email phone profile')
            .sort({ appliedAt: -1 });

        // Transform to frontend-friendly format
        const formatted = applications.map(app => ({
            _id: app._id,
            id: app._id,
            job: app.jobId,
            applicant: app.applicantId,
            applicantId: app.applicantId?._id,
            status: app.status,
            coverLetter: app.coverLetter,
            resumeUrl: app.resumeUrl,
            linkedIn: app.linkedIn,
            appliedAt: app.appliedAt
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Error fetching employer applications:', err);
        res.status(500).json({ message: err.message });
    }
});

// Apply to a job
router.post('/', auth, async (req, res) => {
    const { jobId, coverLetter, linkedIn } = req.body;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            jobId: jobId,
            applicantId: req.user.userId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        const application = new Application({
            jobId: jobId,
            applicantId: req.user.userId,
            coverLetter,
            linkedIn,
            resumeUrl: req.body.resumeUrl,
            status: 'Applied'
        });

        await application.save();

        res.status(201).json(application);
    } catch (err) {
        console.error('Application submission error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Update application status (for employers)
router.put('/:id/status', auth, async (req, res) => {
    const { status } = req.body;
    console.log('Status update request:', { id: req.params.id, status, userId: req.user.userId });

    const validStatuses = ['Applied', 'Viewed', 'Reviewed', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

    if (!validStatuses.includes(status)) {
        console.log('Invalid status:', status);
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!application) {
            console.log('Application not found:', req.params.id);
            return res.status(404).json({ message: 'Application not found' });
        }

        console.log('Status updated successfully:', { id: application._id, newStatus: application.status });
        res.json(application);
    } catch (err) {
        console.error('Status update error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
