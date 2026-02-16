
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      const getTargetRoute = (role: UserRole) => {
        switch(role) {
          case UserRole.ADMIN: return '/portal/admin';
          case UserRole.STUDENT: return '/portal/student';
          case UserRole.HR: return '/portal/hr';
          case UserRole.TRAINER: return '/portal/trainer';
          default: return '/portal';
        }
      };
      const destination = location.state?.from?.pathname || getTargetRoute(user.role);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Authentication failed');
      }

      const data = await response.json();
      // Handle common Spring JWT response formats
      const token = data.accessToken || data.token || data.jwt || (typeof data === 'string' ? data : null);
      
      if (!token) throw new Error('No token found in server response');

      login(token);
    } catch (err: any) {
      setError(err.message || 'Connection error. Please check if your backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-100/50 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Enterprise Portal</h1>
            <p className="text-indigo-100 text-lg font-light leading-relaxed">Secure, unified access for Students, Trainers, HR, and Admins. Designed for performance and ease of use.</p>
          </div>
          <div className="relative text-xs text-indigo-300 font-mono tracking-wider">http://localhost:8080/api/auth/login</div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Please sign in to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm font-medium animate-pulse flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
              <input
                type="text" required value={username} onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 flex justify-center items-center active:scale-[0.98]"
            >
              {isSubmitting ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></span> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
