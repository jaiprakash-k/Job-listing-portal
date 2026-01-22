import React from 'react';
import styles from './CustomTag.module.css';

const Tag = ({
  children,
  variant = 'default',
  size = 'medium',
  onRemove,
  className = '',
}) => {
  return (
    <span
      className={`${styles.tag} ${styles[variant]} ${styles[size]} ${onRemove ? styles.removable : ''} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1.5 1.5L8.5 8.5M1.5 8.5L8.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Tag;
