import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Users, Calendar, Globe, Linkedin, Github, Twitter, Briefcase, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/CustomButton';
import { api } from '../lib/api';
import styles from './CompanyDetail.module.css';
import CompanyProfileView from '../components/CompanyProfileView';

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
                <Link to="/companies" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to Companies
                </Link>

                <CompanyProfileView company={company} jobs={jobs} />
            </div>
        </div>
    );
};

export default CompanyDetail;
