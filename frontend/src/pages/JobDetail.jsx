import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/CustomButton';
import Tag from '../components/ui/CustomTag';
import Input, { Textarea } from '../components/ui/CustomInput';
import { formatSalary, formatPostedDate } from '../data/mockData';
import styles from './JobDetail.module.css';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Application form state
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState(null);
  const [useExistingResume, setUseExistingResume] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const savedJobs = await api.get('/jobs/saved');
        const isJobSaved = savedJobs.some(job => job._id === id || job.id === id);
        setIsSaved(isJobSaved);
      } catch (err) {
        console.error('Failed to check saved status:', err);
      }
    };

    if (id) {
      checkSavedStatus();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await api.post(`/jobs/${id}/save`);
      setIsSaved(response.isSaved);
    } catch (err) {
      console.error('Failed to toggle save:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  // Increment view count when job is viewed
  useEffect(() => {
    if (id) {
      api.post(`/jobs/${id}/view`).catch(() => {
        // Fire-and-forget, silently ignore errors
      });
    }
  }, [id]);




  // Fetch user profile for autofill when modal opens
  useEffect(() => {
    if (showApplyModal && user) {
      const fetchUserProfile = async () => {
        try {
          // Use the profile endpoint to get the latest resume and linkedin
          const profile = await api.get('/users/profile');
          if (profile) {
            if (profile.linkedInUrl && !linkedIn) {
              setLinkedIn(profile.linkedInUrl);
            }
            if (profile.resumeUrl) {
              setExistingResumeUrl(profile.resumeUrl);
              setUseExistingResume(true);
            }
          }
        } catch (err) {
          console.error('Failed to fetch user profile for autofill:', err);
        }
      };
      fetchUserProfile();
    }
  }, [showApplyModal, user]);

  if (loading) {
    return (
      <div className={styles.jobDetailPage}>
        <Navbar />
        <div style={{ padding: '100px', textAlign: 'center' }}>Loading job details...</div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={styles.jobDetailPage}>
        <Navbar />
        <div className={styles.jobDetailContainer}>
          <div className={styles.emptyState}>
            <h2>Job not found</h2>
            <p>This job listing may have been removed or doesn't exist.</p>
            <Link to="/jobs">
              <Button>Browse all jobs</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }



  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplicationError(null);

    try {
      let finalResumeUrl = null;

      // Handle Resume: Use existing or upload new
      if (useExistingResume && existingResumeUrl) {
        finalResumeUrl = existingResumeUrl;
      } else if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
          const uploadResult = await api.post('/upload/resume', formData);
          finalResumeUrl = uploadResult.resumeUrl;
          console.log('Resume uploaded:', finalResumeUrl);
        } catch (uploadErr) {
          console.error('Resume upload failed:', uploadErr);
          setApplicationError('Failed to upload resume. Please try again.');
          setSubmitting(false);
          return;
        }
      }

      // Submit application with resume URL
      await api.post('/applications', {
        jobId: id,
        coverLetter: coverLetter.trim() || undefined,
        linkedIn: linkedIn.trim() || undefined,
        resumeUrl: finalResumeUrl
      });
      setApplicationSubmitted(true);
    } catch (err) {
      console.error('Application failed:', err);
      setApplicationError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.jobDetailPage}>
      <Navbar />

      <div className={styles.jobDetailContainer}>
        {/* Main Content */}
        <main className={styles.jobMain}>
          <nav className={styles.breadcrumb}>
            <Link to="/jobs">Jobs</Link>
            <span>/</span>
            <span>{job.title}</span>
          </nav>

          {/* Job Header */}
          <div className={styles.jobHeader}>
            <div className={styles.jobHeaderTop}>
              <div className={styles.companyLogo}>
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={`${job.company.name} logo`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  job.company?.name?.charAt(0) || '?'
                )}
              </div>
              <div className={styles.jobHeaderInfo}>
                <h1>{job.title}</h1>
                {job.company ? (
                  <Link to={`/companies/${job.company._id}`} className={styles.companyLink}>
                    {job.company.name}
                  </Link>
                ) : (
                  <span className={styles.companyLink}>Unknown Company</span>
                )}
              </div>
            </div>

            <div className={styles.jobMeta}>
              <span className={styles.metaItem}>
                <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {job.location}
              </span>
              <Tag variant={job.workType === 'Remote' ? 'success' : 'default'}>
                {job.workType}
              </Tag>
              <span className={styles.metaItem}>{job.employmentType}</span>
              <span className={styles.metaItem}>{job.experienceLevel} Level</span>
              <span className={styles.metaItem}>Posted {formatPostedDate(job.postedAt)}</span>
            </div>

            <div className={styles.salarySection}>
              <div className={styles.salaryItem}>
                <span className={styles.salaryLabel}>Salary Range</span>
                <span className={styles.salaryValue}>
                  {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
                </span>
              </div>
              {job.equity && (
                <div className={styles.salaryItem}>
                  <span className={styles.salaryLabel}>Equity</span>
                  <span className={styles.salaryValue}>{job.equity}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <section className={styles.contentSection}>
            <h2>About the Role</h2>
            <p className={styles.description}>{job.description}</p>
          </section>

          {/* Responsibilities */}
          <section className={styles.contentSection}>
            <h2>Responsibilities</h2>
            <ul className={styles.list}>
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section className={styles.contentSection}>
            <h2>Requirements</h2>
            <ul className={styles.list}>
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Tech Stack */}
          <section className={styles.contentSection}>
            <h2>Tech Stack</h2>
            <div className={styles.techTags}>
              {job.techStack.map(tech => (
                <Tag key={tech} size="large">{tech}</Tag>
              ))}
            </div>
          </section>

          {/* Benefits */}
          {job.niceToHave && job.niceToHave.length > 0 && (
            <section className={styles.contentSection}>
              <h2>Benefits & Perks</h2>
              <ul className={styles.list}>
                {job.niceToHave.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className={styles.jobSidebar}>
          <div className={styles.applyCard}>
            <h3>Interested in this job?</h3>
            <div className={styles.applyActions}>
              <Button fullWidth onClick={() => setShowApplyModal(true)}>
                Apply Now
              </Button>
              <Button
                variant={isSaved ? 'primary' : 'secondary'}
                fullWidth
                onClick={handleSave}
              >
                {isSaved ? '✓ Saved' : 'Save for Later'}
              </Button>
            </div>
            <p className={styles.applicantCount}>
              {job.applicationCount} Applied
            </p>
          </div>

          {job.company && (
            <div className={styles.companyCard}>
              <div className={styles.companyCardHeader}>
                <div className={styles.companyCardLogo}>
                  {job.company.logo ? (
                    <img
                      src={job.company.logo}
                      alt={`${job.company.name} logo`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    job.company.name.charAt(0)
                  )}
                </div>
                <div className={styles.companyCardInfo}>
                  <h4>{job.company.name}</h4>
                  <p>{job.company.industry}</p>
                </div>
              </div>
              <div className={styles.companyStats}>
                <div className={styles.companyStat}>
                  <span>Team Size</span>
                  <span>{job.company.teamSize}</span>
                </div>
                <div className={styles.companyStat}>
                  <span>Founded</span>
                  <span>{job.company.founded}</span>
                </div>
                <div className={styles.companyStat}>
                  <span>Stage</span>
                  <span>{job.company.stage}</span>
                </div>
                <div className={styles.companyStat}>
                  <span>Location</span>
                  <span>{job.company.location}</span>
                </div>
              </div>
              <Link to={`/companies/${job.company._id}`}>
                <Button variant="outline" fullWidth size="small">
                  View Company Profile
                </Button>
              </Link>
            </div>
          )}
        </aside>
      </div>

      <Footer />

      {/* Apply Modal */}
      {showApplyModal && (
        <div className={styles.modalOverlay} onClick={() => setShowApplyModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Apply for {job.title}</h2>
              <button className={styles.modalClose} onClick={() => setShowApplyModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {applicationSubmitted ? (
                <div className={styles.successState}>
                  <span className={styles.successIcon}>✓</span>
                  <h3>Application Submitted!</h3>
                  <p>We'll notify you when {job.company?.name || 'the company'} reviews your application.</p>
                  <Button onClick={() => setShowApplyModal(false)} style={{ marginTop: '16px' }}>
                    Close
                  </Button>
                </div>
              ) : (
                <form className={styles.applyForm} onSubmit={handleApply}>
                  <div className={styles.fileUpload}>
                    <label>Resume (optional)</label>

                    {useExistingResume && existingResumeUrl ? (
                      <div className={styles.existingResumeCard} style={{
                        padding: '12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        backgroundColor: 'var(--color-surface)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6'
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="12" y1="18" x2="12" y2="12"></line>
                              <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>Resume from Profile</p>
                            <a href={existingResumeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#64748b' }}>View Resume</a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUseExistingResume(false)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '4px'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".pdf,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setResumeFile(e.target.files[0]);
                              setUseExistingResume(false);
                            }
                          }}
                        />
                        <div
                          className={styles.fileDropzone}
                          onClick={() => fileInputRef.current?.click()}
                          style={{ cursor: 'pointer' }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              setResumeFile(e.dataTransfer.files[0]);
                              setUseExistingResume(false);
                            }
                          }}
                        >
                          {resumeFile ? (
                            <>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5">
                                <path d="M9 12l2 2 4-4" />
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              <p style={{ fontWeight: 500, color: '#22c55e' }}>{resumeFile.name}</p>
                              <span style={{ cursor: 'pointer', color: '#64748b' }} onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}>Click to remove</span>
                            </>
                          ) : (
                            <>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                              </svg>
                              <p>Drop your resume here or click to upload</p>
                              <span>PDF, DOC up to 5MB</span>
                              {existingResumeUrl && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); setUseExistingResume(true); }}
                                  style={{ marginTop: '8px', color: '#3b82f6' }}
                                >
                                  Use Profile Resume
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <Textarea
                    label="Cover Letter (optional)"
                    placeholder="Tell us why you're interested in this role..."
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                  <Input
                    type="text"
                    label="LinkedIn Profile (optional)"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                  />
                  {applicationError && (
                    <div style={{ color: 'var(--color-error, #dc2626)', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px', marginBottom: '12px' }}>
                      {applicationError}
                    </div>
                  )}
                  <Button type="submit" fullWidth disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
