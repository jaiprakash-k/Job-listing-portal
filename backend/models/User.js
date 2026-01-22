const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: false, // Optional for social login users
    },
    socialProvider: String, // 'google', 'github', 'linkedin'
    socialId: String,
    role: {
        type: String,
        enum: ['job_seeker', 'employer', 'admin'],
        default: 'job_seeker',
    },
    // Profile fields for Job Seekers (can be moved to separate model but embedded here for simplicity)
    profile: {
        title: String,
        phone: String,
        location: String,
        summary: String,
        noticePeriod: String,
        openToRemote: Boolean,
        openToRelocation: Boolean,
        skills: [{ name: String, proficiency: String, primary: Boolean }],
        experience: [{
            title: String,
            company: String,
            startDate: String,
            endDate: String,
            description: String,
            current: Boolean,
            employmentType: String,
            location: String
        }],
        education: [{
            degree: String,
            field: String,
            institution: String,
            startYear: String,
            endYear: String,
            grade: String
        }],
        projects: [{
            title: String,
            role: String,
            description: String,
            techStack: [String],
            githubUrl: String,
            projectUrl: String
        }],
        resumeUrl: String,
        portfolioUrl: String,
        linkedInUrl: String,
        githubUrl: String,
        preferences: {
            desiredRoles: [String],
            workTypes: [String],
            salaryMin: Number,
            salaryMax: Number,
        },
        availability: {
            type: String,
            default: 'Open to opportunities'
        },
        profileVisibility: {
            type: String,
            default: 'Public'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);
