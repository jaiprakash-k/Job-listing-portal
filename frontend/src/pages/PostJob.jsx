import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Input, { Textarea } from '../components/ui/CustomInput';
import Button from '../components/ui/CustomButton';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import styles from './PostJob.module.css';

const PostJob = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editJobId = searchParams.get('edit'); // Get job ID from query param for edit mode
    const isEditMode = !!editJobId;

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
        responsibilities: '',
        requirements: '',
        techStack: '',
        benefits: ''
    });

    // Force body background to match theme to prevent white overscroll
    useEffect(() => {
        document.body.style.backgroundColor = 'var(--color-background)';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

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

    // If in edit mode, fetch the existing job data
    useEffect(() => {
        const fetchJobForEdit = async () => {
            if (!editJobId) return;
            try {
                setLoading(true);
                const job = await api.get(`/jobs/${editJobId}`);
                if (job) {
                    setFormData({
                        title: job.title || '',
                        location: job.location || '',
                        workType: job.workType || 'Remote',
                        employmentType: job.employmentType || 'Full-time',
                        minSalary: job.salaryMin?.toString() || '',
                        maxSalary: job.salaryMax?.toString() || '',
                        description: job.description || '',
                        responsibilities: (job.responsibilities || []).join('\n'),
                        requirements: (job.requirements || []).join('\n'),
                        techStack: (job.techStack || []).join(', '),
                        benefits: (job.niceToHave || []).join('\n')
                    });
                    console.log('Loaded job for editing:', job);
                }
            } catch (err) {
                console.error('Failed to fetch job for editing:', err);
                alert('Failed to load job data for editing');
            } finally {
                setLoading(false);
            }
        };
        fetchJobForEdit();
    }, [editJobId]);

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
                employmentType: formData.employmentType,
                experienceLevel: formData.experienceLevel,
                salaryMin: formData.minSalary ? Number(formData.minSalary) : null,
                salaryMax: formData.maxSalary ? Number(formData.maxSalary) : null,
                description: formData.description,
                responsibilities: formData.responsibilities.split('\n').filter(line => line.trim()),
                requirements: formData.requirements.split('\n').filter(line => line.trim()),
                techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s),
                niceToHave: formData.benefits.split('\n').filter(line => line.trim()),
            };

            console.log(isEditMode ? 'Updating job:' : 'Posting job:', payload);

            if (isEditMode) {
                await api.put(`/jobs/${editJobId}`, payload);
                alert('Job updated successfully!');
            } else {
                await api.post('/jobs', payload);
                alert('Job posted successfully!');
            }

            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving job:', error);
            alert(error.message || 'Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{isEditMode ? 'Edit Job' : 'Post a New Job'}</h1>
                        <p className={styles.subtitle}>{isEditMode ? 'Update your job listing details' : 'Find the perfect candidate for your team'}</p>
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
                            <label className={styles.label}>Responsibilities (One per line)</label>
                            <Textarea
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleChange}
                                placeholder="- Lead the development of new features&#10;- Collaborate with cross-functional teams"
                                rows={5}
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
                            <label className={styles.label}>Tech Stack (Comma separated)</label>
                            <Input
                                name="techStack"
                                value={formData.techStack}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB, AWS, TypeScript"
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
                                {loading ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Job' : 'Post Job')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostJob;
