
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import { StudentDashboard, HRDashboard, TrainerDashboard } from './pages/Dashboards';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';

// Helper component for /portal logic
const PortalRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  switch(user.role) {
    case UserRole.ADMIN: return <Navigate to="/portal/admin" replace />;
    case UserRole.STUDENT: return <Navigate to="/portal/student" replace />;
    case UserRole.HR: return <Navigate to="/portal/hr" replace />;
    case UserRole.TRAINER: return <Navigate to="/portal/trainer" replace />;
    default: return <Navigate to="/unauthorized" replace />;
  }
};

const Unauthorized: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
    <p className="text-gray-600 mb-6 text-center">You do not have the required permissions to access this page.</p>
    <button 
      onClick={() => window.location.href = '#/login'} 
      className="text-indigo-600 hover:text-indigo-800 font-medium underline"
    >
      Return to Login
    </button>
  </div>
);

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Root redirection */}
      <Route path="/" element={<Navigate to="/portal" replace />} />

      {/* Protected Portal Routes */}
      <Route 
        path="/portal" 
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<PortalRedirect />} />
        
        <Route path="admin" element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminDashboard /></ProtectedRoute>} />
        <Route path="student" element={<ProtectedRoute requiredRole={UserRole.STUDENT}><StudentDashboard /></ProtectedRoute>} />
        <Route path="hr" element={<ProtectedRoute requiredRole={UserRole.HR}><HRDashboard /></ProtectedRoute>} />
        <Route path="trainer" element={<ProtectedRoute requiredRole={UserRole.TRAINER}><TrainerDashboard /></ProtectedRoute>} />
      </Route>

      {/* 404 - Redirect back home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
