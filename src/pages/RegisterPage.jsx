/**
 * Register Page (Job Seeker)
 * Route: /register
 * User registration with captcha mock
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AuthLayout,
  Logo,
  InputField,
  PrimaryButton,
  Divider,
  AnimatedContainer,
  CaptchaMock,
  SuccessCheck,
} from '../components';

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Other states
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!isCaptchaVerified) {
      newErrors.captcha = 'Please complete the captcha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    return (
      formData.username.trim().length >= 3 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      isCaptchaVerified
    );
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 500);
      return;
    }

    setIsLoading(true);

    // Mock registration - simulate API call
    console.log('Registration attempt:', formData);

    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      console.log('Registration successful (mock)');

      // Redirect after showing success
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  // Handle captcha verification
  const handleCaptchaVerify = (verified) => {
    setIsCaptchaVerified(verified);
    if (errors.captcha) {
      setErrors((prev) => ({ ...prev, captcha: '' }));
    }
  };

  return (
    <>
      {/* Success Modal */}
      <SuccessCheck show={showSuccess} message="Account Created!" />

      <AuthLayout variant="default">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <Logo size="default" />
        </div>

        {/* Header */}
        <AnimatedContainer delay={0.1}>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-dark-400 mb-8">
            Join AMDOX and start your job search journey
          </p>
        </AnimatedContainer>

        {/* Registration Form */}
        <motion.form
          onSubmit={handleSubmit}
          className={`space-y-5 ${hasError ? 'animate-shake' : ''}`}
        >
          {/* Username */}
          <InputField
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            delay={0.2}
            icon={
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />

          {/* Email */}
          <InputField
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            delay={0.3}
            icon={
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />

          {/* Password */}
          <InputField
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            delay={0.4}
            icon={
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
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />

          {/* Confirm Password */}
          <InputField
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            delay={0.5}
            icon={
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
          />

          {/* Captcha Mock */}
          <CaptchaMock
            onVerify={handleCaptchaVerify}
            delay={0.6}
          />
          {errors.captcha && (
            <p className="text-sm text-red-400 -mt-3">{errors.captcha}</p>
          )}

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            loading={isLoading}
            disabled={!isFormValid()}
            delay={0.7}
          >
            Register
          </PrimaryButton>
        </motion.form>

        {/* Login Link */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-dark-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </AuthLayout>
    </>
  );
};

export default RegisterPage;
