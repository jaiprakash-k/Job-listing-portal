import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import JobSeekerDashboard from './JobSeekerDashboard';
import EmployerDashboard from './EmployerDashboard';

const Dashboard = () => {
    const { user, isLoading, isInitializing } = useAuth();

    // Wait for initial auth check before rendering
    if (isInitializing || isLoading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'employer') {
        return <EmployerDashboard />;
    }

    // Default to Job Seeker
    return <JobSeekerDashboard />;
};

export default Dashboard;
