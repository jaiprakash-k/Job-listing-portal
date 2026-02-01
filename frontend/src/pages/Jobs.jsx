import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Tag from '../components/ui/CustomTag';
import { techStacks, experienceLevels, formatSalary, formatPostedDate } from '../data/mockData';
import styles from './Jobs.module.css';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([]);
  const [selectedTechStack, setSelectedTechStack] = useState([]);
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(10000000);
  const [sortBy, setSortBy] = useState('relevant');
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch jobs
        const jobsData = await api.get('/jobs');
        setJobs(jobsData);

        // Only fetch saved jobs if user is logged in
        if (user) {
          console.log('User is logged in:', user);
          try {
            const profileData = await api.get('/users/profile');
            console.log('Profile data:', profileData);
            console.log('Saved jobs from profile:', profileData?.savedJobs);
            if (profileData?.savedJobs) {
              // Convert ObjectIds to strings for comparison
              const savedJobIds = profileData.savedJobs.map(id => typeof id === 'string' ? id : id.toString());
              setSavedJobs(savedJobIds);
              console.log('Set saved jobs to:', savedJobIds);
            }
          } catch (profileErr) {
            console.error('Failed to fetch saved jobs:', profileErr);
          }
        } else {
          console.log('User is not logged in');
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        (job.company?.name || '').toLowerCase().includes(query)
      );
    }

    // Filter by work type
    if (selectedWorkTypes.length > 0) {
      result = result.filter(job => selectedWorkTypes.includes(job.workType));
    }

    // Filter by experience
    if (selectedExperience.length > 0) {
      // Default to 'Mid' for legacy jobs without this field
      result = result.filter(job => selectedExperience.includes(job.experienceLevel || 'Mid'));
    }

    // Filter by employment type
    if (selectedEmploymentTypes.length > 0) {
      result = result.filter(job => selectedEmploymentTypes.includes(job.employmentType));
    }

    // Filter by tech stack
    if (selectedTechStack.length > 0) {
      result = result.filter(job => {
        // Check exact match in metadata
        const hasTechInMetadata = (job.techStack || []).some(tech => selectedTechStack.includes(tech));
        if (hasTechInMetadata) return true;

        // Fallback: Check description and requirements for keyword match
        // This handles cases where techStack metadata might be missing
        const textContent = (
          (job.description || '') + ' ' +
          (job.requirements || []).join(' ') + ' ' +
          (job.responsibilities || []).join(' ')
        ).toLowerCase();

        return selectedTechStack.some(tech => textContent.includes(tech.toLowerCase()));
      });
    }

    // Filter by salary (only if job has salary and user changed filter from default)
    // Default max is 10,000,000
    const hasUserChangedSalaryFilter = salaryMin > 0 || salaryMax < 10000000;
    if (hasUserChangedSalaryFilter) {
      result = result.filter(job => {
        // Skip filter for jobs without salary info
        if (job.salaryMin == null && job.salaryMax == null) return true;
        const jobMin = job.salaryMin || 0;
        const jobMax = job.salaryMax || Infinity;
        return jobMin >= salaryMin && jobMax <= salaryMax;
      });
    }

    // Sort
    switch (sortBy) {
      case 'salary':
        result.sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      default:
        // Keep default order for "relevant"
        break;
    }

    return result;
  }, [jobs, searchQuery, selectedWorkTypes, selectedExperience, selectedEmploymentTypes, selectedTechStack, salaryMin, salaryMax, sortBy]);

  const toggleFilter = (value, selected, setSelected) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const toggleSaveJob = async (jobId, e) => {
    e.preventDefault();
    console.log('Toggling save for job:', jobId);
    console.log('Current saved jobs:', savedJobs);
    console.log('User logged in:', !!user);

    // If user is not logged in, save to localStorage and prompt to log in
    if (!user) {
      if (savedJobs.includes(jobId)) {
        const newSavedJobs = savedJobs.filter(id => id !== jobId);
        setSavedJobs(newSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      } else {
        const newSavedJobs = [...savedJobs, jobId];
        setSavedJobs(newSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
        // Show a subtle notification that they should log in to persist
        console.info('💡 Log in to save jobs permanently across devices!');
      }
      return;
    }

    // User is logged in, save to backend
    try {
      // Optimistically update UI
      if (savedJobs.includes(jobId)) {
        setSavedJobs(savedJobs.filter(id => id !== jobId));
        console.log('Removing job from saved');
      } else {
        setSavedJobs([...savedJobs, jobId]);
        console.log('Adding job to saved');
      }

      // Call API to toggle save status
      const response = await api.post(`/jobs/${jobId}/save`);
      console.log('API response:', response);
    } catch (err) {
      console.error('Failed to toggle save:', err);
      // Revert optimistic update on error
      if (savedJobs.includes(jobId)) {
        setSavedJobs([...savedJobs, jobId]);
      } else {
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedWorkTypes([]);
    setSelectedExperience([]);
    setSelectedEmploymentTypes([]);
    setSelectedTechStack([]);
    setSalaryMin(0);
    setSalaryMax(10000000);
  };

  return (
    <div className={styles.jobsPage}>
      <Navbar />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Explore Jobs</h1>
        <p className={styles.pageSubtitle}>Discover your next career move from thousands of opportunities</p>

        <div className={styles.searchContainer}>
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.jobsContainer}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', width: '100%', gridColumn: '1 / -1' }}>
            Loading jobs...
          </div>
        ) : (
          <>
            {/* Filters Sidebar */}
            <aside className={styles.filtersSidebar}>
              <div className={styles.filtersHeader}>
                <h2 className={styles.filtersTitle}>Filters</h2>
                <button className={styles.clearFilters} onClick={clearFilters}>
                  Clear all
                </button>
              </div>

              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Work Type</label>
                <div className={styles.filterOptions}>
                  {['Remote', 'Hybrid', 'Onsite'].map(type => (
                    <label key={type} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={selectedWorkTypes.includes(type)}
                        onChange={() => toggleFilter(type, selectedWorkTypes, setSelectedWorkTypes)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Experience Level</label>
                <div className={styles.filterOptions}>
                  {experienceLevels.map(level => (
                    <label key={level} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(level)}
                        onChange={() => toggleFilter(level, selectedExperience, setSelectedExperience)}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Employment Type</label>
                <div className={styles.filterOptions}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <label key={type} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={selectedEmploymentTypes.includes(type)}
                        onChange={() => toggleFilter(type, selectedEmploymentTypes, setSelectedEmploymentTypes)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Salary Range</label>
                <div className={styles.salarySlider}>
                  <div className={styles.salaryInputs}>
                    <input
                      type="text"
                      className={styles.salaryInput}
                      value={`₹${salaryMin.toLocaleString('en-IN')}`}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                        setSalaryMin(val);
                      }}
                    />
                    <input
                      type="text"
                      className={styles.salaryInput}
                      value={`₹${salaryMax.toLocaleString('en-IN')}`}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/\D/g, '')) || 10000000;
                        setSalaryMax(val);
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    className={styles.rangeSlider}
                    min="0"
                    max="10000000"
                    step="100000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Tech Stack</label>
                <div className={styles.techStackTags}>
                  {techStacks.slice(0, 15).map(tech => (
                    <span
                      key={tech}
                      className={`${styles.techTag} ${selectedTechStack.includes(tech) ? styles.selected : ''}`}
                      onClick={() => toggleFilter(tech, selectedTechStack, setSelectedTechStack)}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            {/* Jobs List */}
            <main className={styles.jobsContent}>
              <div className={styles.jobsHeader}>
                <p className={styles.jobsCount}>
                  <strong>{filteredJobs.length}</strong> jobs found
                </p>
                <div className={styles.sortSelect}>
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="relevant">Most Relevant</option>
                    <option value="salary">Highest Salary</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {filteredJobs.length > 0 ? (
                <div className={styles.jobsList}>
                  {filteredJobs.map(job => (
                    <Link to={`/jobs/${job._id || job.id}`} key={job._id || job.id} className={styles.jobCard}>
                      <div className={styles.companyLogo}>
                        {job.company?.name?.charAt(0) || '?'}
                      </div>
                      <div className={styles.jobInfo}>
                        <div className={styles.jobHeader}>
                          <h3 className={styles.jobTitle}>{job.title}</h3>
                          <div className={styles.jobHeaderRight}>
                            <span className={styles.postedTime}>{formatPostedDate(job.postedAt)}</span>
                            <button
                              className={`${styles.saveButton} ${savedJobs.includes(job._id || job.id) ? styles.saved : ''}`}
                              onClick={(e) => toggleSaveJob(job._id || job.id, e)}
                              aria-label={savedJobs.includes(job._id || job.id) ? 'Unsave job' : 'Save job'}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill={savedJobs.includes(job._id || job.id) ? '#ef4444' : 'none'} stroke={savedJobs.includes(job._id || job.id) ? '#ef4444' : 'currentColor'} strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className={styles.companyName}>{job.company?.name || 'Unknown Company'}</p>
                        <div className={styles.jobMeta}>
                          <span className={styles.metaItem}>
                            <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {job.location}
                          </span>
                          <span className={styles.metaItem}>
                            <Tag size="small" variant={job.workType === 'Remote' ? 'success' : 'default'}>
                              {job.workType}
                            </Tag>
                          </span>
                          <span className={styles.metaItem}>
                            {job.experienceLevel}
                          </span>
                        </div>
                        <div className={styles.salaryEquity}>
                          <span className={styles.salary}>
                            {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
                          </span>
                          {job.equity && (
                            <span className={styles.equity}>+ {job.equity} equity</span>
                          )}
                        </div>
                        <div className={styles.jobTech}>
                          {(job.techStack || []).slice(0, 4).map(tech => (
                            <Tag key={tech} size="small">{tech}</Tag>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🔍</span>
                  <h3 className={styles.emptyTitle}>No jobs found</h3>
                  <p className={styles.emptyText}>Try adjusting your filters or search terms</p>
                </div>
              )}
            </main>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;
