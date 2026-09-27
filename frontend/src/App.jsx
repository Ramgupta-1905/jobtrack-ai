import { Routes, Route } from "react-router-dom";

import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";
import ResumeVault from "./pages/ResumeVault";
import Settings from "./pages/Settings";
import Interviews from "./pages/InterviewTracker";
import Application from "./pages/Applications";
import AIAssistant from "./pages/AIAssistant";
import ProtectedRoute from "./components/ProtectedRoute";

import HelpCenter from "./components/settings/HelpCenter";
import ContactSupport from "./components/settings/ContactSupport";
import ReportBug from "./components/settings/ReportBug";
import SendFeedback from "./components/settings/SendFeedback";
import AboutJobTrack from "./components/settings/AboutJobTrack";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Hero
            title="JobTrack AI"
            subtitle="Track your job applications smarter."
            buttonText="Get Started"
          />
        }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Main Application Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resume-vault" element={<ResumeVault />} />
          <Route path="settings" element={<Settings />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="applications" element={<Application />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />

          {/* Help & Support Pages */}
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="contact-support" element={<ContactSupport />} />
          <Route path="report-bug" element={<ReportBug />} />
          <Route path="send-feedback" element={<SendFeedback />} />
          <Route path="about-jobtrack" element={<AboutJobTrack />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;