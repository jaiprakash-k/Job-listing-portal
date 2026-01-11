# Job Listing Portal — Current Progress

This repository contains a full-stack Job Listing Portal with an Express/MongoDB backend and a React/Vite/Tailwind frontend. Below is a concise summary of what’s implemented so far and how to run it locally.

## Overview

- User authentication for two roles:
  - Job seekers (`User` model)
  - Employers (`Employer` model)
- JWT-based auth with protected routes and role-based authorization.
- Basic user profile update and account deletion.
- Admin-only endpoints to list job seekers and employers.
- Health check endpoint for API status.

## Tech Stack

- Backend: Express, Mongoose (MongoDB), JSON Web Tokens, bcryptjs, express-validator, cors, dotenv
- Frontend: React (Vite), Tailwind CSS, Framer Motion, React Router

## Project Structure

```
backend/
  server.js
  config/
    db.js
  controllers/
    auth.controller.js
    user.controller.js
  middleware/
    auth.middleware.js
  models/
    User.js
    Employer.js
    index.js
  routes/
    auth.routes.js
    user.routes.js
  utils/
    generateToken.js
frontend/
  index.html
  src/
    App.jsx
    main.jsx
    index.css
    components/... (UI building blocks)
    pages/... (Login, Register, Employer Register)
    services/
      api.js (API client and helpers)
```

## Backend — API Routes

- Health:
  - `GET /api/health` — API status

- Auth:
  - `POST /api/auth/register` — Register job seeker
  - `POST /api/auth/register-employer` — Register employer
  - `POST /api/auth/login` — Login (job seeker or employer)
  - `GET /api/auth/me` — Current user (protected)
  - `POST /api/auth/logout` — Logout (protected)

- Users:
  - `PUT /api/users/profile` — Update profile (protected)
  - `DELETE /api/users/profile` — Delete account (protected)
  - `GET /api/users/jobseekers` — List job seekers (admin only)
  - `GET /api/users/employers` — List employers (admin only)
  - `GET /api/users/:id` — Get user by id (protected)

## Data Models

- `User` (job seeker): username, email, password, role, isActive, timestamps
- `Employer`: firstName, lastName, companyEmail, password, phone, state, city, address, companyName?, role, isVerified, isActive, termsAccepted, timestamps

Both models:
- Hash passwords on save via `bcryptjs`.
- `comparePassword()` method for login.
- Remove password from JSON responses.

## Environment Variables

Create a `.env` file in `backend/` with:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbName>
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173
```

Frontend expects an API base URL. Create `frontend/.env` (or use your shell) with:

```
VITE_API_URL=http://localhost:5001/api
```

Note: The frontend default in `services/api.js` is `http://localhost:5002/api`. Setting `VITE_API_URL` ensures it points to your running backend.

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

- Starts Express on `PORT` (default `5001`).
- Connects to MongoDB using `MONGODB_URI`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Starts Vite dev server on `http://localhost:5173`.
- Uses `VITE_API_URL` for API requests.

## Frontend — Implemented Screens & Services

- Screens: Login, Register (Job Seeker), Employer Register.
- Components: Input, Buttons, Captcha mock, Animated containers, etc.
- Services: `authAPI` (login/register/me/logout), `userAPI` (get/update/delete profile), and localStorage helpers.

## Current Status

- Authentication flows and core user management are in place.
- Role-based protection for admin listing endpoints.
- API client wired up on the frontend with environment-driven base URL.

---

If you want, I can add endpoint examples, screenshots, or expand setup notes next.