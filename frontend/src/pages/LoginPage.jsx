/**
 * Login Page
 * Route: /login
 * Split-screen layout with social login and email/password form
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AuthLayout,
  Logo,
  InputField,
  PrimaryButton,
  SocialButton,
  Divider,
  AnimatedContainer,
} from '../components';
import { authAPI, authHelpers } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // API error state
  const [apiError, setApiError] = useState('');

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Save token and user data
      authHelpers.saveToken(response.token);
      authHelpers.saveUser(response.user);
      
      console.log('Login successful:', response.user);
      
      // Navigate to dashboard based on role
      // navigate('/dashboard');
      alert('Login successful! Welcome ' + response.user.username);
    } catch (error) {
      console.error('Login failed:', error);
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`${provider} login initiated (mock)`);
  };

  return (
    <AuthLayout variant="default">
      {/* Mobile Logo */}
      <div className="lg:hidden mb-8">
        <Logo size="default" />
      </div>

      {/* Welcome Header */}
      <AnimatedContainer delay={0.1}>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to AMDOX
        </h1>
        <p className="text-dark-400 mb-8">
          Sign in to access your account and explore opportunities
        </p>
      </AnimatedContainer>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-6">
        <SocialButton
          provider="google"
          onClick={() => handleSocialLogin('Google')}
          delay={0.2}
        />
        <SocialButton
          provider="apple"
          onClick={() => handleSocialLogin('Apple')}
          delay={0.3}
        />
      </div>

      {/* Divider */}
      <Divider text="or" delay={0.4} className="my-6" />

      {/* API Error Message */}
      {apiError && (
        <motion.div
          className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-400 text-sm text-center">{apiError}</p>
        </motion.div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
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
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />

        <InputField
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          delay={0.6}
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

        {/* Forgot Password Link */}
        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <a
            href="#"
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Forgot password?
          </a>
        </motion.div>

        {/* Submit Button */}
        <PrimaryButton
          type="submit"
          loading={isLoading}
          delay={0.8}
        >
          Continue with email
        </PrimaryButton>
      </form>

      {/* Register Links */}
      <motion.div
        className="mt-8 text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-dark-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
        <p className="text-dark-500 text-sm">
          Looking to hire?{' '}
          <Link
            to="/register-employer"
            className="text-olive-400 hover:text-olive-300 font-medium transition-colors"
          >
            Register as Job Provider
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;
