import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { SettingsModal } from './components/SettingsModal';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import { useSettings } from './contexts/SettingsContext';

// Page components
import { Branches } from './pages/Branches';
import { Groups } from './pages/Groups';
import { Students } from './pages/Students';
import { Trainers } from './pages/Trainers';
import { Attendance } from './pages/Attendance';
import { AttendanceRecords } from './pages/AttendanceRecords';
import { StudentProgress } from './pages/StudentProgress';
import { MatchSchedule } from './pages/MatchSchedule';
import { Payments } from './pages/Payments';
import { Finance } from './pages/Finance';

const AppContent = () => {
  const { user, clubData } = useAuth();
  const { settings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  if (!user) return <AuthForm />;
  if (!clubData) return <Onboarding />;

  return (
    <div className={settings.theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Toolbar onOpenSettings={() => setIsSettingsOpen(true)} />
        <Sidebar
          isExpanded={isSidebarExpanded}
          onExpandedChange={setIsSidebarExpanded}
        />
        <div
          className={`pt-16 transition-all duration-300 ${
            isSidebarExpanded ? 'pl-64' : 'pl-16'
          }`}
        >
          <div className="p-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/students" element={<Students />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/attendance-records" element={<AttendanceRecords />} />
              <Route path="/student-progress" element={<StudentProgress />} />
              <Route path="/match-schedule" element={<MatchSchedule />} />
              <Route path="/payments/*" element={<Payments />} />
              <Route path="/finance/*" element={<Finance />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <AppContent />
          <Toaster position="top-right" />
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;