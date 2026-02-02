# JobConnect 💼

**A modern, full-featured job portal connecting talent with opportunities.**

JobConnect is built with the MERN stack (MongoDB, Express, React, Node.js) and offers a sophisticated user experience with dark/light theming, role-based dashboards, and intuitive workflow management for both job seekers and employers.

---

## ✨ Features

### 🎨 User Interface & Experience

**Sophisticated Design System**
- Premium dark-themed UI (default) with warm amber accents
- Glassmorphism effects and smooth transitions throughout
- Fully responsive layout for desktop, tablet, and mobile devices

**Advanced Theme Toggle**
- Day/Night mode switching with complex animations
- Animated sun/moon, clouds, and stars transitions
- Persistent theme state across sessions

**Interactive Components**
- Custom expanding logout button with animations
- Rich hover effects and micro-interactions
- Smooth page transitions

### 🔐 Authentication & Roles

**Secure Authentication**
- JWT-based authentication system
- Login and signup flows
- Protected routes and sessions

**Role-Based Access Control (RBAC)**
- Distinct portals for Job Seekers and Employers
- Role-specific dashboards and features
- Customizable user profiles and account settings

### 💼 Job Seeker Features

**Smart Dashboard**
- Overview of all applied jobs
- Saved jobs collection
- Real-time application status tracking

**Advanced Job Search & Discovery**
- Filter jobs by type, location, experience level, and salary range
- Comprehensive job search functionality
- Detailed job views with rich descriptions and company insights

**Application Management**
- One-click application process
- Track application progress
- Save jobs for later review

**Company Exploration**
- Browse company directory
- View company profiles and open positions
- Research potential employers

### 🏢 Employer Features

**Command Center Dashboard**
- Real-time metrics on active job postings
- Total candidates and application analytics
- Job posting performance tracking with view counts

**Kanban Applicant Tracking System (ATS)**
- Visual drag-and-drop board for candidate management
- Multi-stage hiring pipeline: Applied → Shortlisted → Interview → Offer/Reject
- Streamlined workflow for moving candidates through stages
- Real-time status updates

**Job Management**
- Create new job postings with rich text editor
- Edit existing job listings
- Delete outdated positions
- Manage job requirements and descriptions

**Company Profile Management**
- Comprehensive company branding tools
- Showcase tech stack and technologies used
- Highlight company benefits and perks
- Display company values and culture
- Team size and organizational details

**Candidate Review**
- Detailed applicant profile views
- Access to candidate resumes
- Contact information for shortlisted candidates
- Application history and notes

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React (Vite)** | Modern frontend framework with fast build tooling |
| **React Router v6** | Client-side routing and navigation |
| **CSS Modules** | Scoped component styling |
| **Lucide React** | Beautiful icon system |
| **Context API** | Global state management for Auth and Theme |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling (ODM) |
| **JWT** | Secure token-based authentication |
| **Multer** | File upload middleware |

---

## 📁 Project Structure

```
JOB-FINDER/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema (Job Seeker/Employer roles)
│   │   ├── Job.js               # Job posting schema
│   │   ├── Company.js           # Company profile schema
│   │   └── Application.js       # Job application schema
│   ├── routes/
│   │   └── [API Endpoints]      # Authentication, Jobs, Applications, Companies
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── upload.js            # File upload handling
│   └── server.js                # Application entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   ├── Buttons/         # Reusable button components
│   │   │   ├── Inputs/          # Form input components
│   │   │   └── ThemeToggle.jsx  # Day/Night mode switcher
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication state management
│   │   │   └── ThemeContext.jsx # Theme state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # User/Employer dashboard
│   │   │   ├── Jobs.jsx         # Job listings page
│   │   │   └── [Other Pages]    # Additional application pages
│   │   └── styles/
│   │       ├── global.css       # Global styles
│   │       └── variables.css    # CSS custom properties
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local installation or MongoDB Atlas)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/jaiprakash-k/Job-listing-portal.git
cd Job-listing-portal
```

#### 2. Backend Setup

Navigate to backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:
```bash
npx nodemon server.js
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

Navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

#### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to start using JobConnect.

---

## 🎯 Usage Guide

### For Job Seekers

1. **Sign Up** with your details and select Job Seeker role
2. **Complete Your Profile** with skills and experience
3. **Browse Jobs** using the search and filter options
4. **Apply to Positions** with one-click applications
5. **Track Applications** through your dashboard
6. **Save Jobs** to review and apply later
7. **Explore Companies** to find your ideal workplace

### For Employers

1. **Sign Up** and select Employer role
2. **Create Company Profile** with branding and details
3. **Post Job Openings** with detailed requirements
4. **Review Applications** as candidates apply
5. **Use the ATS Kanban Board** to manage hiring pipeline
6. **Move Candidates** through stages (Applied → Shortlisted → Interview → Offer)
7. **Track Metrics** on your dashboard

---

## 🎨 Design System

### Theme Variables

The application uses CSS custom properties for theming:

**Dark Theme (Default)**
- Background: Deep blacks with subtle gradients
- Accent Color: Warm amber (#f59e0b)
- Text: High contrast whites and grays
- Effects: Glassmorphism and subtle shadows

**Light Theme**
- Background: Clean whites and light grays
- Accent Color: Consistent amber
- Text: Dark grays and blacks
- Effects: Softer shadows and borders

### Animation System

- Smooth page transitions
- Hover state animations
- Loading states and skeletons
- Theme toggle animations (sun/moon with clouds/stars)
- Drag-and-drop feedback in ATS

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and structure.

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ to connect talent with opportunity.**

*Star ⭐ this repo if JobConnect helps you!*
