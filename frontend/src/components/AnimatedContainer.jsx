/**
 * AnimatedContainer Component
 * Wrapper component for page-level animations
 */
import { motion } from 'framer-motion';

const AnimatedContainer = ({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right', 'fade'
}) => {
  // Direction-based initial positions
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
    fade: { y: 0, x: 0 },
  };

  const initial = directions[direction] || directions.up;

  // Container animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      ...initial,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
