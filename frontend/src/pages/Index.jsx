import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { jobCategories, formatSalary } from '../data/mockData';
import styles from './Index.module.css';
import { api } from '../lib/api';
import { Briefcase, Building2, Users, TrendingUp, Code, Palette, BarChart3, Shield, Zap, ArrowRight, ChevronRight } from 'lucide-react';

// Animated floating paths background
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className={styles.pathsContainer}>
      <svg
        className={styles.pathsSvg}
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Category icon mapping
const categoryIcons = {
  'Engineering': Code,
  'Design': Palette,
  'Marketing': TrendingUp,
  'Sales': BarChart3,
  'Product': Briefcase,
  'Operations': Shield,
  'Finance': BarChart3,
  'HR': Users,
};

const Index = () => {
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const [featuredCompanies, setFeaturedCompanies] = useState([]);

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

        setFeaturedCompanies(companiesData.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      }
    };

    fetchData();
  }, []);

  /* Parallax Logic */
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    currentTarget.style.setProperty("--mouse-x", `${x}px`);
    currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const heroTitle = "Find your next opportunity";
  const words = heroTitle.split(" ");

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Animated background with Parallax */}
        <motion.div
          className={styles.heroBackground}
          animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        >
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
          <div className={styles.heroGlow} />
        </motion.div>

        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={styles.heroInner}
          >
            {/* Badge */}
            <motion.div
              className={styles.heroBadge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Zap className={styles.badgeIcon} />
              <span>100% Salary Transparency</span>
            </motion.div>

            {/* Animated Title */}
            <h1 className={styles.heroTitle}>
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className={styles.word}>
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.3 + wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className={styles.letter}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Discover opportunities at companies that share salary ranges upfront,
              offer real equity, and build products that matter.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className={styles.heroCtas}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Link to="/jobs">
                <Button className={styles.primaryBtn}>
                  Find Jobs
                  <ArrowRight className={styles.btnIcon} />
                </Button>
              </Link>
              <Link to="/signup?role=employer">
                <Button variant="outline" className={styles.secondaryBtn}>
                  Post a Job
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className={styles.heroStats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
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
                <span className={styles.statLabel}>Salary visible</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Companies Marquee */}
      <section className={styles.trusted}>
        <div className={styles.container}>
          <p className={styles.trustedLabel}>Trusted by innovative teams</p>
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeGroup}>
              {featuredCompanies.concat(featuredCompanies).concat(featuredCompanies).map((company, i) => (
                <span key={`${company._id}-${i}`} className={styles.trustedLogo}>
                  {company.name}
                </span>
              ))}
            </div>
            <div className={styles.marqueeGroup} aria-hidden="true">
              {featuredCompanies.concat(featuredCompanies).concat(featuredCompanies).map((company, i) => (
                <span key={`${company._id}-${i}-duplicate`} className={styles.trustedLogo}>
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>Explore by category</h2>
            <p className={styles.sectionSubtitle}>
              Find roles that match your skills and interests
            </p>
          </motion.div>

          <div className={styles.categoryGrid}>
            {jobCategories.map((category, index) => {
              const IconComponent = categoryIcons[category.name] || Briefcase;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/jobs?category=${category.name.toLowerCase()}`}
                    className={`${styles.categoryCard} ${styles.spotlightCard}`}
                    onMouseMove={handleCardMouseMove}
                  >
                    <div className={styles.categoryIconWrapper}>
                      <IconComponent className={styles.categoryIcon} />
                    </div>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryCount}>{category.count} jobs</span>
                    <ChevronRight className={styles.categoryArrow} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>How JobConnect works</h2>
          </motion.div>

          <div className={styles.howItWorksGrid}>
            <motion.div
              className={styles.howItWorksColumn}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.columnHeader}>
                <Users className={styles.columnIcon} />
                <h3 className={styles.howItWorksLabel}>For Job Seekers</h3>
              </div>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div className={styles.stepContent}>
                    <h4>Create your profile</h4>
                    <p>Add your skills, experience, and preferences</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div className={styles.stepContent}>
                    <h4>Discover opportunities</h4>
                    <p>Filter by salary, location, remote options</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div className={styles.stepContent}>
                    <h4>Apply with confidence</h4>
                    <p>Know the salary before you apply</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.howItWorksColumn}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.columnHeader}>
                <Building2 className={styles.columnIcon} />
                <h3 className={styles.howItWorksLabel}>For Employers</h3>
              </div>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div className={styles.stepContent}>
                    <h4>Build your profile</h4>
                    <p>Showcase your culture and tech stack</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div className={styles.stepContent}>
                    <h4>Post transparent listings</h4>
                    <p>Include salary ranges and equity</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div className={styles.stepContent}>
                    <h4>Hire great talent</h4>
                    <p>Connect with motivated candidates</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Salary Transparency Section */}
      <section className={styles.transparency}>
        <div className={styles.container}>
          <motion.div
            className={styles.transparencyContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.transparencyBadge}>Salary Transparency</span>
            <h2 className={styles.transparencyTitle}>
              Every job shows the salary.
              <br />
              <span className={styles.highlight}>No exceptions.</span>
            </h2>
            <p className={styles.transparencyText}>
              We believe in transparent hiring. Every job listing on JobConnect
              includes salary ranges upfront, so you can make informed decisions
              about your career without wasting time on mismatched expectations.
            </p>
            <div className={styles.salaryExample}>
              <div className={styles.salaryCard}>
                <span className={styles.salaryLabel}>Salary Range</span>
                <span className={styles.salaryValue}>
                  {formatSalary(150000)} – {formatSalary(200000)}
                </span>
              </div>
              <div className={styles.salaryCard}>
                <span className={styles.salaryLabel}>Equity</span>
                <span className={styles.salaryValue}>0.05% – 0.15%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>Featured companies</h2>
            <p className={styles.sectionSubtitle}>
              Great places to grow your career
            </p>
          </motion.div>

          <div className={styles.companyGrid}>
            {featuredCompanies.map((company, index) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/companies/${company._id}`}
                  className={`${styles.companyCard} ${styles.spotlightCard}`}
                  onMouseMove={handleCardMouseMove}
                >
                  <div className={styles.companyLogo}>
                    {company.name.charAt(0)}
                  </div>
                  <div className={styles.companyInfo}>
                    <h3 className={styles.companyName}>{company.name}</h3>
                    <p className={styles.companyTagline}>{company.tagline}</p>
                    <div className={styles.companyMeta}>
                      <span>{company.industry}</span>
                      <span className={styles.dot}>•</span>
                      <span>{company.teamSize} people</span>
                    </div>
                  </div>
                  <div className={styles.companyTech}>
                    {Object.values(company.techStack || {}).flat().slice(0, 3).map(tech => (
                      <span key={tech} className={styles.techTag}>{tech}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.viewAll}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/companies">
              <Button variant="outline" className={styles.viewAllBtn}>
                View all companies
                <ArrowRight className={styles.btnIcon} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.ctaTitle}>Ready to find your next role?</h2>
            <p className={styles.ctaText}>
              Join thousands of professionals who've found meaningful work through JobConnect.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/signup">
                <Button className={styles.primaryBtn}>
                  Get Started
                  <ArrowRight className={styles.btnIcon} />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" className={styles.secondaryBtn}>
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
