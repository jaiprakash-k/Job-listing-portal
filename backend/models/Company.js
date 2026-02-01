const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tagline: String,
    description: String,
    industry: String,
    founded: Number,
    teamSize: String,
    website: String,
    location: String,
    remotePolicy: {
        type: String,
        enum: ['Remote-first', 'Hybrid', 'Onsite', 'Flexible'],
        default: 'Flexible'
    },
    mission: String,
    engineeringSize: String,
    productSize: String,
    remotePercentage: Number,
    linkedIn: String,
    github: String,
    twitter: String,
    techStack: {
        type: Map,
        of: [String], // e.g. "frontend": ["React", "Vue"]
    },
    values: [{
        name: String,
        description: String
    }],
    benefits: {
        type: Map,
        of: [String]
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', companySchema);
