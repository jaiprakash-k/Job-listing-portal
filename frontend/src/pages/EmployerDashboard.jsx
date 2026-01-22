import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Briefcase, Users, Settings, Plus, Edit2, Trash2,
  ChevronRight, Eye, MapPin, Calendar, FileText, Download,
  CheckCircle, XCircle, Clock, ChevronDown
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

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [company, setCompany] = useState({
    name: '',
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
          setApplications([]);
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
                <tr key={app.id}>
                  <td>Candidate #{app.applicantId}</td>
                  <td>{app.job.title}</td>
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
        <>
          {/* Header with Edit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <Button variant="primary" onClick={() => setIsEditingCompany(true)}>
              <Edit2 size={16} style={{ marginRight: '8px' }} />
              Edit Company Profile
            </Button>
          </div>

          {/* Basic Info Card */}
          <div className={styles.settingsCard} style={{ marginBottom: '24px' }}>
            <h3 className={styles.settingsCardTitle}>Basic Information</h3>
            <div className={styles.formGrid} style={{ marginTop: '16px' }}>
              <div>
                <label className={styles.inputLabel}>Company Name</label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{displayValue(company.name)}</p>
              </div>
              <div>
                <label className={styles.inputLabel}>Website</label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{displayValue(company.website)}</p>
              </div>
              <div>
                <label className={styles.inputLabel}>Industry</label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{displayValue(company.industry)}</p>
              </div>
              <div>
                <label className={styles.inputLabel}>Location</label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{displayValue(company.location)}</p>
              </div>
            </div>
          </div>

          {/* Overview Card */}
          <div className={styles.settingsCard} style={{ marginBottom: '24px' }}>
            <h3 className={styles.settingsCardTitle}>Company Overview</h3>
            <div style={{ marginTop: '16px' }}>
              <label className={styles.inputLabel}>Tagline</label>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '16px' }}>{displayValue(company.tagline)}</p>
              <label className={styles.inputLabel}>Description</label>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{displayValue(company.description)}</p>
            </div>
          </div>

          {/* Tech Stack Card */}
          <div className={styles.settingsCard} style={{ marginBottom: '24px' }}>
            <h3 className={styles.settingsCardTitle}>Technology Stack</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              {Object.entries(company.techStack || {}).map(([category, techs]) => (
                <div key={category}>
                  <label className={styles.inputLabel}>{categoryLabels[category] || category}</label>
                  <div className={styles.skillsList}>
                    {(techs || []).length > 0 ? (
                      techs.map((tech, i) => (
                        <span key={i} className={styles.skillTag}>{tech}</span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>None added</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links Card */}
          <div className={styles.settingsCard}>
            <h3 className={styles.settingsCardTitle}>Social Links</h3>
            <div className={styles.formGrid} style={{ marginTop: '16px' }}>
              <div>
                <label className={styles.inputLabel}>LinkedIn</label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{displayValue(company.linkedIn)}</p>
              </div>
              <div>
                <label className={styles.inputLabel}>GitHub</label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{displayValue(company.github)}</p>
              </div>
            </div>
          </div>
        </>
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
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>Values</label>
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
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)', textTransform: 'capitalize' }}>
                  {categoryLabels[category] || category}
                </label>
                <div
                  className={styles.skillsList}
                  style={{
                    border: '1px solid var(--color-border)',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    minHeight: '42px',
                    backgroundColor: 'white'
                  }}
                >
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
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)', textTransform: 'capitalize' }}>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div
                className={styles.skillsList}
                style={{
                  border: '1px solid var(--color-border)',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  minHeight: '42px',
                  backgroundColor: 'white'
                }}
              >
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
              style={{ maxWidth: '150px' }}
            />
            <Input
              label="Product Team Size"
              value={company.productSize || ''}
              onChange={(e) => setCompany({ ...company, productSize: e.target.value })}
              style={{ maxWidth: '150px' }}
            />
            <Input
              label="Remote Percentage"
              type="number"
              value={company.remotePercentage?.toString() || ''}
              onChange={(e) => setCompany({ ...company, remotePercentage: parseInt(e.target.value) })}
              style={{ maxWidth: '150px' }}
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
    // Group applications by status
    const columns = {
      'Applied': applications.filter(a => a.status === 'Applied' || !a.status),
      'Reviewed': applications.filter(a => a.status === 'Reviewed'),
      'Shortlisted': applications.filter(a => a.status === 'Shortlisted'),
      'Interview': applications.filter(a => ['Interview', 'Offer', 'Rejected'].includes(a.status)), // Grouping final stages for now
    };

    const columnTitles = {
      'Applied': 'Applied',
      'Reviewed': 'Reviewed',
      'Shortlisted': 'Shortlisted',
      'Interview': 'Interview'
    };

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Filter */}
        <div className={styles.filterContainer}>
          <label className={styles.filterLabel}>Filter by job:</label>
          <select className={styles.filterSelect}>
            <option value="all">All Jobs</option>
            {companyJobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Kanban Board */}
        <div className={styles.kanbanBoard}>
          {Object.entries(columns).map(([stage, apps]) => (
            <div key={stage} className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                {columnTitles[stage]}
                <span className={styles.columnCount}>{apps.length}</span>
              </div>

              <div className={styles.columnBody}>
                {apps.length > 0 ? (
                  apps.map(app => (
                    <div key={app.id} className={styles.candidateCard}>
                      <h4 className={styles.candidateName}>Candidate #{app.applicantId}</h4>
                      <p className={styles.candidateRole}>{app.job.title}</p>

                      <div className={styles.candidateMeta}>
                        <span><Calendar size={12} /> {formatPostedDate(app.appliedAt)}</span>
                      </div>

                      <div className={styles.candidateActions}>
                        <Button variant="secondary" size="small" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                          <FileText size={12} style={{ marginRight: '4px' }} /> Resume
                        </Button>
                        <Button variant="ghost" size="small" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyColumn}>
                    <Users size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p>No candidates yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {job.applicationCount} applicants
                </span>
                <span className={getStatusBadgeClass(job.status || 'Active')}>{job.status || 'Active'}</span>
                <Button variant="ghost" size="small"><Edit2 size={14} /></Button>
                <Button variant="ghost" size="small"><Eye size={14} /></Button>
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
      <>
        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          {['Details', 'Compensation', 'Description', 'Skills', 'Review'].map((step, index) => {
            const num = index + 1;
            const isActive = jobPostStep === num;
            const isCompleted = jobPostStep > num;

            return (
              <div
                key={step}
                onClick={() => setJobPostStep(num)}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: isActive ? 'var(--color-accent-primary)' : isCompleted ? 'var(--color-success)' : 'var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                title={step}
              />
            );
          })}
        </div>

        <div className={styles.card}>
          {jobPostStep === 1 && (
            <>
              <h3 className={styles.formSectionTitle}>Job Basics</h3>
              <div className={styles.formGrid}>
                <Input
                  label="Job Title"
                  value={newJob.title || ''}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g., Senior Frontend Engineer"
                />
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                    Department
                  </label>
                  <select
                    value={newJob.department || ''}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      fontSize: 'var(--text-sm)',
                      border: 'var(--border-width) solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Location"
                  value={newJob.location || ''}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                />
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                    Work Type
                  </label>
                  <select
                    value={newJob.workType || 'Remote'}
                    onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      fontSize: 'var(--text-sm)',
                      border: 'var(--border-width) solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                    Employment Type
                  </label>
                  <select
                    value={newJob.employmentType || 'Full-time'}
                    onChange={(e) => setNewJob({ ...newJob, employmentType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      fontSize: 'var(--text-sm)',
                      border: 'var(--border-width) solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                    Experience Level
                  </label>
                  <select
                    value={newJob.experienceLevel || 'Mid'}
                    onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value['experienceLevel'] })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      fontSize: 'var(--text-sm)',
                      border: 'var(--border-width) solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {jobPostStep === 2 && (
            <>
              <h3 className={styles.formSectionTitle}>Compensation</h3>
              <p style={{ margin: 0, fontWeight: 'var(--font-medium)' }}>Resume Visibility</p>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Salary transparency is mandatory. Jobs with clear salary ranges get 3x more applications.
              </p>
              <div className={styles.formGrid}>
                <Input
                  label="Minimum Salary (USD)"
                  type="number"
                  value={newJob.salaryMin?.toString() || ''}
                  onChange={(e) => setNewJob({ ...newJob, salaryMin: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 150000"
                />
                <Input
                  label="Maximum Salary (USD)"
                  type="number"
                  value={newJob.salaryMax?.toString() || ''}
                  onChange={(e) => setNewJob({ ...newJob, salaryMax: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 200000"
                />
                <Input
                  label="Equity (optional)"
                  value={newJob.equity || ''}
                  onChange={(e) => setNewJob({ ...newJob, equity: e.target.value })}
                  placeholder="e.g., 0.05% - 0.15%"
                />
              </div>
            </>
          )}

          {jobPostStep === 3 && (
            <>
              <h3 className={styles.formSectionTitle}>Job Description</h3>
              <Textarea
                label="About the Role"
                value={newJob.description || ''}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                placeholder="Describe what makes this role exciting..."
                hint="Clear, concise description of the role and team"
              />
              <Textarea
                label="Responsibilities"
                value={newJob.responsibilities?.join('\n') || ''}
                onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value.split('\n').filter(r => r.trim()) })}
                placeholder="One responsibility per line..."
                hint="List key responsibilities, one per line"
                style={{ marginTop: 'var(--space-4)' }}
              />
              <Textarea
                label="Requirements"
                value={newJob.requirements?.join('\n') || ''}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value.split('\n').filter(r => r.trim()) })}
                placeholder="One requirement per line..."
                hint="List must-have qualifications, one per line"
                style={{ marginTop: 'var(--space-4)' }}
              />
              <Textarea
                label="Nice to Have (optional)"
                value={newJob.niceToHave?.join('\n') || ''}
                onChange={(e) => setNewJob({ ...newJob, niceToHave: e.target.value.split('\n').filter(r => r.trim()) })}
                placeholder="One item per line..."
                hint="Optional skills that would be a plus"
                style={{ marginTop: 'var(--space-4)' }}
              />
            </>
          )}

          {jobPostStep === 4 && (
            <>
              <h3 className={styles.formSectionTitle}>Tech Stack & Skills</h3>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                  Required Technologies
                </label>
                <div className={styles.skillsList}>
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
                </div>
                <Input
                  placeholder="Type a technology and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target).value.trim();
                      if (value && !newJob.techStack?.includes(value)) {
                        setNewJob({
                          ...newJob,
                          techStack: [...(newJob.techStack || []), value]
                        });
                        (e.target).value = '';
                      }
                    }
                  }}
                  style={{ marginTop: 'var(--space-3)' }}
                />
              </div>
            </>
          )}

          {jobPostStep === 5 && (
            <>
              <h3 className={styles.formSectionTitle}>Review & Publish</h3>
              <div className={styles.entryCard}>
                <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                  {newJob.title || 'Untitled Job'}
                </h4>
                <div className={styles.listItemMeta} style={{ marginBottom: 'var(--space-4)' }}>
                  <span>{newJob.department}</span>
                  <span><MapPin size={12} /> {newJob.location}</span>
                  <span>{newJob.workType}</span>
                  <span>{newJob.employmentType}</span>
                </div>
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-accent-primary)', marginBottom: 'var(--space-4)' }}>
                  {formatSalary(newJob.salaryMin || 0)} - {formatSalary(newJob.salaryMax || 0)}
                  {newJob.equity && ` + ${newJob.equity} equity`}
                </p>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {newJob.description}
                </p>
                {newJob.techStack && newJob.techStack.length > 0 && (
                  <div className={styles.skillsList}>
                    {newJob.techStack.map((tech, i) => (
                      <span key={i} className={styles.skillTag}>{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className={styles.formActions}>
            {jobPostStep > 1 && (
              <Button variant="secondary" onClick={() => setJobPostStep(jobPostStep - 1)}>
                Previous
              </Button>
            )}
            {jobPostStep < 5 ? (
              <Button variant="primary" onClick={() => setJobPostStep(jobPostStep + 1)}>
                Next
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => handlePostJob(true)}>Save Draft</Button>
                <Button variant="primary" onClick={() => handlePostJob(false)}>Publish Job</Button>
              </>
            )}
          </div>
        </div>
      </>
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


  const renderSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Company Account Card */}
      <div className={styles.settingsCard}>
        <h3 className={styles.settingsCardTitle}>Company Account</h3>
        <p className={styles.settingsCardDescription}>
          Your company account information. Contact support to make changes.
        </p>
        <div className={styles.formGrid} style={{ marginTop: '20px' }}>
          <div>
            <label className={styles.inputLabel}>Admin Email</label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div>
            <label className={styles.inputLabel}>Company Name</label>
            <Input value={company.name || ''} disabled />
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className={styles.settingsCard}>
        <h3 className={styles.settingsCardTitle}>Change Password</h3>
        <p className={styles.settingsCardDescription}>
          Update your password to keep your account secure.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px', maxWidth: '400px' }}>
          <div>
            <label className={styles.inputLabel}>Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className={styles.inputLabel}>New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className={styles.inputLabel}>Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <div style={{ marginTop: '8px' }}>
            <Button variant="primary">Update Password</Button>
          </div>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className={styles.settingsCard}>
        <h3 className={styles.settingsCardTitle}>Notification Preferences</h3>
        <p className={styles.settingsCardDescription}>
          Choose which notifications you'd like to receive.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          {[
            { id: 'newApplicants', label: 'New applicant notifications', description: 'Get notified when someone applies to your job listings' },
            { id: 'applicantUpdates', label: 'Applicant status changes', description: 'Updates when candidates move through your pipeline' },
            { id: 'weeklyReport', label: 'Weekly hiring report', description: 'A summary of your hiring activity sent every Monday' },
          ].map(item => (
            <label key={item.id} className={styles.checkboxRow}>
              <input type="checkbox" defaultChecked className={styles.checkbox} />
              <div>
                <span className={styles.checkboxLabel}>{item.label}</span>
                <span className={styles.checkboxDescription}>{item.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className={styles.settingsCard} style={{ borderColor: 'var(--color-danger, #ef4444)' }}>
        <h3 className={styles.settingsCardTitle} style={{ color: 'var(--color-danger, #ef4444)' }}>Danger Zone</h3>
        <p className={styles.settingsCardDescription}>
          Irreversible and destructive actions. Please proceed with caution.
        </p>
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Once you delete your company account, there is no going back. All your job listings, applicant data, and company profile will be permanently removed.
          </p>
          <Button variant="danger">Delete Company Account</Button>
        </div>
      </div>
    </div>
  );

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

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview': return { title: 'Dashboard', description: 'Overview of your hiring activity' };
      case 'company': return { title: 'Company Profile', description: 'Edit your public company profile' };
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
    </div>
  );
};

export default EmployerDashboard;
