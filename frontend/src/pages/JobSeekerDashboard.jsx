import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Briefcase, Heart, FileText, Settings, Bell, Shield,
  MapPin, Calendar, ExternalLink, X, Plus, Edit2, Trash2,
  ChevronRight, Upload, Eye, EyeOff
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/CustomButton';
import Input, { Textarea } from '../components/ui/CustomInput';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  formatSalary,
  formatPostedDate,
  getProfileCompleteness,
} from '../data/mockData';
import styles from './Dashboard.module.css';

const formatUrl = (url) => {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};


const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Profile Separately
        try {
          const profileData = await api.get('/users/profile');
          // Default structure to ensure no undefined errors
          const defaultProfile = {
            fullName: user?.name || '',
            email: user?.email || '',
            phone: '',
            location: '',
            skills: [],
            experience: [],
            education: [],
            projects: [],
            preferences: { desiredRoles: [], workTypes: [], salaryMin: undefined, salaryMax: undefined },
            availability: 'Open to opportunities',
            profileVisibility: 'Public',
            summary: '',
            noticePeriod: '',
            currentTitle: '',
            openToRemote: false,
            openToRelocation: false,
            portfolioUrl: '',
            linkedInUrl: '',
            githubUrl: '',
            resumeUrl: ''
          };
          // Merge API data on top of defaults
          console.log('Fetched Profile Data:', profileData);
          setProfile({ ...defaultProfile, ...(profileData || {}) });
        } catch (profileErr) {
          console.error('Failed to fetch profile:', profileErr);
          // Fallback for UI safety
          setProfile({
            fullName: user?.name || '',
            email: user?.email || '',
            skills: [],
            experience: [],
            education: [],
            projects: [],
            preferences: { desiredRoles: [], workTypes: [] },
            availability: 'Actively looking',
            profileVisibility: 'Public',
            summary: 'Error loading profile'
          });
        }

        // Fetch Other Data
        try {
          const [applicationsData, savedJobsData] = await Promise.all([
            api.get('/applications/my-applications'),
            api.get('/jobs/saved')
          ]);
          setApplications(applicationsData || []);
          setSavedJobs(savedJobsData || []);
        } catch (otherErr) {
          console.error('Failed to fetch applications or saved jobs:', otherErr);
          // Verify if these endpoints actually exist; if not, ignore for now
        }

      } catch (err) {
        console.error('Unexpected error in dashboard fetch:', err);
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

  const profileCompleteness = profile ? getProfileCompleteness(profile) : 0;


  const applicationsByStatus = {
    applied: applications.filter(a => a.status === 'Applied').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Applied': styles.badgeApplied,
      'Viewed': styles.badgeViewed,
      'Shortlisted': styles.badgeShortlisted,
      'Interview': styles.badgeInterview,
      'Offer': styles.badgeOffer,
      'Rejected': styles.badgeRejected,
    };
    return `${styles.badge} ${statusClasses[status]}`;
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Briefcase size={18} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'applications', label: 'Applications', icon: <FileText size={18} /> },
    { id: 'saved', label: 'Saved Jobs', icon: <Heart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const renderOverview = () => (
    <>
      {/* Profile Completeness - Only show if not 100% */}
      {profileCompleteness < 100 && (
        <div className={styles.card}>
          <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Profile Completeness</span>
              <span className={styles.progressValue}>{profileCompleteness}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${profileCompleteness}%` }} />
            </div>
          </div>
          <Button variant="secondary" size="small" onClick={() => setActiveSection('profile')}>
            Complete Your Profile
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Applications</p>
          <p className={styles.statValue}>{applications.length}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Shortlisted</p>
          <p className={styles.statValue}>{applicationsByStatus.shortlisted}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Interviews</p>
          <p className={styles.statValue}>{applicationsByStatus.interview}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Saved Jobs</p>
          <p className={styles.statValue}>{savedJobs.length}</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Recent Applications</h3>
          <Button variant="ghost" size="small" onClick={() => setActiveSection('applications')}>
            View All <ChevronRight size={16} />
          </Button>
        </div>
        <div className={styles.list}>
          {applications.slice(0, 3).map(app => (
            <Link key={app.id} to={`/jobs/${app.jobId}`} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <h4 className={styles.listItemTitle}>{app.job.title}</h4>
                <div className={styles.listItemMeta}>
                  <span>{app.job.company.name}</span>
                  <span>{formatPostedDate(app.appliedAt)}</span>
                </div>
              </div>
              <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Saved Jobs */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Saved Jobs</h3>
          <Button variant="ghost" size="small" onClick={() => setActiveSection('saved')}>
            View All <ChevronRight size={16} />
          </Button>
        </div>
        <div className={styles.list}>
          {savedJobs.slice(0, 3).map(saved => (
            <Link key={saved.id} to={`/jobs/${saved.jobId}`} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <h4 className={styles.listItemTitle}>{saved.job.title}</h4>
                <div className={styles.listItemMeta}>
                  <span>{saved.job.company.name}</span>
                  <span>{formatSalary(saved.job.salaryMin)} - {formatSalary(saved.job.salaryMax)}</span>
                </div>
              </div>
              <Button variant="primary" size="small">Apply</Button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  // Profile management handlers
  const handleAddSkill = () => {
    const skillName = prompt('Enter skill name:');
    if (skillName && skillName.trim()) {
      const proficiency = prompt('Enter proficiency level (Beginner/Intermediate/Advanced/Expert):') || 'Intermediate';
      const newSkill = {
        name: skillName.trim(),
        proficiency,
        primary: false
      };
      setProfile({ ...profile, skills: [...(profile.skills || []), newSkill] });
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: newSkills });
  };

  const handleAddDesiredRole = () => {
    const role = prompt('Enter desired role (e.g., Frontend Developer):');
    if (role && role.trim()) {
      const newRoles = [...(profile.preferences.desiredRoles || []), role.trim()];
      setProfile({ ...profile, preferences: { ...profile.preferences, desiredRoles: newRoles } });
    }
  };

  const handleRemoveDesiredRole = (index) => {
    const newRoles = profile.preferences.desiredRoles.filter((_, i) => i !== index);
    setProfile({ ...profile, preferences: { ...profile.preferences, desiredRoles: newRoles } });
  };

  const handleAddWorkType = () => {
    const type = prompt('Enter work type (Full-time, Part-time, Contract, Freelance, Internship):');
    if (type && type.trim()) {
      const newTypes = [...(profile.preferences.workTypes || []), type.trim()];
      setProfile({ ...profile, preferences: { ...profile.preferences, workTypes: newTypes } });
    }
  };

  const handleRemoveWorkType = (index) => {
    const newTypes = profile.preferences.workTypes.filter((_, i) => i !== index);
    setProfile({ ...profile, preferences: { ...profile.preferences, workTypes: newTypes } });
  };

  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      title: '',
      company: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setProfile({ ...profile, experience: [...(profile.experience || []), newExp] });
  };

  const handleRemoveExperience = (id) => {
    const newExperience = profile.experience.filter(exp => exp.id !== id);
    setProfile({ ...profile, experience: newExperience });
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      field: '',
      institution: '',
      startYear: '',
      endYear: '',
      grade: ''
    };
    setProfile({ ...profile, education: [...(profile.education || []), newEdu] });
  };

  const handleRemoveEducation = (id) => {
    const newEducation = profile.education.filter(edu => edu.id !== id);
    setProfile({ ...profile, education: newEducation });
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      title: '',
      role: '',
      description: '',
      techStack: [],
      githubUrl: ''
    };
    setProfile({ ...profile, projects: [...(profile.projects || []), newProject] });
  };

  const handleRemoveProject = (id) => {
    const newProjects = profile.projects.filter(proj => proj.id !== id);
    setProfile({ ...profile, projects: newProjects });
  };

  const handleUpdateExperience = (id, field, value) => {
    const newExperience = profile.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setProfile({ ...profile, experience: newExperience });
  };

  const handleUpdateEducation = (id, field, value) => {
    const newEducation = profile.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setProfile({ ...profile, education: newEducation });
  };

  const handleUpdateProject = (id, field, value) => {
    const newProjects = profile.projects.map(proj =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    setProfile({ ...profile, projects: newProjects });
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/users/upload-resume', formData);

      setProfile({ ...profile, resumeUrl: response.resumeUrl });
      alert('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload resume';
      alert(`Failed to upload resume: ${errorMessage}`);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Clean payload: ensure numerical fields are numbers or undefined
      const payload = {
        ...profile,
        preferences: {
          ...profile.preferences,
          salaryMin: profile.preferences.salaryMin === '' ? undefined : profile.preferences.salaryMin,
          salaryMax: profile.preferences.salaryMax === '' ? undefined : profile.preferences.salaryMax,
        }
      };
      const response = await api.put('/users/profile', payload);
      setProfile(response); // Update local state with saved data
      setOriginalProfile(response); // Update backup
      setIsEditing(false); // Exit edit mode
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      alert(`Failed to update profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const renderProfile = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        {!isEditing && (
          <Button variant="secondary" onClick={() => {
            setOriginalProfile(profile);
            setIsEditing(true);
          }}>
            <Edit2 size={16} /> Edit Profile
          </Button>
        )}
      </div>

      {/* Basic Info */}
      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Basic Information</h3>
        <div className={styles.formGrid}>
          {isEditing ? (
            <>
              <Input
                label="Full Name"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                disabled
              />
              <Input
                label="Phone"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <Input
                label="Location"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
              <Input
                label="Current Title"
                value={profile.currentTitle || ''}
                onChange={(e) => setProfile({ ...profile, currentTitle: e.target.value })}
              />
              <Input
                label="Notice Period"
                value={profile.noticePeriod || ''}
                onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
              />
            </>
          ) : (
            <>
              <div><label className={styles.detailLabel}>Full Name</label><p className={styles.detailValue}>{profile.fullName}</p></div>
              <div><label className={styles.detailLabel}>Email</label><p className={styles.detailValue}>{profile.email}</p></div>
              <div><label className={styles.detailLabel}>Phone</label><p className={styles.detailValue}>{profile.phone || 'Not specified'}</p></div>
              <div><label className={styles.detailLabel}>Location</label><p className={styles.detailValue}>{profile.location || 'Not specified'}</p></div>
              <div><label className={styles.detailLabel}>Current Title</label><p className={styles.detailValue}>{profile.currentTitle || 'Not specified'}</p></div>
              <div><label className={styles.detailLabel}>Notice Period</label><p className={styles.detailValue}>{profile.noticePeriod || 'Not specified'}</p></div>
            </>
          )}
        </div>
        <div className={styles.formGrid} style={{ marginTop: 'var(--space-4)' }}>
          {isEditing ? (
            <>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                <input
                  type="checkbox"
                  checked={profile.openToRemote}
                  onChange={(e) => setProfile({ ...profile, openToRemote: e.target.checked })}
                />
                Open to Remote
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                <input
                  type="checkbox"
                  checked={profile.openToRelocation}
                  onChange={(e) => setProfile({ ...profile, openToRelocation: e.target.checked })}
                />
                Open to Relocation
              </label>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '16px' }}>
              {profile.openToRemote && <span className={styles.badgeViewed}>Open to Remote</span>}
              {profile.openToRelocation && <span className={styles.badgeViewed}>Open to Relocation</span>}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Professional Summary</h3>
        {isEditing ? (
          <Textarea
            label="About You"
            value={profile.summary || ''}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            hint="3-5 lines about your experience and what you're looking for"
          />
        ) : (
          <p className={styles.detailValue}>{profile.summary || 'No summary provided.'}</p>
        )}
      </div>

      {/* Skills */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Skills</h3>
          {isEditing && (
            <Button variant="secondary" size="small" onClick={handleAddSkill}>
              <Plus size={16} /> Add Skill
            </Button>
          )}
        </div>
        <div className={styles.skillsList}>
          {profile.skills.map((skill, index) => (
            <span key={index} className={`${styles.skillTag} ${skill.primary ? styles.skillTagPrimary : ''}`}>
              {skill.name}
              <span className={styles.skillLevel}>{skill.proficiency}</span>
              {isEditing && (
                <button className={styles.removeSkill} onClick={() => handleRemoveSkill(index)}>
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Work Experience</h3>
          {isEditing && (
            <Button variant="secondary" size="small" onClick={handleAddExperience}>
              <Plus size={16} /> Add Experience
            </Button>
          )}
        </div>
        {profile.experience.map((exp) => (
          <div key={exp.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div style={{ flex: 1 }}>
                {isEditing ? (
                  <>
                    <Input
                      value={exp.title}
                      onChange={(e) => handleUpdateExperience(exp.id, 'title', e.target.value)}
                      placeholder="Job Title"
                      style={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Company Name"
                      style={{ marginBottom: '8px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="Start Date"
                        style={{ flex: 1 }}
                      />
                      <Input
                        value={exp.endDate}
                        onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="End Date"
                        disabled={exp.current}
                        style={{ flex: 1 }}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleUpdateExperience(exp.id, 'current', e.target.checked)}
                      />
                      I currently work here
                    </label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </>
                ) : (
                  <>
                    <h4 className={styles.entryTitle}>{exp.title}</h4>
                    <p className={styles.entrySubtitle}>{exp.company} · {exp.employmentType}</p>
                    <p className={styles.entryMeta}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && <p className={styles.entryDescription}>{exp.description}</p>}
                  </>
                )}
              </div>
              {isEditing && (
                <div className={styles.entryActions}>
                  <Button variant="ghost" size="small" onClick={() => handleRemoveExperience(exp.id)}><Trash2 size={14} /></Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Education</h3>
          {isEditing && (
            <Button variant="secondary" size="small" onClick={handleAddEducation}>
              <Plus size={16} /> Add Education
            </Button>
          )}
        </div>
        {profile.education.map((edu) => (
          <div key={edu.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div style={{ flex: 1 }}>
                {isEditing ? (
                  <>
                    <Input
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Degree"
                      style={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={edu.field}
                      onChange={(e) => handleUpdateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Field of Study"
                      style={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="Institution"
                      style={{ marginBottom: '8px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Input
                        value={edu.startYear}
                        onChange={(e) => handleUpdateEducation(edu.id, 'startYear', e.target.value)}
                        placeholder="Start Year"
                        style={{ flex: 1 }}
                      />
                      <Input
                        value={edu.endYear}
                        onChange={(e) => handleUpdateEducation(edu.id, 'endYear', e.target.value)}
                        placeholder="End Year"
                        style={{ flex: 1 }}
                      />
                      <Input
                        value={edu.grade}
                        onChange={(e) => handleUpdateEducation(edu.id, 'grade', e.target.value)}
                        placeholder="Grade"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className={styles.entryTitle}>{edu.degree} in {edu.field}</h4>
                    <p className={styles.entrySubtitle}>{edu.institution}</p>
                    <p className={styles.entryMeta}>
                      {edu.startYear} - {edu.endYear || 'Present'}
                      {edu.grade && ` · ${edu.grade}`}
                    </p>
                  </>
                )}
              </div>
              {isEditing && (
                <div className={styles.entryActions}>
                  <Button variant="ghost" size="small" onClick={() => handleRemoveEducation(edu.id)}><Trash2 size={14} /></Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Projects</h3>
          {isEditing && (
            <Button variant="secondary" size="small" onClick={handleAddProject}>
              <Plus size={16} /> Add Project
            </Button>
          )}
        </div>
        {profile.projects.map((project) => (
          <div key={project.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div style={{ flex: 1 }}>
                {isEditing ? (
                  <>
                    <Input
                      value={project.title}
                      onChange={(e) => handleUpdateProject(project.id, 'title', e.target.value)}
                      placeholder="Project Title"
                      style={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={project.role}
                      onChange={(e) => handleUpdateProject(project.id, 'role', e.target.value)}
                      placeholder="Your Role"
                      style={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={project.githubUrl}
                      onChange={(e) => handleUpdateProject(project.id, 'githubUrl', e.target.value)}
                      placeholder="GitHub/Link URL"
                      style={{ marginBottom: '8px' }}
                    />
                    <Textarea
                      value={project.description}
                      onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </>
                ) : (
                  <>
                    <h4 className={styles.entryTitle}>{project.title}</h4>
                    <p className={styles.entrySubtitle}>{project.role}</p>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                        {project.githubUrl}
                      </a>
                    )}
                    <p className={styles.entryDescription}>{project.description}</p>
                  </>
                )}
                <div className={styles.skillsList} style={{ marginTop: 'var(--space-2)' }}>
                  {/* Simplified tech stack input could be added here later */}
                  {/* Logic for tech stack update is complex, skipping for now unless requested */}
                </div>
              </div>
              {isEditing && (
                <div className={styles.entryActions}>
                  <Button variant="ghost" size="small" onClick={() => handleRemoveProject(project.id)}><Trash2 size={14} /></Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resume */}
      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Resume</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            style={{ display: 'none' }}
            id="resume-upload"
          />
          {isEditing ? (
            /* Edit Mode: Show Upload/Replace buttons */
            <>
              {profile.resumeUrl && (
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  resume.pdf uploaded
                </span>
              )}
              <Button variant="primary" size="small" onClick={() => document.getElementById('resume-upload').click()}>
                <Upload size={16} /> {profile.resumeUrl ? 'Replace Resume' : 'Upload Resume'}
              </Button>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="small"><Eye size={16} /></Button>
                </a>
              )}
            </>
          ) : (
            /* View Mode: Show only View button or "Not specified" */
            <>
              {profile.resumeUrl ? (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <div style={{ padding: '8px', background: '#ffebee', borderRadius: '4px', color: '#d32f2f' }}>
                      <file-icon>PDF</file-icon> {/* Placeholder for PDF icon representation */}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>My Resume.pdf</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Click to view</p>
                    </div>
                  </div>
                </a>
              ) : (
                <p className={styles.detailValue}>No resume uploaded</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Links */}
      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Portfolio & Links</h3>
        <div className={styles.formGrid}>
          {isEditing ? (
            <>
              <Input
                label="Portfolio Website"
                value={profile.portfolioUrl || ''}
                onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
              />
              <Input
                label="LinkedIn"
                value={profile.linkedInUrl || ''}
                onChange={(e) => setProfile({ ...profile, linkedInUrl: e.target.value })}
              />
              <Input
                label="GitHub"
                value={profile.githubUrl || ''}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              />
            </>
          ) : (
            <>
              <div><label className={styles.detailLabel}>Portfolio Website</label>
                {profile.portfolioUrl ? <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>: {formatUrl(profile.portfolioUrl)}</a> : <p className={styles.detailValue}>: Not specified</p>}
              </div>
              <div><label className={styles.detailLabel}>LinkedIn</label>
                {profile.linkedInUrl ? <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>: {formatUrl(profile.linkedInUrl)}</a> : <p className={styles.detailValue}>: Not specified</p>}
              </div>
              <div><label className={styles.detailLabel}>GitHub</label>
                {profile.githubUrl ? <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>: {formatUrl(profile.githubUrl)}</a> : <p className={styles.detailValue}>: Not specified</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Job Preferences */}
      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Job Preferences</h3>
        <div className={styles.formGrid}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
              Desired Roles
            </label>
            <div className={styles.skillsList}>
              {profile.preferences.desiredRoles.map((role, i) => (
                <span key={i} className={styles.skillTag}>
                  {role}
                  {isEditing && <button className={styles.removeSkill} onClick={() => handleRemoveDesiredRole(i)}><X size={14} /></button>}
                </span>
              ))}
              {isEditing && (
                <Button variant="secondary" size="small" onClick={handleAddDesiredRole}>
                  <Plus size={14} /> Add Role
                </Button>
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
              Work Type
            </label>
            <div className={styles.skillsList}>
              {profile.preferences.workTypes.map((type, i) => (
                <span key={i} className={styles.skillTag}>
                  {type}
                  {isEditing && <button className={styles.removeSkill} onClick={() => handleRemoveWorkType(i)}><X size={14} /></button>}
                </span>
              ))}
              {isEditing && (
                <Button variant="secondary" size="small" onClick={handleAddWorkType}>
                  <Plus size={14} /> Add Type
                </Button>
              )}
            </div>
          </div>
          {isEditing ? (
            <>
              <Input
                label="Minimum Salary"
                type="number"
                value={profile.preferences.salaryMin?.toString() || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, salaryMin: parseInt(e.target.value) || undefined }
                })}
              />
              <Input
                label="Maximum Salary"
                type="number"
                value={profile.preferences.salaryMax?.toString() || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, salaryMax: parseInt(e.target.value) || undefined }
                })}
              />
            </>
          ) : (
            <>
              <div><label className={styles.detailLabel}>Minimum Salary</label><p className={styles.detailValue}>{formatSalary(profile.preferences.salaryMin) || 'Not specified'}</p></div>
              <div><label className={styles.detailLabel}>Maximum Salary</label><p className={styles.detailValue}>{formatSalary(profile.preferences.salaryMax) || 'Not specified'}</p></div>
            </>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Availability</h3>
        <div className={styles.formGrid}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
              Job Search Status
            </label>
            <select
              value={profile.availability}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <option value="Actively looking">Actively looking</option>
              <option value="Open to opportunities">Open to opportunities</option>
              <option value="Not looking">Not looking</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
              Profile Visibility
            </label>
            <select
              value={profile.profileVisibility}
              onChange={(e) => setProfile({ ...profile, profileVisibility: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <option value="Public">Public</option>
              <option value="Recruiters only">Recruiters only</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={styles.formActions}>
          <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveProfile} loading={loading}>Save Changes</Button>
        </div>
      )}
    </>
  );

  const renderApplications = () => (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>All Applications</h3>
      {applications.length > 0 ? (
        <div className={styles.list} style={{ marginTop: 'var(--space-4)' }}>
          {applications.map(app => (
            <Link key={app.id} to={`/jobs/${app.jobId}`} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <h4 className={styles.listItemTitle}>{app.job.title}</h4>
                <div className={styles.listItemMeta}>
                  <span>{app.job.company.name}</span>
                  <span><MapPin size={12} /> {app.job.location}</span>
                  <span><Calendar size={12} /> Applied {formatPostedDate(app.appliedAt)}</span>
                </div>
              </div>
              <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h4 className={styles.emptyTitle}>No applications yet</h4>
          <p className={styles.emptyDescription}>Start applying to jobs to track your progress here.</p>
          <Link to="/jobs">
            <Button variant="primary">Browse Jobs</Button>
          </Link>
        </div>
      )}
    </div>
  );

  const renderSaved = () => (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Saved Jobs</h3>
      {savedJobs.length > 0 ? (
        <div className={styles.list} style={{ marginTop: 'var(--space-4)' }}>
          {savedJobs.map(saved => (
            <div key={saved.id} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <h4 className={styles.listItemTitle}>{saved.job.title}</h4>
                <div className={styles.listItemMeta}>
                  <span>{saved.job.company.name}</span>
                  <span><MapPin size={12} /> {saved.job.location}</span>
                  <span>{formatSalary(saved.job.salaryMin)} - {formatSalary(saved.job.salaryMax)}</span>
                </div>
              </div>
              <div className={styles.listItemActions}>
                <Link to={`/jobs/${saved.jobId}`}>
                  <Button variant="primary" size="small">View Job</Button>
                </Link>
                <Button variant="ghost" size="small">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>❤️</div>
          <h4 className={styles.emptyTitle}>No saved jobs</h4>
          <p className={styles.emptyDescription}>Save jobs you're interested in to review later.</p>
          <Link to="/jobs">
            <Button variant="primary">Browse Jobs</Button>
          </Link>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <>
      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Notification Preferences</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[
            { id: 'newJobs', label: 'New job alerts matching my preferences' },
            { id: 'applicationUpdates', label: 'Application status updates' },
            { id: 'messages', label: 'Employer messages' },
            { id: 'weeklyDigest', label: 'Weekly job digest' },
          ].map(item => (
            <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              <input type="checkbox" defaultChecked />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Privacy & Security</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'var(--font-medium)' }}>Profile Visibility</p>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Control who can see your profile
              </p>
            </div>
            <select
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <option>Public</option>
              <option>Recruiters only</option>
              <option>Private</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'var(--font-medium)' }}>Resume Visibility</p>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Control who can download your resume
              </p>
            </div>
            <select
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <option>Public</option>
              <option>Recruiters only</option>
              <option>Private</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.formSectionTitle}>Account</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Button variant="secondary">Change Password</Button>
          <Button variant="danger">Delete Account</Button>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'profile': return renderProfile();
      case 'applications': return renderApplications();
      case 'saved': return renderSaved();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview': return { title: 'Dashboard', description: 'Track your job search progress' };
      case 'profile': return { title: 'My Profile', description: 'Manage your professional profile' };
      case 'applications': return { title: 'Applications', description: 'Track your job applications' };
      case 'saved': return { title: 'Saved Jobs', description: 'Jobs you\'ve bookmarked for later' };
      case 'settings': return { title: 'Settings', description: 'Manage your account preferences' };
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
            <h2 className={styles.sidebarTitle}>Job Seeker</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeSection === item.id ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection(item.id)}
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

export default JobSeekerDashboard;
