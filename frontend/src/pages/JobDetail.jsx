import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/CustomButton';
import Tag from '../components/ui/CustomTag';
import Input, { Textarea } from '../components/ui/CustomInput';
import { formatSalary, formatPostedDate } from '../data/mockData';
import styles from './JobDetail.module.css';
import { api } from '../lib/api';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  // Increment view count when job is viewed
  useEffect(() => {
    if (id) {
      api.post(`/jobs/${id}/view`).catch(() => {
        // Fire-and-forget, silently ignore errors
      });
    }
  }, [id]);

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

  const handleApply = (e) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setApplicationSubmitted(true);
    }, 1000);
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
                {job.company.name.charAt(0)}
              </div>
              <div className={styles.jobHeaderInfo}>
                <h1>{job.title}</h1>
                <Link to={`/companies/${job.company.id}`} className={styles.companyLink}>
                  {job.company.name}
                </Link>
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
                variant="secondary"
                fullWidth
                onClick={() => setIsSaved(!isSaved)}
              >
                {isSaved ? '✓ Saved' : 'Save for Later'}
              </Button>
            </div>
            <p className={styles.applicantCount}>
              {job.applicationCount} applicants
            </p>
          </div>

          <div className={styles.companyCard}>
            <div className={styles.companyCardHeader}>
              <div className={styles.companyCardLogo}>
                {job.company.name.charAt(0)}
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
            <Link to={`/companies/${job.company.id}`}>
              <Button variant="outline" fullWidth size="small">
                View Company Profile
              </Button>
            </Link>
          </div>
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
                  <p>We'll notify you when {job.company.name} reviews your application.</p>
                  <Button onClick={() => setShowApplyModal(false)} style={{ marginTop: '16px' }}>
                    Close
                  </Button>
                </div>
              ) : (
                <form className={styles.applyForm} onSubmit={handleApply}>
                  <div className={styles.fileUpload}>
                    <label>Resume *</label>
                    <div className={styles.fileDropzone}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <p>Drop your resume here or click to upload</p>
                      <span>PDF, DOC up to 5MB</span>
                    </div>
                  </div>
                  <Textarea
                    label="Cover Letter (optional)"
                    placeholder="Tell us why you're interested in this role..."
                    rows={4}
                  />
                  <Input
                    type="text"
                    label="LinkedIn Profile (optional)"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <Button type="submit" fullWidth>
                    Submit Application
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
