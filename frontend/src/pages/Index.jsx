import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/CustomButton';
import Tag from '../components/ui/CustomTag';
import { jobCategories, formatSalary } from '../data/mockData';
import styles from './Index.module.css';
import { api } from '../lib/api';

const Index = () => {
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const [featuredCompanies, setFeaturedCompanies] = useState([]);

  // Use mock data for categories as these are static
  // const [categories] = useState(jobCategories);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, companiesData] = await Promise.all([
          api.get('/jobs'),
          api.get('/companies')
        ]);

        setStats({
          jobs: jobsData.length,
          companies: companiesData.length
        });

        setFeaturedCompanies(companiesData.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find work that values<br />
            <span className={styles.heroHighlight}>transparency</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover opportunities at companies that share salary ranges upfront,
            offer real equity, and build products that matter.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/jobs">
              <Button size="large">Find Jobs</Button>
            </Link>
            <Link to="/signup?role=employer">
              <Button variant="secondary" size="large">Post Jobs</Button>
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{stats.jobs}+</span>
              <span className={styles.statLabel}>Open positions</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>{stats.companies}+</span>
              <span className={styles.statLabel}>Companies hiring</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Salary visibility</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className={styles.trusted}>
        <div className={styles.container}>
          <p className={styles.trustedLabel}>Trusted by innovative teams</p>
          <div className={styles.trustedLogos}>
            {featuredCompanies.map(company => (
              <span key={company._id} className={styles.trustedLogo}>
                {company.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Explore by category</h2>
          <p className={styles.sectionSubtitle}>
            Find roles that match your skills and interests
          </p>
          <div className={styles.categoryGrid}>
            {jobCategories.map(category => (
              <Link
                to={`/jobs?category=${category.name.toLowerCase()}`}
                key={category.id}
                className={styles.categoryCard}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categoryCount}>{category.count} jobs</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How JobConnect works</h2>
          <div className={styles.howItWorksGrid}>
            <div className={styles.howItWorksColumn}>
              <h3 className={styles.howItWorksLabel}>For Job Seekers</h3>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div>
                    <h4>Create your profile</h4>
                    <p>Add your skills, experience, and preferences</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div>
                    <h4>Discover opportunities</h4>
                    <p>Filter by salary, location, remote options</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div>
                    <h4>Apply with confidence</h4>
                    <p>Know the salary before you apply</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.howItWorksColumn}>
              <h3 className={styles.howItWorksLabel}>For Employers</h3>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div>
                    <h4>Build your profile</h4>
                    <p>Showcase your culture and tech stack</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div>
                    <h4>Post transparent listings</h4>
                    <p>Include salary ranges and equity</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div>
                    <h4>Hire great talent</h4>
                    <p>Connect with motivated candidates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Salary Transparency */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <div className={styles.transparencyContent}>
            <Tag variant="primary" size="large">Salary Transparency</Tag>
            <h2 className={styles.transparencyTitle}>
              Every job shows the salary. No exceptions.
            </h2>
            <p className={styles.transparencyText}>
              We believe in transparent hiring. Every job listing on JobConnect
              includes salary ranges upfront, so you can make informed decisions
              about your career without wasting time on mismatched expectations.
            </p>
            <div className={styles.salaryExample}>
              <div className={styles.salaryRange}>
                <span className={styles.salaryLabel}>Salary Range</span>
                <span className={styles.salaryValue}>
                  {formatSalary(150000)} – {formatSalary(200000)}
                </span>
              </div>
              <div className={styles.equityRange}>
                <span className={styles.salaryLabel}>Equity</span>
                <span className={styles.salaryValue}>0.05% – 0.15%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured companies</h2>
          <p className={styles.sectionSubtitle}>
            Great places to grow your career
          </p>
          <div className={styles.companyGrid}>
            {featuredCompanies.map(company => (
              <Link
                to={`/companies/${company._id}`}
                key={company._id}
                className={styles.companyCard}
              >
                <div className={styles.companyLogo}>
                  {company.name.charAt(0)}
                </div>
                <h3 className={styles.companyName}>{company.name}</h3>
                <p className={styles.companyTagline}>{company.tagline}</p>
                <div className={styles.companyMeta}>
                  <span>{company.industry}</span>
                  <span>•</span>
                  <span>{company.teamSize} people</span>
                </div>
                <div className={styles.companyTech}>
                  {/* Handle techStack Map or Object conversion */}
                  {Object.values(company.techStack || {}).flat().slice(0, 3).map(tech => (
                    <Tag key={tech} size="small">{tech}</Tag>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link to="/companies">
              <Button variant="outline">View all companies</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
