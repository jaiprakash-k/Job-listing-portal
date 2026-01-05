/**
 * SuccessCheck Component
 * Animated success checkmark for form submission
 */
import { motion } from 'framer-motion';

const SuccessCheck = ({ show, message = 'Success!' }) => {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-dark-800 rounded-2xl p-8 shadow-soft-lg border border-dark-700 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Animated Checkmark Circle */}
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              stroke="#22c55e"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.path
              d="M14 24L22 32L34 18"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            />
          </motion.svg>
        </motion.div>

        {/* Message */}
        <motion.h3
          className="text-xl font-semibold text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {message}
        </motion.h3>

        <motion.p
          className="text-dark-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Redirecting...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SuccessCheck;
