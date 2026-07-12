import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { TrophyIcon, BoltIcon, FireIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Eco Points', value: '1,240', change: '+12% this month', icon: TrophyIcon, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'CO2 Saved', value: '45.2 kg', change: '8.4 kg this week', icon: BoltIcon, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Challenges Joined', value: '3 Active', change: '1 completed recently', icon: FireIcon, color: 'text-rose-500 bg-rose-500/10' },
    { name: 'CSR Submissions', value: '18 total', change: '1 pending approval', icon: ShieldCheckIcon, color: 'text-blue-500 bg-blue-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-[linear-gradient(135deg,_var(--tw-gradient-stops))] from-emerald-500 to-teal-600 p-6 md:p-8 text-white shadow-lg shadow-emerald-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,_var(--tw-gradient-stops)) from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white m-0">
            Welcome back, {user?.name || 'Eco Warrior'}!
          </h2>
          <p className="text-emerald-50 text-sm leading-relaxed">
            Your daily initiatives make a significant impact on our Corporate ESG goals. Track your points, submit green ideas, participate in climate challenges, and redeem exclusive sustainability rewards.
          </p>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} hoverEffect>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.name}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Extra layout panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Active Department Challenge" className="lg:col-span-2">
          <div className="py-8 text-center text-slate-400 dark:text-slate-500">
            <span className="text-4xl">🏅</span>
            <p className="mt-2 text-sm font-medium">Join challenges to compete with other teams!</p>
            <Button variant="outline" size="sm" className="mt-4 cursor-pointer">View Challenges</Button>
          </div>
        </Card>
        
        <Card title="Quick Action Center">
          <div className="flex flex-col gap-3 py-2">
            <Button variant="primary" className="w-full text-left justify-start cursor-pointer">Submit Green Proof</Button>
            <Button variant="secondary" className="w-full text-left justify-start cursor-pointer">Browse Reward Store</Button>
            <Button variant="outline" className="w-full text-left justify-start cursor-pointer">Edit Profile Settings</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
