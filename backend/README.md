# Job Listing Portal - Backend API

A RESTful API backend for the Job Listing Portal built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (or use the existing `.env`)
   - Update the values as needed:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/job-listing-portal
     JWT_SECRET=your-secret-key
     JWT_EXPIRE=7d
     CLIENT_URL=http://localhost:5173
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new job seeker |
| POST | `/api/auth/register-employer` | Register a new employer |
| POST | `/api/auth/login` | Login user (job seeker or employer) |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/logout` | Logout user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/jobseekers` | Get all job seekers (Admin only) |
| GET | `/api/users/employers` | Get all employers (Admin only) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/profile` | Update current user profile |
| DELETE | `/api/users/profile` | Delete current user account |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

## Request/Response Examples

### Register Job Seeker
```json
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Register Employer
```json
POST /api/auth/register-employer
{
  "firstName": "John",
  "lastName": "Doe",
  "companyEmail": "john@company.com",
  "password": "securepassword123",
  "phone": "9876543210",
  "state": "Maharashtra",
  "city": "Mumbai",
  "address": "123 Business Street",
  "termsAccepted": true
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Response Format
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "jobseeker"
  }
}
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── auth.controller.js # Authentication logic
│   └── user.controller.js # User management logic
├── middleware/
│   └── auth.middleware.js # JWT verification & authorization
├── models/
│   ├── User.js            # Job seeker model
│   ├── Employer.js        # Employer model
│   └── index.js           # Model exports
├── routes/
│   ├── auth.routes.js     # Authentication routes
│   └── user.routes.js     # User routes
├── utils/
│   └── generateToken.js   # JWT token utilities
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js              # Entry point
```

## Running in Production

```bash
npm start
```

Make sure to:
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or a production MongoDB instance
4. Set appropriate `CLIENT_URL` for CORS

## License

ISC
