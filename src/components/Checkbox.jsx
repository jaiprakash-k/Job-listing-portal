/**
 * Checkbox Component
 * Custom styled checkbox with animation
 */
import { motion } from 'framer-motion';

const Checkbox = ({
  checked,
  onChange,
  label,
  name,
  error,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      className={`flex items-start gap-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <label className="flex items-start gap-3 cursor-pointer group">
        {/* Custom Checkbox */}
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded-md border-2 
              transition-all duration-200
              flex items-center justify-center
              ${
                checked
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-dark-800 border-dark-600 group-hover:border-dark-500'
              }
              ${error ? 'border-red-500' : ''}
            `}
          >
            {/* Checkmark */}
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: checked ? 1 : 0,
                opacity: checked ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        </div>

        {/* Label */}
        <span className="text-sm text-dark-300 leading-relaxed">{label}</span>
      </label>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Checkbox;
