/**
 * PrimaryButton Component
 * Main action button with hover effects and ripple animation
 */
import { motion } from 'framer-motion';
import { useState } from 'react';

const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary', // 'primary', 'secondary', 'olive'
  fullWidth = true,
  className = '',
  delay = 0,
}) => {
  const [ripples, setRipples] = useState([]);

  // Variant styles
  const variants = {
    primary: `
      gradient-primary text-white
      hover:shadow-glow
      disabled:from-dark-600 disabled:to-dark-600
    `,
    secondary: `
      bg-dark-700 text-dark-100
      hover:bg-dark-600
      border border-dark-600
    `,
    olive: `
      gradient-olive text-dark-900
      hover:shadow-glow-gold
    `,
  };

  // Handle ripple effect on click
  const handleClick = (e) => {
    if (disabled || loading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, ripple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        ${fullWidth ? 'w-full' : 'w-auto'}
        px-6 py-3.5
        rounded-xl
        font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900
        ${variant === 'primary' ? 'focus:ring-primary-500' : ''}
        ${variant === 'olive' ? 'focus:ring-olive-500' : ''}
        ${variants[variant]}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default PrimaryButton;
