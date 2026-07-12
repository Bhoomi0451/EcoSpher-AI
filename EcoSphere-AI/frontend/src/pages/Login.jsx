import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });

  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      error('Please fill in email and password');
      return;
    }

    try {
      if (isLoginTab) {
        await login(formData.email, formData.password);
        success('Welcome back to EcoSphere!');
      } else {
        if (!formData.name || !formData.department) {
          error('Please fill in your name and department');
          return;
        }
        await register(formData.name, formData.email, formData.password, formData.department);
        success('Account registered successfully!');
      }
    } catch (err) {
      error(err.message || 'An error occurred during authentication');
    }
  };

  const departments = [
    'Operations & Supply Chain',
    'Logistics & Distribution',
    'Facilities & Energy Management',
    'Product Design & Engineering',
    'Human Resources & Admin',
    'Marketing & Public Relations',
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-3xl shadow-lg shadow-emerald-500/20 mb-3 animate-bounce-subtle">
            🌿
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
            EcoSphere <span className="text-brand-500 font-medium">AI</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            ESG Intelligence & Climate Action Platform
          </p>
        </div>

        {/* Auth form card */}
        <Card className="shadow-xl border border-slate-200 dark:border-slate-800">
          
          {/* Tab Switchers */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <button
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 text-center py-2 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                isLoginTab
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 text-center py-2 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                !isLoginTab
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full name input for registration */}
            {!isLoginTab && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required={!isLoginTab}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@corp.com"
                required
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Department dropdown select */}
            {!isLoginTab && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required={!isLoginTab}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:bg-slate-900 cursor-pointer"
                >
                  <option value="" disabled className="text-slate-500">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="text-slate-850 dark:text-slate-100">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              loading={isLoading}
              className="w-full py-3 mt-2 text-sm font-semibold shadow-md cursor-pointer"
            >
              {isLoginTab ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          {/* Additional text footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Authorized personnel access only. Registered operations are monitored.
            </p>
          </div>

        </Card>
      </div>
    </div>
  );
};

export default Login;
