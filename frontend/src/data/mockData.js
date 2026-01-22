// Static configuration data and utility functions
// Simulated data has been removed.

export const jobCategories = [
  { id: 'eng', name: 'Engineering', icon: 'Code' },
  { id: 'des', name: 'Design', icon: 'PenTool' },
  { id: 'prod', name: 'Product', icon: 'Layout' },
  { id: 'mkt', name: 'Marketing', icon: 'Megaphone' },
  { id: 'sales', name: 'Sales', icon: 'Briefcase' },
  { id: 'ops', name: 'Operations', icon: 'Settings' },
];

export const techStacks = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go',
  'AWS', 'Docker', 'Kubernetes', 'Svelte', 'TypeScript', 'Rust',
  'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Next.js'
];

export const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];

export const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

// Formats a number as a currency string (e.g., ₹12,00,000)
export const formatSalary = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formats a date string as "2 days ago", "1 week ago", etc.
export const formatPostedDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  return date.toLocaleDateString();
};

export const getProfileCompleteness = (profile) => {
  if (!profile) return 0;

  const weights = {
    basicInfo: 20,
    summary: 15,
    skills: 15,
    experience: 25,
    education: 15,
    resume: 10
  };

  let score = 0;

  // Basic Info check (fullName, email, phone, location) - 20%
  let basicInfoCount = 0;
  if (profile.fullName) basicInfoCount++;
  if (profile.email) basicInfoCount++;
  if (profile.phone) basicInfoCount++;
  if (profile.location) basicInfoCount++;
  score += (basicInfoCount / 4) * weights.basicInfo;

  // Summary - 15%
  if (profile.summary && profile.summary.length > 10) score += weights.summary;

  // Skills - 15%
  if (profile.skills && profile.skills.length > 0) score += weights.skills;

  // Experience - 25%
  if (profile.experience && profile.experience.length > 0) score += weights.experience;

  // Education - 15%
  if (profile.education && profile.education.length > 0) score += weights.education;

  // Resume - 10%
  if (profile.resumeUrl) score += weights.resume;

  return Math.round(score);
};
