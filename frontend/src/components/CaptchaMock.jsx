/**
 * CaptchaMock Component
 * Simple mock captcha with 3 clickable circles
 */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const CaptchaMock = ({ onVerify, delay = 0, className = '' }) => {
  const [selectedCircles, setSelectedCircles] = useState([]);
  const [requiredCircle, setRequiredCircle] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  // Colors for the circles
  const circleColors = ['#8b5cf6', '#6366f1', '#a855f7'];
  const colorNames = ['Purple', 'Indigo', 'Violet'];

  // Set a random required circle on mount
  useEffect(() => {
    setRequiredCircle(Math.floor(Math.random() * 3));
  }, []);

  // Handle circle click
  const handleCircleClick = (index) => {
    if (isVerified) return;

    if (selectedCircles.includes(index)) {
      setSelectedCircles(selectedCircles.filter((i) => i !== index));
    } else {
      const newSelected = [...selectedCircles, index];
      setSelectedCircles(newSelected);

      // Check if the required circle was clicked
      if (index === requiredCircle) {
        setIsVerified(true);
        if (onVerify) onVerify(true);
      }
    }
  };

  return (
    <motion.div
      className={`bg-dark-800 rounded-xl p-5 border border-dark-700 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Instructions */}
      <p className="text-sm text-dark-300 mb-4 text-center">
        {isVerified ? (
          <span className="text-green-400 flex items-center justify-center gap-2">
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <circle cx="10" cy="10" r="9" fill="#22c55e" />
              <path
                d="M6 10L9 13L14 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            Verified!
          </span>
        ) : (
          <>
            Click the <strong className="text-primary-400">{colorNames[requiredCircle]}</strong> circle
          </>
        )}
      </p>

      {/* Circles */}
      <div className="flex justify-center gap-6">
        {circleColors.map((color, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleCircleClick(index)}
            className={`
              w-14 h-14 rounded-full
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-800
              ${
                selectedCircles.includes(index)
                  ? 'ring-2 ring-white scale-110'
                  : ''
              }
              ${isVerified && index === requiredCircle ? 'ring-4 ring-green-500' : ''}
            `}
            style={{ backgroundColor: color }}
            whileHover={{ scale: isVerified ? 1 : 1.1 }}
            whileTap={{ scale: isVerified ? 1 : 0.95 }}
            disabled={isVerified}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CaptchaMock;
