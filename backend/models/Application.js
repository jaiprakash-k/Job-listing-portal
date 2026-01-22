const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied'
    },
    resumeUrl: String,
    coverLetter: String, // Optional
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
