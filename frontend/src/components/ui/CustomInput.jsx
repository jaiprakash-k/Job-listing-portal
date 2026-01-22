import React from 'react';
import styles from './CustomInput.module.css';

const Input = ({
  label,
  error,
  hint,
  icon,
  required,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={inputId}
          className={`${styles.input} ${error ? styles.hasError : ''} ${icon ? styles.hasIcon : ''} ${className}`}
          required={required}
          {...props}
        />
      </div>
      {error && <span className={styles.error}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
};

export default Input;

export const Textarea = ({
  label,
  error,
  hint,
  required,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${styles.input} ${styles.textarea} ${error ? styles.hasError : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
};
