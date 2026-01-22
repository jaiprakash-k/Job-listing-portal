import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Users, Calendar, Globe, Linkedin, Github, Twitter, Briefcase, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/CustomButton';
import { api } from '../lib/api';
import styles from './CompanyDetail.module.css';

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const [companyData, allJobs] = await Promise.all([
                    api.get(`/companies/${id}`),
                    api.get('/jobs')
                ]);

                setCompany(companyData);

                // Filter jobs for this company
                const companyJobs = allJobs.filter(job =>
                    job.companyId === id ||
                    job.company?._id === id ||
                    job.company?.id === id
                );
                setJobs(companyJobs);
            } catch (err) {
                console.error('Failed to fetch company:', err);
                setError('Failed to load company details');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div style={{ padding: '50px', textAlign: 'center' }}>Loading company...</div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
                    {error || 'Company not found'}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                <Link to="/companies" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#3b82f6', textDecoration: 'none' }}>
                    <ArrowLeft size={16} />
                    Back to Companies
                </Link>

                {/* Company Header */}
                <div className={styles.card} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '24px', marginBottom: '24px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '12px',
                            backgroundColor: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Building2 size={40} color="#3b82f6" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 700 }}>
                                {company.name}
                            </h1>
                            {company.tagline && (
                                <p style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#64748b' }}>
                                    {company.tagline}
                                </p>
                            )}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                {company.industry && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569' }}>
                                        <Building2 size={16} />
                                        {company.industry}
                                    </span>
                                )}
                                {company.location && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569' }}>
                                        <MapPin size={16} />
                                        {company.location}
                                    </span>
                                )}
                                {company.teamSize && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569' }}>
                                        <Users size={16} />
                                        {company.teamSize} employees
                                    </span>
                                )}
                                {company.founded && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569' }}>
                                        <Calendar size={16} />
                                        Founded {company.founded}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    {(company.website || company.linkedIn || company.github || company.twitter) && (
                        <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', textDecoration: 'none' }}>
                                    <Globe size={16} />
                                    Website
                                </a>
                            )}
                            {company.linkedIn && (
                                <a href={company.linkedIn} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', textDecoration: 'none' }}>
                                    <Linkedin size={16} />
                                    LinkedIn
                                </a>
                            )}
                            {company.github && (
                                <a href={company.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', textDecoration: 'none' }}>
                                    <Github size={16} />
                                    GitHub
                                </a>
                            )}
                            {company.twitter && (
                                <a href={company.twitter} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', textDecoration: 'none' }}>
                                    <Twitter size={16} />
                                    X
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* About */}
                {company.description && (
                    <div className={styles.card} style={{ marginBottom: '24px' }}>
                        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', fontWeight: 600 }}>About</h2>
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {company.description}
                        </p>
                    </div>
                )}

                {/* Mission */}
                {company.mission && (
                    <div className={styles.card} style={{ marginBottom: '24px' }}>
                        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', fontWeight: 600 }}>Mission</h2>
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.7, fontStyle: 'italic' }}>
                            "{company.mission}"
                        </p>
                    </div>
                )}

                {/* Values */}
                {company.values && company.values.length > 0 && (
                    <div className={styles.card} style={{ marginBottom: '24px' }}>
                        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', fontWeight: 600 }}>Our Values</h2>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {company.values.map((value, index) => (
                                <div key={index} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>
                                        {value.name}
                                    </h3>
                                    {value.description && (
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                                            {value.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tech Stack */}
                {company.techStack && Object.keys(company.techStack).some(key => company.techStack[key]?.length > 0) && (
                    <div className={styles.card} style={{ marginBottom: '24px' }}>
                        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', fontWeight: 600 }}>Tech Stack</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.entries(company.techStack).map(([category, techs]) =>
                                techs && techs.length > 0 && (
                                    <div key={category}>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize', color: '#64748b' }}>
                                            {category}
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {techs.map((tech, i) => (
                                                <span key={i} style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#eff6ff',
                                                    color: '#1d4ed8',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500
                                                }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Benefits */}
                {company.benefits && Object.keys(company.benefits).some(key => company.benefits[key]?.length > 0) && (
                    <div className={styles.card} style={{ marginBottom: '24px' }}>
                        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', fontWeight: 600 }}>Benefits & Perks</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.entries(company.benefits).map(([category, benefits]) =>
                                benefits && benefits.length > 0 && (
                                    <div key={category}>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize', color: '#64748b' }}>
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {benefits.map((benefit, i) => (
                                                <span key={i} style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#f0fdf4',
                                                    color: '#15803d',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500
                                                }}>
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Open Positions */}
                <div className={styles.card}>
                    <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', fontWeight: 600 }}>
                        Open Positions ({jobs.length})
                    </h2>
                    {jobs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {jobs.map(job => (
                                <Link
                                    key={job._id}
                                    to={`/jobs/${job._id}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                >
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 600 }}>
                                            {job.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.875rem', color: '#64748b' }}>
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span>{job.workType}</span>
                                            <span>•</span>
                                            <span>{job.employmentType}</span>
                                        </div>
                                    </div>
                                    <Button variant="primary" size="small">
                                        View Job
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={{ margin: 0, color: '#64748b', textAlign: 'center', padding: '32px' }}>
                            No open positions at the moment
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
