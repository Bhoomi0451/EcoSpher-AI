import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Page Views
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CSRSubmission from './pages/CSRSubmission';
import JoinChallenge from './pages/JoinChallenge';
import Badges from './pages/Badges';
import RewardStore from './pages/RewardStore';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import UploadProof from './pages/UploadProof';

// Protected route middleware checking authentication state
const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader variant="screen" message="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Employee Dashboard main layout shell with collapsible sidebar
const EmployeeLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-205">
      
      {/* Drawer and Sidebar nav */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content right panel */}
      <div className="flex flex-1 flex-col overflow-hidden h-full">
        <Navbar onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Nested Route Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 max-w-7xl w-full mx-auto">
          <div className="page-transition-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated route group */}
            <Route element={<ProtectedLayout />}>
              <Route element={<EmployeeLayout />}>
                <Route path="/" element={<EmployeeDashboard />} />
                <Route path="/csr-submissions" element={<CSRSubmission />} />
                <Route path="/challenges" element={<JoinChallenge />} />
                <Route path="/badges" element={<Badges />} />
                <Route path="/rewards" element={<RewardStore />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/upload-proof" element={<UploadProof />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
