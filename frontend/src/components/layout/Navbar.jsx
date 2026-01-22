import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/CustomButton';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Define role-specific navigation
  let navLinks = [];

  if (isAuthenticated) {
    if (user?.role === 'employer') {
      navLinks = [
        { path: '/dashboard', label: 'Employer Dashboard' },
        { path: '/post-job', label: 'Post a Job' },
        // Employers don't see "Find Jobs" or "Companies" by default based on request
      ];
    } else {
      // Job Seeker
      navLinks = [
        { path: '/jobs', label: 'Find Jobs' },
        { path: '/companies', label: 'Companies' },
        { path: '/dashboard', label: 'Dashboard' },
      ];
    }
  } else {
    // Guest
    navLinks = [
      { path: '/jobs', label: 'Find Jobs' },
      { path: '/companies', label: 'Companies' },
    ];
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>J</span>
          JobConnect
        </Link>

        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.navActions}>
          {isAuthenticated ? (
            <>
              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{user?.name}</span>
              </div>
              <Button variant="ghost" size="small" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="small">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="small">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className={styles.mobileNavActions}>
          {isAuthenticated ? (
            <Button variant="ghost" onClick={logout}>Log out</Button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" fullWidth>Log in</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
