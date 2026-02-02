# JobConnect - Advanced Job Listing Portal

JobConnect is a modern, full-featured job finding application connecting talent with opportunities. Built with the MERN stack (MongoDB, Express, React, Node.js), it offers a sophisticated user experience with dark/light theming, role-based dashboards, and intuitive workflow management.

## 🚀 Features

### 🎨 User Interface & Experience
- **Sophisticated Design**: A premium dark-themed UI (default) with warm amber accents, utilizing glassmorphism and smooth transitions.
- **Theme Toggle**: Advanced Day/Night mode switch with complex animations (Sun/Moon, Clouds, Stars) and persistent state.
- **Animated Components**: Custom interactive elements like the expanding Logout button and hover effects.
- **Responsive Layout**: Fully responsive design for Desktop, Tablet, and Mobile devices.

### 🔐 Authentication & Roles
- **Secure Auth**: JWT-based authentication with Login and Signup.
- **Role-Based Access Control (RBAC)**: Distinct portals for **Job Seekers** and **Employers**.
- **Profile Management**: customizable user profiles and account settings.

### 💼 For Job Seekers
- **Smart Dashboard**: Overview of applied jobs, saved jobs, and application statuses.
- **Advanced Job Search**: Filter jobs by type, location, experience, and salary.
- **Detailed Job Views**: Rich job descriptions with company insights.
- **One-Click Apply**: Streamlined application process.
- **Company Directory**: Explore companies and their open positions.

### 🏢 For Employers
- **Command Center Dashboard**: Real-time metrics on active jobs, total candidates, and views.
- **Kanban Applicant Tracking System (ATS)**: Drag-and-drop board to manage candidates through stages (Applied -> Shortlisted -> Interview -> Offer/Reject).
- **Job Management**: Create, Edit, and Delete job postings with rich text requirements.
- **Company Profile Editor**: Comprehensive company branding with Tech Stack, Benefits, Values, and Team details.
- **Candidate Profiles**: Detailed view of applicant profiles, resumes, and contact info.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), React Router v6, CSS Modules, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **State Management**: React Context API (Auth, Theme).

## 📂 Project Structure

```
JOB FINDER/
├── backend/
│   ├── models/       # Mongoose Schemas (User, Job, Company, Application)
│   ├── routes/       # API Endpoints
│   ├── middleware/   # Auth & Upload Middleware
│   └── server.js     # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI Components (Navbar, Buttons, Inputs)
│   │   ├── context/    # Global State (AuthContext, ThemeContext)
│   │   ├── pages/      # Application Pages (Dashboard, Jobs, etc.)
│   │   └── styles/     # Global CSS & Variables
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/jaiprakash-k/Job-listing-portal.git
    cd Job-listing-portal
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create .env file with:
    # MONGO_URI=your_mongodb_uri
    # JWT_SECRET=your_jwt_secret
    # PORT=5000
    npx nodemon server.js
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open `http://localhost:5173` in your browser.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License
This project is licensed under the MIT License.
