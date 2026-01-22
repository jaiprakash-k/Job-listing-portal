import React from 'react';
import styles from './CustomButton.module.css';

const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
};

export default Button;
