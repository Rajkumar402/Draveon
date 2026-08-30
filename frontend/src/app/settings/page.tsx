'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Moon, Sun, Globe, Bell, Shield, Save
} from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoading, isDarkMode, setIsDarkMode } = useAuth();
  const router = useRouter();

  // Settings states
  const [language, setLanguage] = useState('English');
  const [notifyEnquiry, setNotifyEnquiry] = useState(true);
  const [notifyNewsletter, setNotifyNewsletter] = useState(false);
  const [privacyPublicProfile, setPrivacyPublicProfile] = useState(true);
  
  const [alertMsg, setAlertMsg] = useState('');

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) router.push('/');
  }, [isLoading, router, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 font-semibold animate-pulse text-sm">Authenticating session...</p>
      </div>
    );
  }

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg('Preferences saved successfully!');
    setTimeout(() => setAlertMsg(''), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden bg-grid-pattern">
      {/* Background glow filters */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-draveonPurple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-draveonBlue/10 rounded-full blur-[120px]" />

      <div className="max-w-3xl mx-auto z-10 relative">
        {/* Back Link */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition font-semibold text-xs mb-8"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to Dashboard
        </button>

        {/* Dashboard Title */}
        <div className="mb-8 border-b border-slate-800 pb-5">
          <h1 className="font-['Outfit'] text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">System Settings</h1>
          <span className="block text-[10px] text-draveonPurple font-bold tracking-[0.2em] uppercase mt-2">Draveon Workspace Preferences</span>
        </div>

        {alertMsg && (
          <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl mb-6 text-center text-xs font-bold text-emerald-400 animate-in fade-in duration-200">
            {alertMsg}
          </div>
        )}

        <form onSubmit={handlePreferencesSave} className="space-y-8">
          
          {/* Theme card */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-['Outfit'] text-lg font-bold text-white flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5 text-draveonPurple" /> : <Sun className="w-5 h-5 text-draveonBlue" />} Theme Preferences
            </h4>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="font-medium text-slate-400">Toggle website interface colors</span>
              <button 
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-6 bg-slate-800 rounded-full p-0.5 transition duration-200 flex items-center cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${isDarkMode ? 'translate-x-4 bg-draveonPurple' : ''}`} />
              </button>
            </div>
          </div>

          {/* Language card */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-['Outfit'] text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-400" /> Language Configuration
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400">Select workspace system language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-xs font-semibold text-slate-300"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-['Outfit'] text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-400" /> Notification Triggers
            </h4>
            <div className="space-y-3 text-xs font-semibold text-slate-300">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="font-medium text-slate-400">Receive project enquiry submission updates</span>
                <input 
                  type="checkbox" 
                  checked={notifyEnquiry}
                  onChange={(e) => setNotifyEnquiry(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-draveonPurple focus:ring-0" 
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer select-none pt-2 border-t border-slate-800/60">
                <span className="font-medium text-slate-400">Receive weekly tech releases newsletter</span>
                <input 
                  type="checkbox" 
                  checked={notifyNewsletter}
                  onChange={(e) => setNotifyNewsletter(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-draveonPurple focus:ring-0" 
                />
              </label>
            </div>
          </div>

          {/* Privacy Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-['Outfit'] text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-400" /> Privacy & Security Settings
            </h4>
            <div className="space-y-3 text-xs font-semibold text-slate-300">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="font-medium text-slate-400">Display public profile info in directory searches</span>
                <input 
                  type="checkbox" 
                  checked={privacyPublicProfile}
                  onChange={(e) => setPrivacyPublicProfile(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-draveonPurple focus:ring-0" 
                />
              </label>
            </div>
          </div>

          {/* Save triggers */}
          <button
            type="submit"
            className="btn-gradient w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save System Preferences
          </button>

        </form>
      </div>

    </div>
  );
}
