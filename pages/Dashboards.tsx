
import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600 uppercase tracking-widest">{title} Portal</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 font-medium">Hello, {user?.username}</span>
          <button onClick={logout} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold transition-colors">Logout</button>
        </div>
      </nav>
      <main className="p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export const StudentDashboard: React.FC = () => (
  <DashboardShell title="Student">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Enrolled Courses</h3>
        <p className="text-3xl font-black">4 Active</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Assignments</h3>
        <p className="text-3xl font-black text-amber-500">2 Pending</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Overall Grade</h3>
        <p className="text-3xl font-black text-indigo-600">A-</p>
      </div>
    </div>
  </DashboardShell>
);

export const HRDashboard: React.FC = () => (
  <DashboardShell title="HR">
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-4">Recruitment Overview</h2>
      <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-medium">
        Applicant Tracking Chart Placeholder
      </div>
    </div>
  </DashboardShell>
);

export const TrainerDashboard: React.FC = () => (
  <DashboardShell title="Trainer">
    <div className="space-y-6">
      <div className="bg-indigo-600 p-8 rounded-3xl text-white">
        <h2 className="text-3xl font-bold mb-2">Ready for today's session?</h2>
        <p className="text-indigo-100">You have 3 classes scheduled for today.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-lg mb-4">My Students</h3>
        <ul className="divide-y divide-gray-100">
          {[1,2,3].map(i => (
            <li key={i} className="py-3 flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">Student #{i}04</span>
              <span className="text-green-500 font-bold">Online</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </DashboardShell>
);
