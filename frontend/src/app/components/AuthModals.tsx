'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModals({ isOpen, onClose, initialMode = 'login' }: AuthModalsProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      const res = await login(loginEmail, loginPass, rememberMe);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (signupPass !== signupConfirm) {
      setErrorMsg('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const res = await signup(signupName, signupEmail, signupPass);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          {/* Overlay click closer */}
          <div className="absolute inset-0" onClick={onClose} />
          
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 text-slate-100 font-sans"
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {mode === 'login' ? (
              // LOGIN MODE
              <div>
                <h3 className="font-['Outfit'] text-2xl font-extrabold mb-2 tracking-tight text-white">Sign In</h3>
                <p className="text-xs text-slate-400 font-semibold mb-6">Access your Draveon workspace account</p>
                
                {errorMsg && (
                  <p className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-xl mb-4 text-center">
                    {errorMsg}
                  </p>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. john@draveon.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Password</label>
                    <input
                      type="password"
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-950 text-draveonPurple focus:ring-0" 
                      />
                      Remember Me
                    </label>
                    <span className="text-slate-500">Password reset support is available through your account administrator.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gradient py-3.5 rounded-xl font-bold text-sm shadow-md mt-6"
                  >
                    {loading ? "Authenticating..." : "Sign In"}
                  </button>
                </form>

                <p className="text-xs font-semibold text-center text-slate-400 mt-6">
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('signup'); setErrorMsg(''); }} className="text-draveonPurple hover:underline">
                    Create Account
                  </button>
                </p>
              </div>
            ) : (
              // SIGNUP MODE
              <div>
                <h3 className="font-['Outfit'] text-2xl font-extrabold mb-2 tracking-tight text-white">Create Account</h3>
                <p className="text-xs text-slate-400 font-semibold mb-6">Register your Draveon workspace account</p>

                {errorMsg && (
                  <p className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-xl mb-4 text-center">
                    {errorMsg}
                  </p>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</label>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="john@draveon.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Password (12+ characters, upper/lowercase and number)</label>
                    <input
                      type="password"
                      required
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gradient py-3.5 rounded-xl font-bold text-sm shadow-md mt-6"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </form>

                <p className="text-xs font-semibold text-center text-slate-400 mt-6">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setErrorMsg(''); }} className="text-draveonPurple hover:underline">
                    Sign In
                  </button>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
