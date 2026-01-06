/**
 * AuthLayout Component
 * Split-screen layout for authentication pages
 */
import { motion } from 'framer-motion';
import Logo from './Logo';

const AuthLayout = ({
  children,
  variant = 'default', // 'default', 'olive'
}) => {
  // Determine gradient colors based on variant
  const gradients = {
    default: 'from-primary-600 via-primary-700 to-indigo-800',
    olive: 'from-olive-500 via-olive-600 to-olive-700',
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Decorative Panel */}
      <motion.div
        className={`
          hidden lg:flex lg:w-1/2 xl:w-2/5
          bg-gradient-to-br ${gradients[variant]}
          relative overflow-hidden
          items-center justify-center
        `}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Logo size="large" className="justify-center mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Find Your Dream Job
            </h2>
            <p className="text-white/80 text-lg max-w-md">
              Connect with top employers and discover opportunities that match
              your skills and aspirations.
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="mt-12 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-16 h-1 rounded-full bg-white/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-dark-950">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
