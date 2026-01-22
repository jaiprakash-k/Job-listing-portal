const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    location: String,
    workType: {
        type: String, // Remote, Hybrid, Onsite
        required: true,
    },
    experienceLevel: {
        type: String, // Entry, Mid, Senior, etc.
        enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
        default: 'Mid'
    },
    employmentType: {
        type: String, // Full-time, etc.
        default: 'Full-time'
    },
    salaryMin: Number,
    salaryMax: Number,
    equity: String,
    description: String,
    requirements: [String],
    responsibilities: [String],
    niceToHave: [String],
    techStack: [String],
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Draft'],
        default: 'Active'
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Job', jobSchema);
