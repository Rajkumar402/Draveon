'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Home, User, Folder, Briefcase, Heart, History, Bell, 
  Settings, Sun, Moon, HelpCircle, PhoneCall, LogOut, LayoutDashboard 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout, isDarkMode, setIsDarkMode } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  
  // Logout confirmation modal states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleNavClick = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLoggedItemClick = (path: string) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    } else {
      handleNavClick(path);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex overflow-hidden">
            {/* Blurred Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              ref={sidebarRef}
              className="relative w-[280px] sm:w-[300px] md:w-[320px] h-full bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col justify-between z-10 text-slate-100 font-sans"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Section: Profile details / Header */}
              <div className="p-6 border-b border-slate-800/80">
                <div className="flex flex-col items-center text-center mt-6">
                  {/* Large Avatar */}
                  <div className="w-20 h-20 rounded-full border-2 border-draveonPurple/30 bg-slate-950 flex items-center justify-center overflow-hidden mb-3 shadow-[0_0_15px_rgba(123,44,191,0.2)]">
                    {user ? (
                      <span className="font-['Outfit'] text-2xl font-bold text-draveonPurple uppercase">
                        {user.name.charAt(0)}
                      </span>
                    ) : (
                      <User className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                  
                  {user ? (
                    <>
                      <h4 className="font-['Outfit'] text-lg font-bold text-white leading-tight">{user.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 mb-1 font-semibold">{user.email}</p>
                      <span className="text-[10px] font-bold text-draveonBlue uppercase tracking-wider bg-draveonBlue/5 border border-draveonBlue/15 px-2.5 py-0.5 rounded-full mt-1">
                        {user.role || "Founder • Draveon"}
                      </span>
                    </>
                  ) : (
                    <>
                      <h4 className="font-['Outfit'] text-lg font-bold text-white leading-tight">Guest User</h4>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">Sign in to access your account.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Middle Section: Menu List Items */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {/* 🏠 Home */}
                <button
                  onClick={() => handleNavClick('/')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <Home className="w-4.5 h-4.5 text-draveonPurple" /> Home
                </button>

                {/* 👤 My Account */}
                <button
                  onClick={() => handleLoggedItemClick('/account')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <User className="w-4.5 h-4.5 text-draveonBlue" /> My Account
                </button>

                {user && (
                  <button
                    onClick={() => handleNavClick('/account')}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left pl-8 border-l border-slate-800"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                  </button>
                )}

                {/* 📂 My Projects */}
                <button
                  onClick={() => handleLoggedItemClick('/#services')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <Folder className="w-4.5 h-4.5 text-slate-400" /> My Projects
                </button>

                {/* 📄 My Portfolio */}
                <button
                  onClick={() => handleNavClick('/#portfolio')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <Briefcase className="w-4.5 h-4.5 text-slate-400" /> My Portfolio
                </button>

                {/* ❤️ Saved Projects */}
                <button
                  onClick={() => handleLoggedItemClick('/account')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <Heart className="w-4.5 h-4.5 text-slate-400" /> Saved Projects
                </button>

                {/* 📜 Activity */}
                <button
                  onClick={() => handleLoggedItemClick('/account')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <History className="w-4.5 h-4.5 text-slate-400" /> Activity
                </button>

                {/* 🔔 Notifications */}
                <button
                  onClick={() => handleLoggedItemClick('/settings')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <Bell className="w-4.5 h-4.5 text-slate-400" /> Notifications
                </button>

                {/* ⚙ Settings */}
                <button
                  onClick={() => handleLoggedItemClick('/settings')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <Settings className="w-4.5 h-4.5 text-slate-400" /> Settings
                </button>

                {/* 🌙 Dark Mode Toggle */}
                <div className="w-full flex items-center justify-between px-4 py-3 text-slate-300 font-medium text-xs border-y border-slate-800/60 my-2">
                  <div className="flex items-center gap-3.5">
                    {isDarkMode ? <Moon className="w-4.5 h-4.5 text-draveonPurple" /> : <Sun className="w-4.5 h-4.5 text-draveonBlue" />}
                    <span>Theme: {isDarkMode ? 'Dark' : 'Light'}</span>
                  </div>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-9 h-5 bg-slate-800 rounded-full p-0.5 transition duration-200 focus:outline-none flex items-center cursor-pointer"
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${isDarkMode ? 'translate-x-4 bg-draveonPurple' : ''}`} />
                  </button>
                </div>

                {/* ❓ Help & Support */}
                <button
                  onClick={() => handleNavClick('/#faq')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <HelpCircle className="w-4.5 h-4.5 text-slate-400" /> Help & Support
                </button>

                {/* 📞 Contact Us */}
                <button
                  onClick={() => handleNavClick('/#enquiry')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white transition font-medium text-xs text-left"
                >
                  <PhoneCall className="w-4.5 h-4.5 text-slate-400" /> Contact Us
                </button>
              </div>

              {/* Bottom Section: Authentication CTAs or Logout */}
              <div className="p-6 border-t border-slate-800/80 bg-slate-950/20">
                {user ? (
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950/20 border border-red-900/50 hover:bg-red-950/40 text-red-400 transition font-bold text-xs"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); }}
                      className="w-full btn-gradient py-3 rounded-xl font-bold text-xs shadow-md"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
                      className="w-full border border-slate-800 hover:bg-slate-800 py-3 rounded-xl font-bold text-xs transition"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modals component */}
      <AuthModals 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authModalMode}
      />

      {/* Logout Confirmation Dialog Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl relative z-10 font-sans"
            >
              <h4 className="font-['Outfit'] text-lg font-bold text-white mb-2">Logout Confirmation</h4>
              <p className="text-slate-400 text-xs font-semibold mb-6">Are you sure you want to log out?</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 transition text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    setShowLogoutConfirm(false);
                    onClose();
                    router.push('/');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
