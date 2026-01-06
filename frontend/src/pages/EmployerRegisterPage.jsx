/**
 * Employer Registration Page
 * Route: /register-employer
 * Full-width two-column form for job providers
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Logo,
  InputField,
  PrimaryButton,
  Checkbox,
  AnimatedContainer,
  SuccessCheck,
} from '../components';
import { authAPI, authHelpers } from '../services/api';

// Indian states for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

const EmployerRegisterPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyEmail: '',
    password: '',
    state: '',
    city: '',
    address: '',
    phone: '',
    termsAccepted: false,
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Other states
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
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
      const response = await authAPI.registerEmployer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyEmail: formData.companyEmail,
        password: formData.password,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        termsAccepted: formData.termsAccepted,
      });
      
      // Save token and user data
      authHelpers.saveToken(response.token);
      authHelpers.saveUser(response.user);
      
      console.log('Employer registration successful:', response.user);
      setShowSuccess(true);

      // Redirect after showing success
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Employer registration failed:', error);
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stagger animation for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <>
      {/* Success Modal */}
      <SuccessCheck show={showSuccess} message="Account Created!" />

      <div className="min-h-screen bg-gradient-to-br from-olive-900 via-dark-900 to-dark-950">
        {/* Header */}
        <header className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo size="default" />
            <Link
              to="/login"
              className="text-olive-300 hover:text-olive-200 font-medium transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <AnimatedContainer delay={0.1} className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white mb-3">
                Register as Job Provider
              </h1>
              <p className="text-olive-300 text-lg">
                Create your employer account and start hiring the best talent
              </p>
            </AnimatedContainer>

            {/* API Error Message */}
            {apiError && (
              <motion.div
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-w-4xl mx-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-red-400 text-sm text-center">{apiError}</p>
              </motion.div>
            )}

            {/* Registration Form */}
            <motion.div
              className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-dark-700/50 shadow-soft-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.form
                onSubmit={handleSubmit}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <motion.div variants={itemVariants}>
                    <InputField
                      type="text"
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      required
                    />
                  </motion.div>

                  {/* Last Name */}
                  <motion.div variants={itemVariants}>
                    <InputField
                      type="text"
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      required
                    />
                  </motion.div>

                  {/* Company Email */}
                  <motion.div variants={itemVariants}>
                    <InputField
                      type="email"
                      name="companyEmail"
                      label="Company Email ID"
                      placeholder="Enter your company email"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      error={errors.companyEmail}
                      required
                    />
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={itemVariants}>
                    <InputField
                      type="password"
                      name="password"
                      label="Password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      required
                    />
                  </motion.div>

                  {/* State Dropdown */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      State <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3.5
                        bg-dark-800
                        border-2 rounded-xl
                        text-dark-100
                        transition-all duration-300
                        focus:outline-none focus:border-olive-500 focus:shadow-glow-gold
                        ${errors.state ? 'border-red-500' : 'border-dark-700 hover:border-dark-600'}
                      `}
                    >
                      <option value="">Select your state</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-2 text-sm text-red-400">{errors.state}</p>
                    )}
                  </motion.div>

                  {/* City */}
                  <motion.div variants={itemVariants}>
                    <InputField
                      type="text"
                      name="city"
                      label="City"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      required
                    />
                  </motion.div>

                  {/* Address - Full Width */}
                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <InputField
                      type="text"
                      name="address"
                      label="Address"
                      placeholder="Enter your company address"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                      required
                    />
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <InputField
                      type="tel"
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      required
                    />
                  </motion.div>
                </div>

                {/* Terms and Conditions */}
                <motion.div variants={itemVariants} className="mt-8">
                  <Checkbox
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    error={errors.termsAccepted}
                    label={
                      <>
                        I agree to the{' '}
                        <a href="#" className="text-olive-400 hover:text-olive-300 underline">
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-olive-400 hover:text-olive-300 underline">
                          Privacy Policy
                        </a>
                      </>
                    }
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="mt-8">
                  <PrimaryButton
                    type="submit"
                    variant="olive"
                    loading={isLoading}
                  >
                    Register as Job Provider
                  </PrimaryButton>
                </motion.div>
              </motion.form>
            </motion.div>

            {/* Already have account */}
            <motion.p
              className="text-center mt-8 text-dark-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Already have an employer account?{' '}
              <Link
                to="/login"
                className="text-olive-400 hover:text-olive-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </motion.p>
          </div>
        </main>
      </div>
    </>
  );
};

export default EmployerRegisterPage;
