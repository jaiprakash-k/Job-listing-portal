/**
 * Divider Component
 * Horizontal divider with optional text
 */
import { motion } from 'framer-motion';

const Divider = ({ text, delay = 0, className = '' }) => {
  return (
    <motion.div
      className={`flex items-center gap-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex-1 h-px bg-dark-700" />
      {text && (
        <span className="text-dark-500 text-sm font-medium">{text}</span>
      )}
      <div className="flex-1 h-px bg-dark-700" />
    </motion.div>
  );
};

export default Divider;
