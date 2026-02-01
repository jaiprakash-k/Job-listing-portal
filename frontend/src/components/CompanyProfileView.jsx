import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Users, Calendar, Globe, Linkedin, Github, Twitter, Edit2 } from 'lucide-react';
import Button from './ui/CustomButton';
import styles from './CompanyProfileView.module.css';

const CompanyProfileView = ({ company, jobs = [], onEdit }) => {
    if (!company) return null;

    return (
        <div className={styles.container}>
            {/* Company Header */}
            <div className={styles.card} style={{ marginBottom: '24px' }}>
                <div className={styles.companyHeader}>
                    <div className={styles.companyLogo}>
                        <Building2 size={40} />
                    </div>
                    <div className={styles.companyInfo}>
                        <h1 className={styles.companyName}>
                            {company.name}
                        </h1>
                        {company.tagline && (
                            <p className={styles.companyTagline}>
                                {company.tagline}
                            </p>
                        )}
                        <div className={styles.companyMeta}>
                            {company.industry && (
                                <span className={styles.metaItem}>
                                    <Building2 size={16} />
                                    {company.industry}
                                </span>
                            )}
                            {company.location && (
                                <span className={styles.metaItem}>
                                    <MapPin size={16} />
                                    {company.location}
                                </span>
                            )}
                            {(company.teamSize || company.engineeringSize) && (
                                <span className={styles.metaItem}>
                                    <Users size={16} />
                                    {company.teamSize || company.engineeringSize} employees
                                </span>
                            )}
                            {company.founded && (
                                <span className={styles.metaItem}>
                                    <Calendar size={16} />
                                    Founded {company.founded}
                                </span>
                            )}
                        </div>
                    </div>
                    {onEdit && (
                        <div className={styles.editButtonWrapper}>
                            <Button variant="outline" onClick={onEdit}>
                                <Edit2 size={16} style={{ marginRight: '8px' }} />
                                Edit Profile
                            </Button>
                        </div>
                    )}
                </div>

                {/* Social Links */}
                {(company.website || company.linkedIn || company.github || company.twitter) && (
                    <div className={styles.socialLinks}>
                        {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <Globe size={16} />
                                Website
                            </a>
                        )}
                        {company.linkedIn && (
                            <a href={company.linkedIn} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <Linkedin size={16} />
                                LinkedIn
                            </a>
                        )}
                        {company.github && (
                            <a href={company.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <Github size={16} />
                                GitHub
                            </a>
                        )}
                        {company.twitter && (
                            <a href={company.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
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
                    <h2 className={styles.sectionTitle}>About</h2>
                    <p className={styles.sectionContent} style={{ whiteSpace: 'pre-wrap' }}>
                        {company.description}
                    </p>
                </div>
            )}

            {/* Mission */}
            {company.mission && (
                <div className={styles.card} style={{ marginBottom: '24px' }}>
                    <h2 className={styles.sectionTitle}>Mission</h2>
                    <p className={`${styles.sectionContent} ${styles.missionText}`}>
                        "{company.mission}"
                    </p>
                </div>
            )}

            {/* Values */}
            {company.values && company.values.length > 0 && (
                <div className={styles.card} style={{ marginBottom: '24px' }}>
                    <h2 className={styles.sectionTitle}>Our Values</h2>
                    <div className={styles.valuesGrid}>
                        {company.values.map((value, index) => (
                            <div key={index} className={styles.valueCard}>
                                <h3 className={styles.valueName}>
                                    {value.name}
                                </h3>
                                {value.description && (
                                    <p className={styles.valueDescription}>
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
                    <h2 className={styles.sectionTitle}>Tech Stack</h2>
                    <div className={styles.techStackGrid}>
                        {Object.entries(company.techStack).map(([category, techs]) =>
                            techs && techs.length > 0 && (
                                <div key={category}>
                                    <h3 className={styles.techCategory}>
                                        {category}
                                    </h3>
                                    <div className={styles.tagList}>
                                        {techs.map((tech, i) => (
                                            <span key={i} className={styles.techTag}>
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
            {company.benefits && Object.values(company.benefits).some(b => b && b.length > 0) && (
                <div className={styles.card} style={{ marginBottom: '24px' }}>
                    <h2 className={styles.sectionTitle}>Benefits & Perks</h2>
                    <div className={styles.techStackGrid}>
                        {Object.entries(company.benefits).map(([category, benefits]) =>
                            benefits && benefits.length > 0 && (
                                <div key={category}>
                                    <h3 className={styles.techCategory}>
                                        {category.replace(/([A-Z])/g, ' $1').trim()}
                                    </h3>
                                    <div className={styles.tagList}>
                                        {benefits.map((benefit, i) => (
                                            <span key={i} className={styles.benefitTag}>
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

            {/* Team Details */}
            {(company.engineeringSize || company.productSize || company.remotePercentage) && (
                <div className={styles.card} style={{ marginBottom: '24px' }}>
                    <h2 className={styles.sectionTitle}>Team Details</h2>
                    <div className={styles.companyMeta} style={{ marginTop: '16px' }}>
                        {company.engineeringSize && (
                            <div className={styles.metaItem}>
                                <Users size={16} />
                                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{company.engineeringSize}</span>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Engineers</span>
                            </div>
                        )}
                        {company.productSize && (
                            <div className={styles.metaItem}>
                                <Users size={16} />
                                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{company.productSize}</span>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Product</span>
                            </div>
                        )}
                        {company.remotePercentage !== undefined && company.remotePercentage !== null && (
                            <div className={styles.metaItem}>
                                <Globe size={16} />
                                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{company.remotePercentage}%</span>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Remote</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Open Positions - Only show if there are jobs or if explicitly passed an empty array (meaning we should show the section) */}
            {jobs !== undefined && (
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Open Positions ({jobs.length})
                    </h2>
                    {jobs.length > 0 ? (
                        <div className={styles.jobsList}>
                            {jobs.map(job => (
                                <Link
                                    key={job._id || job.id}
                                    to={`/jobs/${job._id || job.id}`}
                                    className={styles.jobCard}
                                >
                                    <div className={styles.jobInfo}>
                                        <h3 className={styles.jobTitle}>
                                            {job.title}
                                        </h3>
                                        <div className={styles.jobMeta}>
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
                        <p className={styles.emptyJobs}>
                            No open positions at the moment
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompanyProfileView;


