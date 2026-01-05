/**
 * InputField Component
 * Reusable input field with animations and validation states
 */
import { motion } from 'framer-motion';
import { useState } from 'react';

const InputField = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  label,
  error,
  icon,
  delay = 0,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Determine the actual input type (for password toggle)
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Animation variants for the input container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: delay,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-dark-300 mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon (if provided) */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3.5 
            ${icon ? 'pl-12' : 'pl-4'}
            ${type === 'password' ? 'pr-12' : 'pr-4'}
            bg-dark-800 
            border-2 rounded-xl
            text-dark-100 
            placeholder-dark-500
            transition-all duration-300
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? 'border-red-500 focus:border-red-400'
                : isFocused
                ? 'border-primary-500 shadow-glow'
                : 'border-dark-700 hover:border-dark-600'
            }
          `}
        />

        {/* Password Toggle Button */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              // Eye Off Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default InputField;
