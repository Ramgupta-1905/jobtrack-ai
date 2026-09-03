import { Routes, Route } from "react-router-dom";

import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";
import ResumeVault from "./pages/ResumeVault";
import Settings from "./pages/Settings"
import Interviews from "./pages/InterviewTracker";
import Application from "./pages/Applications";
import AIAssistant from "./pages/AIAssistant";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
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

      {/* Protected Layout */}
      <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="resume-vault" element={<ResumeVault />} />
        <Route path="settings" element={<Settings />} />
        <Route path="interviews" element={<Interviews />} />
         <Route path="applications" element={<Application />} />
         <Route path="/ai-assistant" element={<AIAssistant />} />
      </Route>
      </Route>
    </Routes>
  );
}

export default App;