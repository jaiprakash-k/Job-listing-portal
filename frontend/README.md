# AMDOX Authentication Frontend

A modern, dark-themed React frontend for the AMDOX Job Listing Portal authentication system.

## 🚀 Tech Stack

- **React 18** with Vite
- **JavaScript** (ES6+)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router v7** for navigation

## 📁 Project Structure

```
amdox-auth/
├── public/
│   └── amdox-logo.svg
├── src/
│   ├── components/
│   │   ├── AnimatedContainer.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── CaptchaMock.jsx
│   │   ├── Checkbox.jsx
│   │   ├── Divider.jsx
│   │   ├── InputField.jsx
│   │   ├── Logo.jsx
│   │   ├── PrimaryButton.jsx
│   │   ├── SocialButton.jsx
│   │   ├── SuccessCheck.jsx
│   │   └── index.js
│   ├── pages/
│   │   ├── EmployerRegisterPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── index.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd amdox-auth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📄 Pages

### Login Page (`/login`)
- Split-screen layout with decorative left panel
- Social login buttons (Google, Apple)
- Email/password form
- Smooth animations on load

### User Registration (`/register`)
- Job seeker registration form
- Username, email, password, confirm password
- Mock captcha verification
- Form validation with error states
- Success animation on completion

### Employer Registration (`/register-employer`)
- Full-width two-column layout
- Gold/olive themed design
- Company details form
- Terms and conditions checkbox
- Staggered field animations

## ✨ Features

### Components
- **AuthLayout** - Split-screen authentication layout
- **InputField** - Animated input with validation states
- **PrimaryButton** - Button with ripple effect and loading state
- **SocialButton** - OAuth login buttons
- **AnimatedContainer** - Page-level animation wrapper
- **CaptchaMock** - Simple captcha verification mock
- **SuccessCheck** - Animated success modal
- **Checkbox** - Custom styled checkbox
- **Divider** - Text divider component
- **Logo** - Brand logo component

### Animations
- Page fade-in transitions
- Input field slide-up reveal
- Button hover scale effects
- Click ripple animations
- Error shake animation
- Success check animation
- Staggered form field animations

### Validation
- Required field validation
- Email format validation
- Password strength check
- Password confirmation match
- Captcha verification
- Phone number validation

## 🎨 Design System

### Colors
- **Primary**: Purple/Violet gradient (`#8b5cf6` - `#6366f1`)
- **Olive/Gold**: For employer theme (`#c9a227`)
- **Dark**: Background and surface colors (`#0f172a` - `#1e293b`)

### Typography
- Font: Inter
- Weights: 300, 400, 500, 600, 700, 800

## 📝 Notes

- No backend integration - all form submissions are mocked
- Form data is logged to console on submit
- Success states show mock redirects
- Fully responsive for desktop and mobile

## 🔧 Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📜 License

This project is for demonstration purposes.
