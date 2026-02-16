
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import { StudentDashboard, HRDashboard, TrainerDashboard } from './pages/Dashboards';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';

const PortalRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  
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
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center max-w-md">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500 text-center mb-8">You don't have permission to view this section of the portal.</p>
      <button 
        onClick={() => window.location.href = '#/login'} 
        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
      >
        Back to Login
      </button>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/" element={<Navigate to="/portal" replace />} />

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
