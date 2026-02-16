
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: UserRole.STUDENT
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Registration failed');
      }

      // Success
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-100/50 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 text-white flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">Create Account</h2>
            <p className="text-indigo-100 text-lg font-light leading-relaxed">
              Join our multi-role platform and start your professional development journey today.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="bg-white/20 p-1 rounded-full"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>
              <span>Standard-based security</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="bg-white/20 p-1 rounded-full"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>
              <span>Role-based access control</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h2>
          <p className="text-gray-500 mb-8">Enter your details to create your profile.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {error && (
              <div className="sm:col-span-2 bg-red-50 border border-red-100 p-3 rounded-xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
              <input 
                type="text" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="Choose a username"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
              <input 
                type="email" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="email@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Role</label>
              <select 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value={UserRole.STUDENT}>Student</option>
                <option value={UserRole.TRAINER}>Trainer</option>
                <option value={UserRole.HR}>HR Specialist</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="sm:col-span-2 mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></span> : 'Register Now'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
