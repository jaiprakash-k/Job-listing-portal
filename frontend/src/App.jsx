import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import './styles/global.css';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Dashboard from "./pages/Dashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard"; // Keep direct access if needed, or remove
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import NotFound from "./pages/NotFound";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        {/* Smart Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
