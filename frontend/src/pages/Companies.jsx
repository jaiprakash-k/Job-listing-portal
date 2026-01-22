import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Users, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { api } from '../lib/api';
import styles from './Companies.module.css';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await api.get('/companies');
                setCompanies(data);
            } catch (err) {
                console.error('Failed to fetch companies:', err);
                setError('Failed to load companies');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div style={{ padding: '50px', textAlign: 'center' }}>Loading companies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Explore Companies</h1>
                    <p className={styles.subtitle}>
                        Discover amazing companies and their open positions
                    </p>
                </div>

                <div className={styles.grid}>
                    {companies.map((company) => (
                        <Link
                            key={company._id}
                            to={`/companies/${company._id}`}
                            className={styles.card}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <Building2 size={24} className={styles.iconPrimary} />
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                                        {company.name}
                                    </h3>
                                </div>
                                {company.tagline && (
                                    <p style={{ margin: '8px 0', fontSize: '0.9rem' }} className={styles.textMuted}>
                                        {company.tagline}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                                {company.industry && (
                                    <span className={styles.badge}>
                                        {company.industry}
                                    </span>
                                )}
                                {company.location && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }} className={styles.textMuted}>
                                        <MapPin size={14} />
                                        {company.location}
                                    </span>
                                )}
                                {company.teamSize && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }} className={styles.textMuted}>
                                        <Users size={14} />
                                        {company.teamSize} employees
                                    </span>
                                )}
                            </div>

                            {company.description && (
                                <p style={{
                                    margin: '12px 0 0 0',
                                    margin: '12px 0 0 0',
                                    fontSize: '0.875rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }} className={styles.textMuted}>
                                    {company.description}
                                </p>
                            )}

                            <div className={styles.linkStart}>
                                View Company Profile
                                <ExternalLink size={14} />
                            </div>
                        </Link>
                    ))}
                </div>

                {companies.length === 0 && (
                    <div className={styles.emptyState}>
                        <Building2 size={48} className={styles.emptyIcon} />
                        <h3 style={{ margin: '0 0 8px 0' }}>No companies yet</h3>
                        <p style={{ margin: 0 }}>Check back later for company profiles</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;
