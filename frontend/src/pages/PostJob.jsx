import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Input, { Textarea } from '../components/ui/CustomInput';
import Button from '../components/ui/CustomButton';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import styles from './PostJob.module.css';

const PostJob = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [companyData, setCompanyData] = useState(null); // Holds the company object with _id
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        workType: 'Remote',
        employmentType: 'Full-time',
        experienceLevel: 'Mid',
        minSalary: '',
        maxSalary: '',
        description: '',
        requirements: '',
        benefits: ''
    });

    // Fetch company data on mount to get the companyId
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await api.get('/companies/my-company');
                if (data) {
                    setCompanyData(data);
                    console.log('Loaded company for job posting:', data);
                } else {
                    console.warn('No company found for this user');
                }
            } catch (err) {
                console.error('Failed to fetch company:', err);
            }
        };
        fetchCompany();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            alert('Please fill in the required fields: Job Title, Description');
            return;
        }

        // Validate companyId
        const companyId = companyData?._id || companyData?.id;
        if (!companyId) {
            alert('Company profile not found. Please set up your company profile in the Employer Dashboard first.');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                title: formData.title,
                companyId: companyId, // Send ObjectId, NOT the name string
                location: formData.location,
                workType: formData.workType,
                workType: formData.workType,
                employmentType: formData.employmentType,
                experienceLevel: formData.experienceLevel,
                salaryMin: formData.minSalary ? Number(formData.minSalary) : null,
                salaryMax: formData.maxSalary ? Number(formData.maxSalary) : null,
                description: formData.description,
                requirements: formData.requirements.split('\n').filter(line => line.trim()),
                benefits: formData.benefits.split('\n').filter(line => line.trim()),
            };

            console.log('Posting job:', payload);
            await api.post('/jobs', payload);

            alert('Job posted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error posting job:', error);
            alert(error.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Post a New Job</h1>
                    <p className={styles.subtitle}>Find the perfect candidate for your team</p>
                </div>

                <form className={styles.formCard} onSubmit={handleSubmit}>

                    <div className={styles.rowTitle}>Job Details</div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>Job Title *</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior React Developer"
                            required
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <div>
                            <label className={styles.label}>Experience Level</label>
                            <select
                                name="experienceLevel"
                                className={styles.select}
                                value={formData.experienceLevel}
                                onChange={handleChange}
                            >
                                <option value="Entry">Entry Level</option>
                                <option value="Mid">Mid Level</option>
                                <option value="Senior">Senior Level</option>
                                <option value="Lead">Lead Level</option>
                                <option value="Executive">Executive Level</option>
                            </select>
                        </div>

                        <div>
                            <label className={styles.label}>Work Type</label>
                            <select
                                name="workType"
                                className={styles.select}
                                value={formData.workType}
                                onChange={handleChange}
                            >
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Onsite">Onsite</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div>
                            <label className={styles.label}>Employment Type</label>
                            <select
                                name="employmentType"
                                className={styles.select}
                                value={formData.employmentType}
                                onChange={handleChange}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label className={styles.label}>Location</label>
                            <Input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. San Francisco, CA"
                            />
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div>
                            <label className={styles.label}>Min Salary (₹)</label>
                            <Input
                                name="minSalary"
                                type="number"
                                value={formData.minSalary}
                                onChange={handleChange}
                                placeholder="e.g. 500000"
                            />
                        </div>
                        <div>
                            <label className={styles.label}>Max Salary (₹)</label>
                            <Input
                                name="maxSalary"
                                type="number"
                                value={formData.maxSalary}
                                onChange={handleChange}
                                placeholder="e.g. 1000000"
                            />
                        </div>
                    </div>

                    <div className={styles.rowTitle}>Company Info</div>
                    <div className={styles.formRow}>
                        <label className={styles.label}>Company Name</label>
                        <div style={{
                            padding: 'var(--space-3)',
                            backgroundColor: 'var(--color-background-alt)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            color: companyData ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        }}>
                            {companyData?.name || 'Loading company...'}
                        </div>
                    </div>

                    <div className={styles.rowTitle}>Description & Requirements</div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>Job Description *</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the role responsibilities and company culture..."
                            rows={6}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>Requirements (One per line)</label>
                        <Textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="- 3+ years of React experience&#10;- Knowledge of Node.js&#10;- Strong communication skills"
                            rows={5}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>Benefits (One per line)</label>
                        <Textarea
                            name="benefits"
                            value={formData.benefits}
                            onChange={handleChange}
                            placeholder="- Health insurance&#10;- Remote work options&#10;- Annual retreat"
                            rows={5}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Job'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PostJob;
