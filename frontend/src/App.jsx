import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DSATracker from './pages/DSATracker.jsx';
import Profile from './pages/Profile.jsx';
import OATracker from './pages/OATracker.jsx';
import Notes from './pages/Notes.jsx';
import ResumeManager from './pages/ResumeManager.jsx';
import Analytics from './pages/Analytics.jsx';
import RevisionList from './pages/RevisionList.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx';
import MockInterview from './pages/MockInterview.jsx';
import DailyCoach from './pages/DailyCoach.jsx';
import CompanyRoadmap from './pages/CompanyRoadmap.jsx';
import Experiences from './pages/ExperienceBoard.jsx';

// Defined OUTSIDE App
const HomeRoute = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
      <p style={{ color: '#1a3a6b' }}>Loading...</p>
    </div>
  );

  if (user) return <Navigate to="/dashboard" replace />;

  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dsa-tracker" element={<ProtectedRoute><DSATracker /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/oa-tracker" element={<ProtectedRoute><OATracker /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/resume-manager" element={<ProtectedRoute><ResumeManager /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/revision-list" element={<ProtectedRoute><RevisionList /></ProtectedRoute>} />
          <Route path="/analyze-resume" element={<ProtectedRoute><ResumeAnalyzer/></ProtectedRoute>}/>
          <Route path="/mock-interview" element={<ProtectedRoute><MockInterview/></ProtectedRoute>}/>
          <Route path="/ai-coach" element={<ProtectedRoute><DailyCoach/></ProtectedRoute>}/>
          <Route path="/company-roadmap" element={<ProtectedRoute><CompanyRoadmap /></ProtectedRoute>}/>
          <Route path="/experiences" element={<ProtectedRoute><Experiences /></ProtectedRoute>}/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;