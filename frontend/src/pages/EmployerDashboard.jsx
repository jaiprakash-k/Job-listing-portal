import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Briefcase, Users, Settings, Plus, Edit2, Trash2,
  ChevronRight, Eye, MapPin, Calendar, FileText, Download,
  CheckCircle, XCircle, Clock, ChevronDown, Upload, Camera
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/CustomButton';
import Input, { Textarea } from '../components/ui/CustomInput';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  formatSalary,
  formatPostedDate,
  departments,
  experienceLevels,
} from '../data/mockData';
import styles from './EmployerDashboard.module.css';

// ... (keep imports)
import CompanyProfileView from '../components/CompanyProfileView';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Force body background to match theme to prevent white overscroll
    document.body.style.backgroundColor = 'var(--color-background)';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ error: null, success: null });
  const [company, setCompany] = useState({
    name: '',
    logo: '',
    website: '',
    industry: '',
    founded: new Date().getFullYear(),
    location: '',
    remotePolicy: 'Remote-first',
    teamSize: '',
    stage: 'Seed',
    description: '',
    tagline: '',
    mission: '',
    values: [],
    techStack: {
      frontend: [],
      backend: [],
      mobile: [],
      database: [],
      devops: [],
    },
    benefits: {
      health: [],
      financial: [],
      lifestyle: [],
      remoteWork: []
    }
  });
  const [companyJobs, setCompanyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    workType: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Mid',
    salaryMin: 0,
    salaryMax: 0,
    description: '',
    responsibilities: [],
    requirements: [],
    techStack: [],
    status: 'Draft',
  });
  const [jobPostStep, setJobPostStep] = useState(1);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterJobId, setFilterJobId] = useState('all');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let companyData = await api.get('/companies/my-company');

        // If no company exists, create a basic one
        if (!companyData) {
          console.log('No company found, creating basic company profile...');
          try {
            // Use companyName from user if available, otherwise fall back to email username
            const fallbackCompanyName = user?.companyName || user?.name || user?.email?.split('@')[0] || 'My Company';
            const basicCompany = {
              name: fallbackCompanyName,
              employerId: user?.id || user?._id,
              industry: 'Technology',
              location: 'Remote',
              description: 'Company description pending'
            };
            companyData = await api.post('/companies', basicCompany);
            console.log('Basic company created:', companyData);
          } catch (createErr) {
            console.error('Failed to create company:', createErr);
            // If creation fails, we cannot proceed with a valid company ID.
            // But for UI rendering, we can use a temporary object.
            // WARNING: Job posting will fail if we don't have a real company ID.
            const fallbackName = user?.companyName || user?.name || user?.email?.split('@')[0] || 'My Company';
            companyData = {
              name: fallbackName,
              employerId: user?.id || user?._id,
              isTemporary: true // Flag to indicate this is not a persisted company
            };
          }
        } else {
          console.log('Company found:', companyData);
        }

        // Merge with defaults to ensure no null content
        setCompany(prev => ({ ...prev, ...(companyData || {}) }));

        if (companyData) {
          // Fetch jobs for this company
          const allJobs = await api.get('/jobs');

          // The backend returns jobs with `company` as a populated object (containing _id, name, etc.)
          // We need to compare company._id with our companyData._id
          const companyId = companyData._id || companyData.id;
          console.log('Filtering jobs for company ID:', companyId);

          const myJobs = allJobs.filter(j => {
            // The job's company is a populated object from backend
            const jobCompanyId = j.company?._id || j.company?.id || j.company;
            return String(jobCompanyId) === String(companyId);
          });

          console.log(`Found ${myJobs.length} jobs for this company out of ${allJobs.length} total`);
          setCompanyJobs(myJobs);

          // Fetch applications for my jobs
          try {
            const applicationsData = await api.get('/applications/employer');
            console.log('Fetched applications:', applicationsData);
            setApplications(applicationsData || []);
          } catch (appErr) {
            console.error('Failed to fetch applications:', appErr);
            setApplications([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch employer dashboard:', err);
        // Create a fallback company object
        const fallbackCompany = {
          _id: user?.id || user?._id,
          id: user?.id || user?._id,
          name: user?.email?.split('@')[0] || 'My Company',
          employerId: user?.id || user?._id
        };
        setCompany(prev => ({ ...prev, ...fallbackCompany }));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading dashboard...</div>;
  }


  // Update nav icons/labels if needed
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <Briefcase size={20} /> },
    { id: 'jobs', label: 'Jobs', icon: <FileText size={20} /> },
    { id: 'applicants', label: 'Candidates', icon: <Users size={20} /> },
    { id: 'company', label: 'Company Profile', icon: <Building2 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const pipelineStages = ['Applied', 'Reviewed', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Active': styles.badgeActive,
      'Draft': styles.badgeDraft,
      'Closed': styles.badgeClosed,
      'Applied': styles.badgeApplied,
      'Viewed': styles.badgeViewed,
      'Reviewed': styles.badgeViewed,
      'Shortlisted': styles.badgeShortlisted,
      'Interview': styles.badgeInterview,
      'Offer': styles.badgeOffer,
      'Rejected': styles.badgeRejected,
    };
    return `${styles.badge} ${statusClasses[status] || ''}`;
  };

  const renderOverview = () => (
    <>
      <div className={styles.heroStats}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}><Briefcase size={24} /></span>
          </div>
          <p className={styles.statValue}>{companyJobs.filter(j => j.status === 'Active').length}</p>
          <p className={styles.statLabel}>Active Jobs</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}><Users size={24} /></span>
          </div>
          <p className={styles.statValue}>{applications.length}</p>
          <p className={styles.statLabel}>Total Candidates</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}><CheckCircle size={24} /></span>
          </div>
          <p className={styles.statValue}>{applications.filter(a => ['Shortlisted', 'Interview'].includes(a.status)).length}</p>
          <p className={styles.statLabel}>In Pipeline</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}><Eye size={24} /></span>
          </div>
          <p className={styles.statValue}>{companyJobs.reduce((sum, job) => sum + (job.views || 0), 0)}</p>
          <p className={styles.statLabel}>Total Views</p>
        </div>
      </div>

      <div className={styles.quickActions}>
        <button className={styles.actionButton} onClick={() => navigate('/post-job')}>
          <Plus size={18} /> Post New Job
        </button>
        <button className={`${styles.actionButton} ${styles.actionButtonSecondary}`} onClick={() => setActiveSection('applicants')}>
          View Pipeline
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Recent Candidates</h3>
          <Button variant="ghost" size="small" onClick={() => setActiveSection('applicants')}>
            View All <ChevronRight size={16} />
          </Button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Role</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map(app => (
                <tr key={app._id || app.id}>
                  <td>{app.applicant?.name || app.applicant?.email || `Applicant #${app.applicantId?.toString().slice(-6)}`}</td>
                  <td>{app.job?.title || 'Unknown Job'}</td>
                  <td>{formatPostedDate(app.appliedAt)}</td>
                  <td><span className={getStatusBadgeClass(app.status)}>{app.status}</span></td>
                  <td>
                    <Button variant="ghost" size="small"><Eye size={16} /></Button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No applications yet. Post a job to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Active Jobs</h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Posted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {companyJobs.slice(0, 5).map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 500 }}>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.applicationCount}</td>
                  <td>{formatPostedDate(job.postedAt)}</td>
                  <td><span className={getStatusBadgeClass(job.status || 'Active')}>{job.status || 'Active'}</span></td>
                  <td>
                    <Button variant="ghost" size="small" onClick={() => {
                      setSelectedJob(job);
                      setActiveSection('applicants');
                    }}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {companyJobs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No active jobs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // Company profile handlers
  const handleAddValue = () => {
    const newValues = [...(company.values || []), { name: '', description: '' }];
    setCompany({ ...company, values: newValues });
  };

  const handleRemoveValue = (index) => {
    const newValues = company.values.filter((_, i) => i !== index);
    setCompany({ ...company, values: newValues });
  };

  const handleAddTech = (category) => {
    const techName = prompt(`Enter ${category} technology:`);
    if (techName && techName.trim()) {
      const newTechStack = { ...company.techStack };
      newTechStack[category] = [...(newTechStack[category] || []), techName.trim()];
      setCompany({ ...company, techStack: newTechStack });
    }
  };

  const handleRemoveTech = (category, index) => {
    const newTechStack = { ...company.techStack };
    newTechStack[category] = newTechStack[category].filter((_, i) => i !== index);
    setCompany({ ...company, techStack: newTechStack });
  };

  const handleAddBenefit = (category) => {
    const benefitName = prompt(`Enter ${category} benefit:`);
    if (benefitName && benefitName.trim()) {
      const newBenefits = { ...company.benefits };
      newBenefits[category] = [...(newBenefits[category] || []), benefitName.trim()];
      setCompany({ ...company, benefits: newBenefits });
    }
  };

  const handleRemoveBenefit = (category, index) => {
    const newBenefits = { ...company.benefits };
    newBenefits[category] = newBenefits[category].filter((_, i) => i !== index);
    setCompany({ ...company, benefits: newBenefits });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      alert('Only .jpg, .png, and .webp images are allowed');
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size too large. Max limit is 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      setLoading(true);
      const res = await api.post('/companies/upload-logo', formData);
      setCompany(prev => ({ ...prev, logo: res.logoUrl }));
      alert('Logo uploaded successfully');
    } catch (err) {
      console.error('Logo upload failed:', err);
      alert('Failed to upload logo');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    try {
      if (!company._id && !company.id) {
        alert('Company ID is missing. Please refresh the page.');
        return;
      }

      const companyId = company._id || company.id;
      console.log('Saving company:', company);

      const response = await api.put(`/companies/${companyId}`, company);
      console.log('Company saved successfully:', response);

      alert('Company profile saved successfully!');
      setCompany(prev => ({ ...prev, ...response }));
    } catch (err) {
      console.error('Failed to save company:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save company profile';
      alert(`Error: ${errorMessage}`);
    }
  };

  const renderCompanyProfile = () => {
    const categoryLabels = {
      frontend: 'Frontend',
      backend: 'Backend',
      mobile: 'Mobile',
      database: 'Database',
      devops: 'DevOps',
      cloud: 'Cloud',
      tools: 'Tools',
    };

    // Helper to display value or placeholder
    const displayValue = (value, placeholder = 'Not set') => value || <span style={{ color: 'var(--color-text-muted)' }}>{placeholder}</span>;

    // VIEW MODE
    if (!isEditingCompany) {
      return (
        <CompanyProfileView
          company={company}
          jobs={companyJobs}
          onEdit={() => setIsEditingCompany(true)}
        />
      );
    }

    // EDIT MODE
    return (
      <>
        {/* Header with Save/Cancel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
          <Button variant="ghost" onClick={() => setIsEditingCompany(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => { handleSaveCompany(); setIsEditingCompany(false); }}>
            Save Changes
          </Button>
        </div>

        {/* Logo Upload Section */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Company Logo</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '12px',
              border: '1px dashed var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: 'var(--color-surface)',
            }}>
              {company.logo ? (
                <img src={company.logo} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <Building2 size={40} color="var(--color-text-muted)" />
              )}
            </div>
            <div>
              <label className={styles.actionButton} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                <Upload size={18} /> Upload New Logo
              </label>
              <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Recommended: 400x400px, Max 2MB (PNG, JPG)
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Basic Information</h3>
          <div className={styles.formGrid}>
            <Input
              label="Company Name"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
            <Input
              label="Website"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
            />
            <Input
              label="Industry"
              value={company.industry || ''}
              onChange={(e) => setCompany({ ...company, industry: e.target.value })}
            />
            <Input
              label="Location"
              value={company.location || ''}
              onChange={(e) => setCompany({ ...company, location: e.target.value })}
            />
          </div>
        </div>

        {/* Overview */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Company Overview</h3>
          <Input
            label="Tagline"
            value={company.tagline || ''}
            onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
          />
          <Textarea
            label="Description"
            value={company.description || ''}
            onChange={(e) => setCompany({ ...company, description: e.target.value })}
            hint="Clear language, no buzzwords. Max 3 short paragraphs."
            style={{ marginTop: '16px' }}
          />
        </div>

        {/* Mission & Values */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Mission & Values</h3>
          <Textarea
            label="Mission Statement"
            value={company.mission || ''}
            onChange={(e) => setCompany({ ...company, mission: e.target.value })}
            hint="One strong sentence in human language"
          />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div className={styles.cardHeader}>
              <label className={styles.sectionLabel}>Values</label>
              <Button variant="secondary" size="small" onClick={handleAddValue}><Plus size={14} /> Add Value</Button>
            </div>
            {company.values?.map((value, index) => (
              <div key={index} className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <div style={{ flex: 1 }}>
                    <Input
                      value={value.name}
                      onChange={(e) => {
                        const newValues = [...(company.values || [])];
                        newValues[index] = { ...value, name: e.target.value };
                        setCompany({ ...company, values: newValues });
                      }}
                      placeholder="Value name"
                    />
                    <Input
                      value={value.description}
                      onChange={(e) => {
                        const newValues = [...(company.values || [])];
                        newValues[index] = { ...value, description: e.target.value };
                        setCompany({ ...company, values: newValues });
                      }}
                      placeholder="One-line explanation"
                      style={{ marginTop: 'var(--space-2)' }}
                    />
                  </div>
                  <Button variant="ghost" size="small" onClick={() => handleRemoveValue(index)}><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Technology Stack</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {Object.entries(company.techStack || {}).map(([category, techs]) => (
              <div key={category}>
                <label className={styles.sectionLabel}>
                  {categoryLabels[category] || category}
                </label>
                <div className={`${styles.skillsList} ${styles.tagInputContainer}`}>
                  {(techs)?.map((tech, i) => (
                    <span key={i} className={styles.skillTag}>
                      {tech}
                      <button className={styles.removeSkill} onClick={() => handleRemoveTech(category, i)}><XCircle size={14} /></button>
                    </span>
                  ))}
                  <Button variant="ghost" size="small" onClick={() => handleAddTech(category)}><Plus size={14} /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Benefits & Perks</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Add real benefits only. Avoid generic perks.
          </p>
          {Object.entries(company.benefits || {}).map(([category, benefits]) => (
            <div key={category} style={{ marginBottom: 'var(--space-4)' }}>
              <label className={styles.sectionLabel}>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className={`${styles.skillsList} ${styles.tagInputContainer}`}>
                {(benefits)?.map((benefit, i) => (
                  <span key={i} className={styles.skillTag}>
                    {benefit}
                    <button className={styles.removeSkill} onClick={() => handleRemoveBenefit(category, i)}><XCircle size={14} /></button>
                  </span>
                ))}
                <Button variant="ghost" size="small" onClick={() => handleAddBenefit(category)}><Plus size={14} /></Button>
              </div>
            </div>
          ))}
        </div>

        {/* Team Info */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Team Details</h3>
          <div className={styles.formGrid}>
            <Input
              label="Engineering Team Size"
              value={company.engineeringSize || ''}
              onChange={(e) => setCompany({ ...company, engineeringSize: e.target.value })}
              className={styles.shortInput}
            />
            <Input
              label="Product Team Size"
              value={company.productSize || ''}
              onChange={(e) => setCompany({ ...company, productSize: e.target.value })}
              className={styles.shortInput}
            />
            <Input
              label="Remote Percentage"
              type="number"
              value={company.remotePercentage?.toString() || ''}
              onChange={(e) => setCompany({ ...company, remotePercentage: parseInt(e.target.value) })}
              className={styles.shortInput}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Social Links</h3>
          <div className={styles.formGrid}>
            <Input
              label="LinkedIn"
              value={company.linkedIn || ''}
              onChange={(e) => setCompany({ ...company, linkedIn: e.target.value })}
            />
            <Input
              label="GitHub"
              value={company.github || ''}
              onChange={(e) => setCompany({ ...company, github: e.target.value })}
            />
            <Input
              label="X (formerly Twitter)"
              value={company.twitter || ''}
              onChange={(e) => setCompany({ ...company, twitter: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Button variant="ghost" onClick={() => setIsEditingCompany(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { handleSaveCompany(); setIsEditingCompany(false); }}>Save Changes</Button>
        </div>
      </>
    );
  };

  const renderApplicants = () => {
    // Handler to update application status with Optimistic UI
    const handleStatusUpdate = async (applicationId, newStatus) => {
      // 1. Optimistic Update: Update local state immediately
      const previousApplications = [...applications];
      setApplications(prevApps =>
        prevApps.map(app =>
          (app._id === applicationId || app.id === applicationId)
            ? { ...app, status: newStatus }
            : app
        )
      );

      try {
        console.log(`Sending status update for ${applicationId} to ${newStatus}`);
        await api.put(`/applications/${applicationId}/status`, { status: newStatus });

        // 2. Confirm Update: Fetch latest data to ensure sync (optional, but good for consistency)
        // We can skip this if we trust our optimistic update, but fetching ensures other fields are fresh
        // const applicationsData = await api.get('/applications/employer');
        // setApplications(applicationsData || []); 
        console.log('Status update confirmed by server');
      } catch (err) {
        console.error('Failed to update status:', err);
        // 3. Rollback on Error
        console.log('Rolling back status update due to error');
        setApplications(previousApplications);
        alert('Failed to update status. Please try again.');
      }
    };

    // Drag handlers
    const handleDragStart = (e, app) => {
      e.dataTransfer.setData('applicationId', app._id || app.id);
      e.dataTransfer.effectAllowed = 'move';
      e.currentTarget.style.opacity = '0.5';
      console.log('Drag start:', app._id || app.id);
    };

    const handleDragEnd = (e) => {
      e.currentTarget.style.opacity = '1';
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    };

    const handleDragLeave = (e) => {
      e.currentTarget.style.backgroundColor = '';
    };

    const handleDrop = (e, targetStatus) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = '';
      const applicationId = e.dataTransfer.getData('applicationId');

      console.log('Dropped:', applicationId, 'into', targetStatus);

      if (applicationId) {
        handleStatusUpdate(applicationId, targetStatus);
      }
    };

    // Filter applications based on selected job
    const filteredApps = filterJobId === 'all'
      ? applications
      : applications.filter(app => (app.jobId || app.job?._id || app.job?.id) === filterJobId);

    // Group applications by status
    const columns = {
      'Applied': filteredApps.filter(a => a.status === 'Applied' || !a.status),
      'Shortlisted': filteredApps.filter(a => a.status === 'Shortlisted'),
      'Interview': filteredApps.filter(a => a.status === 'Interview' || a.status === 'Offer'),
      'Rejected': filteredApps.filter(a => a.status === 'Rejected'),
    };

    const columnTitles = {
      'Applied': { title: 'Applied', color: '#3b82f6', icon: '📤' },
      'Shortlisted': { title: 'Shortlisted', color: '#f59e0b', icon: '⭐' },
      'Interview': { title: 'Interview', color: '#10b981', icon: '🎯' },
      'Rejected': { title: 'Rejected', color: '#ef4444', icon: '❌' }
    };

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Filter */}
        <div className={styles.filterContainer}>
          <label className={styles.filterLabel}>Filter by job:</label>
          <select
            className={styles.filterSelect}
            value={filterJobId}
            onChange={(e) => setFilterJobId(e.target.value)}
          >
            <option value="all">All Jobs</option>
            {companyJobs.map(job => (
              <option key={job.id || job._id} value={job.id || job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Kanban Board */}
        <div className={styles.kanbanBoard}>
          {Object.entries(columns).map(([stage, apps]) => (
            <div
              key={stage}
              className={styles.kanbanColumn}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
              style={{ transition: 'background-color 0.2s' }}
            >
              <div className={styles.columnHeader} style={{ borderBottom: `3px solid ${columnTitles[stage].color}` }}>
                <span>{columnTitles[stage].icon} {columnTitles[stage].title}</span>
                <span className={styles.columnCount} style={{ backgroundColor: columnTitles[stage].color }}>{apps.length}</span>
              </div>

              <div className={styles.columnBody}>
                {apps.length > 0 ? (
                  apps.map(app => (
                    <div
                      key={app._id || app.id}
                      className={styles.candidateCard}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      onDragEnd={handleDragEnd}
                      style={{ cursor: 'grab' }}
                    >
                      <h4 className={styles.candidateName}>{app.applicant?.name || app.applicant?.email || `Applicant #${app.applicantId?.toString().slice(-6)}`}</h4>
                      <p className={styles.candidateRole}>{app.job?.title || 'Unknown Job'}</p>

                      <div className={styles.candidateMeta}>
                        <span><Calendar size={12} /> {formatPostedDate(app.appliedAt)}</span>
                      </div>

                      <div className={styles.candidateActions}>
                        <Button
                          variant="secondary"
                          size="small"
                          style={{ fontSize: '0.75rem', padding: '4px 8px', opacity: app.resumeUrl ? 1 : 0.5 }}
                          onClick={() => app.resumeUrl && window.open(app.resumeUrl, '_blank')}
                          disabled={!app.resumeUrl}
                          title={app.resumeUrl ? 'View Resume' : 'No resume uploaded'}
                        >
                          <FileText size={12} style={{ marginRight: '4px' }} /> Resume
                        </Button>
                        <Button variant="ghost" size="small" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setSelectedCandidate(app)}>
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyColumn}>
                    <Users size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p>No candidates yet</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Drop candidates here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      setCompanyJobs(companyJobs.filter(job => (job._id || job.id) !== jobId));
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Failed to delete job: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderJobListings = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>All Job Listings</h3>
        {companyJobs.length > 0 && (
          <Button variant="primary" size="small" onClick={() => navigate('/post-job')}>
            <Plus size={16} /> Post New Job
          </Button>
        )}
      </div>
      {companyJobs.length > 0 ? (
        <div className={styles.list} style={{ marginTop: 'var(--space-4)' }}>
          {companyJobs.map(job => (
            <div key={job.id} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <h4 className={styles.listItemTitle}>{job.title}</h4>
                <div className={styles.listItemMeta}>
                  <span><MapPin size={12} /> {job.location}</span>
                  <span>{job.workType}</span>
                  <span>{formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}</span>
                  <span><Calendar size={12} /> {formatPostedDate(job.postedAt)}</span>
                </div>
              </div>
              <div className={styles.listItemActions}>
                <span style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1', display: 'flex', alignItems: 'center' }}>
                  {job.applicationCount} applicants
                </span>
                <span className={getStatusBadgeClass(job.status || 'Active')}>{job.status || 'Active'}</span>
                <Button variant="ghost" size="small" onClick={() => navigate(`/post-job?edit=${job._id || job.id}`)} title="Edit Job"><Edit2 size={14} /></Button>
                <Button variant="ghost" size="small" onClick={() => navigate(`/jobs/${job._id || job.id}`)} title="View Job"><Eye size={14} /></Button>
                <Button variant="ghost" size="small" style={{ color: '#ef4444' }} onClick={() => handleDeleteJob(job._id || job.id)} title="Delete Job"><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h4 className={styles.emptyTitle}>No job listings yet</h4>
          <p className={styles.emptyDescription}>Create your first job posting to start receiving applications.</p>
          <Button variant="primary" onClick={() => navigate('/post-job')}>
            <Plus size={16} /> Post New Job
          </Button>
        </div>
      )}
    </div>
  );

  const renderPostJob = () => {
    return (
      <div className={styles.card}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
            {isEditingJob ? 'Edit Job' : 'Post a Job'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            Find the perfect candidate for your team
          </p>
        </div>

        {/* Job Details Section */}
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Job Details</h3>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <Input
              label="Job Title"
              required
              value={newJob.title || ''}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div className={styles.formGrid}>
            <div>
              <label className={styles.sectionLabel}>Experience Level</label>
              <select
                value={newJob.experienceLevel || 'Mid'}
                onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                className={styles.selectInput}
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={styles.sectionLabel}>Work Type</label>
              <select
                value={newJob.workType || 'Remote'}
                onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                className={styles.selectInput}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className={styles.sectionLabel}>Employment Type</label>
              <select
                value={newJob.employmentType || 'Full-time'}
                onChange={(e) => setNewJob({ ...newJob, employmentType: e.target.value })}
                className={styles.selectInput}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <Input
              label="Location"
              value={newJob.location || ''}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <div className={styles.formGrid} style={{ marginTop: 'var(--space-4)' }}>
            <Input
              label="Min Salary (USD)"
              type="number"
              value={newJob.salaryMin?.toString() || ''}
              onChange={(e) => setNewJob({ ...newJob, salaryMin: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 50000"
            />
            <Input
              label="Max Salary (USD)"
              type="number"
              value={newJob.salaryMax?.toString() || ''}
              onChange={(e) => setNewJob({ ...newJob, salaryMax: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 80000"
            />
          </div>
        </div>

        {/* Company Info Section */}
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Company Info</h3>
          <Input
            label="Company Name"
            value={company.name || ''}
            disabled
          />
        </div>

        {/* Description & Requirements Section */}
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Description & Requirements</h3>

          <Textarea
            label="Job Description"
            value={newJob.description || ''}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            placeholder="Describe the role..."
            style={{ marginBottom: 'var(--space-4)' }}
          />

          <Textarea
            label="Responsibilities"
            value={newJob.responsibilities?.join('\n') || ''}
            onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value.split('\n') })}
            placeholder="List responsibilities (one per line)..."
            style={{ marginBottom: 'var(--space-4)' }}
          />

          <Textarea
            label="Requirements"
            value={newJob.requirements?.join('\n') || ''}
            onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value.split('\n') })}
            placeholder="List requirements (one per line)..."
            style={{ marginBottom: 'var(--space-4)' }}
          />

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className={styles.sectionLabel}>
              Required Technologies
            </label>
            <div className={`${styles.skillsList} ${styles.tagInputContainer}`}>
              {newJob.techStack?.map((tech, i) => (
                <span key={i} className={styles.skillTag}>
                  {tech}
                  <button
                    className={styles.removeSkill}
                    onClick={() => setNewJob({
                      ...newJob,
                      techStack: newJob.techStack?.filter((_, idx) => idx !== i)
                    })}
                  >
                    <XCircle size={14} />
                  </button>
                </span>
              ))}
              <input
                placeholder="Type & press Enter..."
                className={styles.transparentInput}
                style={{ border: 'none', outline: 'none', background: 'transparent', color: 'inherit', fontSize: 'var(--text-sm)', flex: 1, minWidth: '120px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.currentTarget).value.trim();
                    if (value && !newJob.techStack?.includes(value)) {
                      setNewJob({
                        ...newJob,
                        techStack: [...(newJob.techStack || []), value]
                      });
                      (e.currentTarget).value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.formActions}>
          <Button variant="secondary" onClick={() => handlePostJob(true)}>Save Draft</Button>
          <Button variant="primary" onClick={() => handlePostJob(false)}>{isEditingJob ? 'Save Changes' : 'Publish Job'}</Button>
        </div>
      </div>
    );
  };

  const handlePostJob = async (isDraft) => {
    try {
      // Validate required fields
      if (!newJob.title || !newJob.title.trim()) {
        alert('Please enter a job title');
        return;
      }

      if (!company?._id && !company?.id) {
        alert('Company profile is not fully initialized. Please refresh the page to try creating it again.');
        return;
      }

      console.log('Current Company State:', company);

      const companyId = company._id || company.id;
      console.log('Resolved Company ID:', companyId);

      if (company.isTemporary) {
        alert('Cannot post job: Company profile creation failed. Please contact support or try again.');
        return;
      }

      // Verify ObjectId format just in case
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(companyId);
      if (!isObjectId) {
        alert(`Error: Company ID format is invalid (${companyId}). It must be a 24-char specific ID. Please refresh or contact support.`);
        return;
      }

      const jobData = {
        ...newJob,
        status: isDraft ? 'Draft' : 'Active',
        companyId: companyId
      };

      console.log('Posting job with data:', JSON.stringify(jobData, null, 2));

      let response;
      try {
        response = await api.post('/jobs', jobData);
      } catch (postErr) {
        const msg = postErr.response?.data?.message || postErr.message;
        const receivedBody = postErr.response?.data?.receivedBody;
        const debugInfo = receivedBody ? `\nServer Received: ${JSON.stringify(receivedBody, null, 2)}` : '';

        alert(`Post Failed: ${msg}. \n${debugInfo}`);
        // console.error(postErr); // Keep internal log
        return; // Don't throw, just stop
      }
      console.log('Job posted successfully:', response);

      // Show success message
      alert(isDraft ? 'Job saved as draft!' : 'Job published successfully!');

      // Reset form and redirect
      setActiveSection('jobs');
      setCompanyJobs([...companyJobs, response]);
      setNewJob({
        title: '',
        department: '',
        location: '',
        workType: 'Remote',
        employmentType: 'Full-time',
        experienceLevel: 'Mid',
        salaryMin: 0,
        salaryMax: 0,
        description: '',
        responsibilities: [],
        requirements: [],
        techStack: [],
        status: 'Draft',
      });
      setJobPostStep(1);
    } catch (err) {
      console.error('Failed to post job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to post job. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };




  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'company': return renderCompanyProfile();
      case 'jobs': return renderJobListings();
      case 'post-job': return renderPostJob();
      case 'applicants': return renderApplicants();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  const renderSettings = () => (
    <div className={styles.settingsContainer}>
      {/* Account Settings */}
      <div className={styles.settingsCard}>
        <h3 className={styles.settingsCardTitle}>Account Settings</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Manage your account security and preferences.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Change Password</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Update your password to keep your account secure.</p>
            </div>
            <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#ef4444' }}>Delete Account</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Permanently delete your account and all associated data.</p>
            </div>
            <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus({ error: null, success: null });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ error: 'New passwords do not match', success: null });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ error: 'Password must be at least 6 characters', success: null });
      return;
    }

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordStatus({ error: null, success: 'Password changed successfully' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setPasswordStatus({ error: err.response?.data?.message || err.message || 'Failed to change password', success: null });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete your company profile and all job postings.')) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') return;

    try {
      await api.delete('/auth/delete-account');
      alert('Account deleted successfully');
      logout(); // Logout from context
      navigate('/'); // Redirect to home
    } catch (err) {
      console.error('Delete account error:', err);
      alert('Failed to delete account: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview': return { title: 'Dashboard', description: 'Overview of your hiring activity' };
      case 'company': return { title: 'Company Profile', description: '' };
      case 'jobs': return { title: 'Job Listings', description: 'Manage your job postings' };
      case 'post-job': return { title: 'Post New Job', description: 'Create a new job listing' };
      case 'applicants': return { title: 'Applicants', description: 'Manage your candidate pipeline' };
      case 'settings': return { title: 'Settings', description: 'Manage your account settings' };
      default: return { title: 'Dashboard', description: '' };
    }
  };

  const { title, description } = getSectionTitle();

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.dashboardLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Employer</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeSection === item.id ? styles.navItemActive : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  if (item.id === 'post-job') setJobPostStep(1);
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{title}</h1>
            <p className={styles.pageDescription}>{description}</p>
          </div>
          {renderContent()}
        </main>
      </div>


      {/* Password Change Modal */}
      {
        showPasswordModal && (
          <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Change Password</h2>
                <button className={styles.modalClose} onClick={() => setShowPasswordModal(false)}>
                  <XCircle size={24} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <form onSubmit={handleSubmitPasswordChange}>
                  <Input
                    type="password"
                    label="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                  <Input
                    type="password"
                    label="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    style={{ marginTop: '16px' }}
                  />
                  <Input
                    type="password"
                    label="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    style={{ marginTop: '16px' }}
                  />
                  {passwordStatus.error && (
                    <div style={{ color: '#dc2626', marginTop: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>
                      {passwordStatus.error}
                    </div>
                  )}
                  {passwordStatus.success && (
                    <div style={{ color: '#16a34a', marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
                      {passwordStatus.success}
                    </div>
                  )}
                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button type="button" variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">Update Password</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* Candidate Profile Modal */}
      {
        selectedCandidate && (
          <div className={styles.modalOverlay} onClick={() => setSelectedCandidate(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Candidate Profile</h2>
                <button className={styles.modalClose} onClick={() => setSelectedCandidate(null)}>
                  <XCircle size={24} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatar}>
                    {(selectedCandidate.applicant?.name || selectedCandidate.applicant?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.profileInfo}>
                    <h3>{selectedCandidate.applicant?.name || 'Unknown Name'}</h3>
                    <p>{selectedCandidate.applicant?.email || 'No email provided'}</p>
                  </div>
                </div>

                {/* Profile Title & Summary */}
                {selectedCandidate.applicant?.profile?.title && (
                  <div className={styles.profileSubSection}>
                    <label className={styles.profileLabel}>Title</label>
                    <p className={styles.profileText}>{selectedCandidate.applicant.profile.title}</p>
                  </div>
                )}

                {selectedCandidate.applicant?.profile?.summary && (
                  <div className={styles.profileSubSection}>
                    <label className={styles.profileLabel}>Summary</label>
                    <p className={styles.profileText} style={{ whiteSpace: 'pre-wrap' }}>{selectedCandidate.applicant.profile.summary}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div className={styles.profileGrid}>
                  {selectedCandidate.applicant?.profile?.phone && (
                    <div>
                      <label className={styles.profileLabel}>Phone</label>
                      <p className={styles.profileText}>{selectedCandidate.applicant.profile.phone}</p>
                    </div>
                  )}
                  {selectedCandidate.applicant?.profile?.location && (
                    <div>
                      <label className={styles.profileLabel}>Location</label>
                      <p className={styles.profileText}>{selectedCandidate.applicant.profile.location}</p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {selectedCandidate.applicant?.profile?.skills?.length > 0 && (
                  <div className={styles.profileSubSection}>
                    <label className={styles.profileLabel}>Skills</label>
                    <div className={styles.skillsList}>
                      {selectedCandidate.applicant.profile.skills.map((skill, idx) => (
                        <span key={idx} className={`${styles.skillTag} ${skill.primary ? styles.skillTagPrimary : ''}`}>
                          {skill.name}
                          {skill.proficiency && <span style={{ opacity: 0.7 }}> • {skill.proficiency}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedCandidate.applicant?.profile?.experience?.length > 0 && (
                  <div className={styles.profileSection}>
                    <label className={styles.profileLabel}>Experience</label>
                    {selectedCandidate.applicant.profile.experience.map((exp, idx) => (
                      <div key={idx} className={styles.entryCard}>
                        <p className={styles.entryTitle}>{exp.title}</p>
                        <p className={styles.entrySubtitle}>{exp.company} {exp.location && `• ${exp.location}`}</p>
                        <p className={styles.entryMeta}>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        {exp.description && <p className={styles.entryDescription}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {selectedCandidate.applicant?.profile?.education?.length > 0 && (
                  <div className={styles.profileSection}>
                    <label className={styles.profileLabel}>Education</label>
                    {selectedCandidate.applicant.profile.education.map((edu, idx) => (
                      <div key={idx} className={styles.entryCard}>
                        <p className={styles.entryTitle}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                        <p className={styles.entrySubtitle}>{edu.institution}</p>
                        <p className={styles.entryMeta}>
                          {edu.startYear} - {edu.endYear}
                          {edu.grade && ` • Grade: ${edu.grade}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {selectedCandidate.applicant?.profile?.projects?.length > 0 && (
                  <div className={styles.profileSection}>
                    <label className={styles.profileLabel}>Projects</label>
                    {selectedCandidate.applicant.profile.projects.map((proj, idx) => (
                      <div key={idx} className={styles.entryCard}>
                        <p className={styles.entryTitle}>{proj.title}</p>
                        {proj.role && <p className={styles.entrySubtitle}>{proj.role}</p>}
                        {proj.description && <p className={styles.entryDescription}>{proj.description}</p>}
                        {proj.techStack?.length > 0 && (
                          <div className={styles.skillsList} style={{ marginTop: '8px' }}>
                            {proj.techStack.map((tech, i) => (
                              <span key={i} className={styles.skillTag} style={{ fontSize: '0.75rem' }}>{tech}</span>
                            ))}
                          </div>
                        )}
                        <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                          {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>GitHub</a>}
                          {proj.projectUrl && <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>Live Demo</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className={styles.profileLinkGroup}>
                  {selectedCandidate.resumeUrl && (
                    <a href={selectedCandidate.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>
                      <FileText size={16} /> View Resume
                    </a>
                  )}
                  {selectedCandidate.applicant?.profile?.linkedInUrl && (
                    <a href={selectedCandidate.applicant.profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>LinkedIn</a>
                  )}
                  {selectedCandidate.applicant?.profile?.githubUrl && (
                    <a href={selectedCandidate.applicant.profile.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>GitHub</a>
                  )}
                  {selectedCandidate.applicant?.profile?.portfolioUrl && (
                    <a href={selectedCandidate.applicant.profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>Portfolio</a>
                  )}
                </div>

                {/* Application Info */}
                <div className={styles.profileSection}>
                  <h4 className={styles.formSectionTitle} style={{ marginTop: 0 }}>Application Details</h4>

                  <div className={styles.profileSubSection}>
                    <label className={styles.profileLabel}>Applied For</label>
                    <p className={styles.profileText}>{selectedCandidate.job?.title || 'Unknown Job'}</p>
                  </div>

                  <div className={styles.profileSubSection}>
                    <label className={styles.profileLabel}>Applied On</label>
                    <p className={styles.profileText}>{formatPostedDate(selectedCandidate.appliedAt)}</p>
                  </div>

                  <div className={styles.profileSubSection}>
                    <label className={styles.profileLabel}>Status</label>
                    <div style={{ marginTop: '4px' }}>
                      <span className={getStatusBadgeClass(selectedCandidate.status)}>{selectedCandidate.status}</span>
                    </div>
                  </div>

                  {selectedCandidate.coverLetter && (
                    <div className={styles.profileSubSection}>
                      <label className={styles.profileLabel}>Cover Letter</label>
                      <div className={styles.entryCard} style={{ backgroundColor: 'var(--color-background-alt)' }}>
                        <p className={styles.profileText} style={{ whiteSpace: 'pre-wrap' }}>{selectedCandidate.coverLetter}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Button variant="primary" fullWidth onClick={() => setSelectedCandidate(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default EmployerDashboard;
