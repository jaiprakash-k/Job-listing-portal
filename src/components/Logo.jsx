/**
 * Logo Component
 * Displays the AMDOX brand logo with optional size variants
 */
import { motion } from 'framer-motion';

const Logo = ({ size = 'default', className = '' }) => {
  // Size variants for the logo
  const sizes = {
    small: { width: 32, height: 32, text: 'text-lg' },
    default: { width: 40, height: 40, text: 'text-xl' },
    large: { width: 56, height: 56, text: 'text-2xl' },
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Icon */}
      <div
        className="rounded-xl gradient-primary flex items-center justify-center shadow-glow"
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg
          width={currentSize.width * 0.5}
          height={currentSize.height * 0.5}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 16L10 4L18 16H14L10 9L6 16H2Z"
            fill="white"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      <span className={`font-bold ${currentSize.text} text-white tracking-wide`}>
        AMDOX
      </span>
    </motion.div>
  );
};

export default Logo;
