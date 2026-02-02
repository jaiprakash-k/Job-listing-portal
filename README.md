# JobConnect 💼

**A modern, full-featured job portal connecting talent with opportunities.**

JobConnect is built with the MERN stack (MongoDB, Express, React, Node.js) and offers a sophisticated user experience with dark/light theming, role-based dashboards, and intuitive workflow management for both job seekers and employers.

---

## ✨ Features

### 🎨 Premium User Interface
- **Sophisticated Design**: Dark-themed UI with warm amber accents, glassmorphism effects, and smooth transitions
- **Advanced Theme Toggle**: Day/Night mode with animated sun/moon, clouds, and stars with persistent state
- **Interactive Components**: Custom animations including expanding logout button and hover effects
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Separate portals for Job Seekers and Employers
- **Protected Routes**: Middleware-protected API endpoints
- **Profile Management**: Customizable user profiles and account settings

### 💼 Job Seeker Portal

**Smart Dashboard**
- Overview of applied jobs and application statuses
- Saved jobs collection
- Quick access to recent applications

**Advanced Job Search**
- Filter by job type, location, experience level, and salary range
- Real-time search results
- Sort by relevance, date, or salary

**Job Discovery**
- Detailed job descriptions with company insights
- One-click application process
- Save jobs for later review
- Company directory with open positions

### 🏢 Employer Portal

**Command Center Dashboard**
- Real-time metrics on active jobs
- Total candidate count and application analytics
- Job posting performance tracking

**Kanban Applicant Tracking System (ATS)**
- Drag-and-drop candidate management
- Stage progression: Applied → Shortlisted → Interview → Offer/Reject
- Visual pipeline for hiring workflow
- Candidate status tracking

**Job Management**
- Create, edit, and delete job postings
- Rich text editor for job requirements
- Job status controls (Active/Inactive)
- Duplicate job postings for efficiency

**Company Profile**
- Comprehensive company branding
- Tech stack showcase
- Benefits and values presentation
- Team size and culture details

**Candidate Management**
- Detailed applicant profiles
- Resume viewing and download
- Contact information access
- Application history tracking

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React (Vite)** | Fast, modern frontend framework |
| **React Router v6** | Client-side routing |
| **CSS Modules** | Scoped styling |
| **Lucide React** | Beautiful icon library |
| **Context API** | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | Authentication tokens |
| **Multer** | File upload handling |

---

## 📁 Project Structure

```
JOB-FINDER/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema (Job Seeker/Employer)
│   │   ├── Job.js               # Job posting schema
│   │   ├── Company.js           # Company profile schema
│   │   └── Application.js       # Job application schema
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── jobs.js              # Job CRUD operations
│   │   ├── applications.js      # Application management
│   │   └── companies.js         # Company profile endpoints
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── upload.js            # File upload handling
│   ├── uploads/                 # Uploaded files (resumes, logos)
│   ├── .env                     # Environment variables
│   ├── server.js                # Application entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   ├── JobCard.jsx      # Job listing card
│   │   │   ├── Button.jsx       # Reusable button component
│   │   │   ├── Input.jsx        # Form input component
│   │   │   └── ThemeToggle.jsx  # Day/Night mode toggle
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   └── ThemeContext.jsx # Theme state
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Signup.jsx       # Registration page
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Jobs.jsx         # Job listings
│   │   │   ├── JobDetail.jsx    # Single job view
│   │   │   ├── Companies.jsx    # Company directory
│   │   │   ├── ATS.jsx          # Kanban board (Employer)
│   │   │   └── Profile.jsx      # User/Company profile
│   │   ├── styles/
│   │   │   ├── global.css       # Global styles
│   │   │   └── variables.css    # CSS variables
│   │   ├── App.jsx              # Root component
│   │   └── main.jsx             # Application entry
│   ├── vite.config.js
│   └── package.json
│
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v14 or higher
- **MongoDB** (Local installation or Atlas URI)
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/jaiprakash-k/Job-listing-portal.git
cd Job-listing-portal
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env
```

Add the following to `.env`:
```env
# Database
MONGO_URI=mongodb://localhost:27017/jobconnect
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobconnect

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5000
NODE_ENV=development

# File Upload (Optional)
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

```bash
# Start the backend server
npx nodemon server.js
# Or for production:
# node server.js
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

#### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🎯 Usage Guide

### For Job Seekers

1. **Sign Up** as a Job Seeker
2. **Complete Profile** with resume and skills
3. **Browse Jobs** using filters and search
4. **Apply** to positions with one click
5. **Track Applications** in your dashboard
6. **Save Jobs** for later review

### For Employers

1. **Sign Up** as an Employer
2. **Create Company Profile** with branding
3. **Post Jobs** with detailed requirements
4. **Review Applications** in the ATS Kanban board
5. **Manage Candidates** through hiring stages
6. **Track Metrics** in the dashboard

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/auth/me` | Get current user |
| `PUT` | `/api/auth/profile` | Update profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List all jobs (with filters) |
| `GET` | `/api/jobs/:id` | Get job details |
| `POST` | `/api/jobs` | Create job (Employer only) |
| `PUT` | `/api/jobs/:id` | Update job (Employer only) |
| `DELETE` | `/api/jobs/:id` | Delete job (Employer only) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/applications` | List user's applications |
| `POST` | `/api/applications` | Apply to job |
| `PUT` | `/api/applications/:id` | Update application status |
| `DELETE` | `/api/applications/:id` | Withdraw application |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/companies` | List all companies |
| `GET` | `/api/companies/:id` | Get company details |
| `PUT` | `/api/companies/:id` | Update company profile |

---

## 🎨 Theme Customization

The application uses CSS variables for easy theming. Edit `frontend/src/styles/variables.css`:

```css
:root {
  /* Dark Theme (Default) */
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --accent: #f59e0b;  /* Amber */
  --text-primary: #ffffff;
  --text-secondary: #a3a3a3;
}

[data-theme="light"] {
  /* Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --accent: #f59e0b;
  --text-primary: #0f0f0f;
  --text-secondary: #525252;
}
```

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
```bash
# Check if MongoDB is running
mongod --version

# Or verify Atlas connection string
# Ensure IP whitelist includes your IP
```

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### Frontend Issues

**Dependencies Not Installing:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Vite Build Errors:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**CORS Errors:**
Ensure backend `server.js` has CORS configured:
```javascript
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));
```

---

## 🧪 Testing

```bash
# Backend tests (if configured)
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

---

## 🚀 Deployment

### Backend (Heroku)
```bash
cd backend
heroku create jobconnect-api
heroku config:set MONGO_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Or use Netlify, GitHub Pages, or any static hosting service.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **MongoDB** for the powerful database
- **Lucide Icons** for beautiful icons
- **Vite** for lightning-fast development

---

## 📞 Support

Need help? Reach out!

- **📧 Email**: support@jobconnect.com
- **🐛 Issues**: [GitHub Issues](https://github.com/jaiprakash-k/Job-listing-portal/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/jaiprakash-k/Job-listing-portal/discussions)

---

**Built with ❤️ to connect talent with opportunity.**

*Star ⭐ this repo if JobConnect helps you find your next great hire or job!*
