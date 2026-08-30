'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, User, Mail, Phone, Briefcase, CheckCircle, 
  Link, Lock, Save, Edit3, KeyRound, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
  const { user, isLoading, updateProfile, changePassword } = useAuth();
  const router = useRouter();
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  // Mode states
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Password states
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  // Alert logs
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Load user data on mounting / updating
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setCompany(user.company || '');
      setRole(user.role || '');
      setBio(user.bio || '');
      setSkills(user.skills ? user.skills.join(', ') : '');
      setGithub(user.socialLinks?.github || '');
      setLinkedin(user.socialLinks?.linkedin || '');
      setTwitter(user.socialLinks?.twitter || '');
    }
  }, [user]);

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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    const result = await updateProfile({
      name,
      phone,
      company,
      role,
      bio,
      skills: skillsArray,
      socialLinks: { github, linkedin, twitter }
    });
    
    if (result.success) setIsEditing(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match');
      return;
    }
    
    const res = await changePassword(oldPass, newPass);
    if (res.success) {
      setPassSuccess(res.message);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setShowPasswordModal(false), 1500);
    } else {
      setPassError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden bg-grid-pattern">
      
      {/* Background glow filters */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-draveonPurple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-draveonBlue/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Back Link */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition font-semibold text-xs mb-8"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to Dashboard
        </button>

        {/* Dashboard Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-['Outfit'] text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">Account Configuration</h1>
            <span className="block text-[10px] text-draveonPurple font-bold tracking-[0.2em] uppercase mt-2">Draveon Workspace Identity</span>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 transition text-xs font-bold bg-slate-900"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
            <button 
              onClick={() => {
                setPassError('');
                setPassSuccess('');
                setShowPasswordModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition text-xs font-bold"
            >
              <KeyRound className="w-4 h-4 text-draveonPurple" /> Change Password
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card Left: Profile summary */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 text-center flex flex-col items-center h-fit shadow-xl">
            <div className="w-24 h-24 rounded-full border-2 border-draveonPurple/30 bg-slate-950 flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_20px_rgba(123,44,191,0.15)]">
              <span className="font-['Outfit'] text-3xl font-bold text-draveonPurple uppercase">{user.name.charAt(0)}</span>
            </div>
            
            <h3 className="font-['Outfit'] text-xl font-bold text-white">{user.name}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 mb-1">{user.email}</p>
            <span className="text-[10px] font-bold text-draveonBlue uppercase tracking-wider bg-draveonBlue/5 border border-draveonBlue/15 px-3 py-1 rounded-full mt-2 mb-6">
              {user.role || "Founder • Draveon"}
            </span>

            {/* Social handles list */}
            <div className="w-full space-y-3 pt-6 border-t border-slate-800 text-slate-400 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Link className="w-4 h-4" /> GitHub</span>
                <span className="text-slate-300 font-medium truncate max-w-[120px]">{user.socialLinks?.github ? "Connected" : "None"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Link className="w-4 h-4" /> LinkedIn</span>
                <span className="text-slate-300 font-medium truncate max-w-[120px]">{user.socialLinks?.linkedin ? "Connected" : "None"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Link className="w-4 h-4" /> Twitter</span>
                <span className="text-slate-300 font-medium truncate max-w-[120px]">{user.socialLinks?.twitter ? "Connected" : "None"}</span>
              </div>
            </div>
          </div>

          {/* Card Right: Information list */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
            {isEditing ? (
              // EDIT FORM
              <form onSubmit={handleProfileSave} className="space-y-6">
                <h4 className="font-['Outfit'] text-lg font-bold text-white border-b border-slate-800 pb-3">Edit Profile Settings</h4>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role Title</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Biography</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Next.js, FastAPI, SQL"
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                  />
                </div>

                <h4 className="font-['Outfit'] text-xs font-bold uppercase tracking-wider text-slate-400 pt-4 border-t border-slate-800">Social Connections</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="GitHub URL"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs focus:outline-none focus:border-draveonPurple text-slate-200"
                  />
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn URL"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs focus:outline-none focus:border-draveonPurple text-slate-200"
                  />
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="Twitter URL"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs focus:outline-none focus:border-draveonPurple text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gradient w-full py-3.5 rounded-xl font-bold text-sm shadow-md mt-6 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile Details
                </button>
              </form>
            ) : (
              // READ-ONLY INFO VIEW
              <div className="space-y-6">
                <h4 className="font-['Outfit'] text-lg font-bold text-white border-b border-slate-800 pb-3">User Profile Identity</h4>
                
                <div className="grid sm:grid-cols-2 gap-6 text-xs font-semibold">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Company</span>
                    <p className="text-slate-200 text-sm font-medium">{user.company || "Not Specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Phone</span>
                    <p className="text-slate-200 text-sm font-medium">{user.phone || "Not Specified"}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-semibold">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Bio Biography</span>
                  <p className="text-slate-300 text-xs leading-relaxed font-medium mt-1">
                    {user.bio || "No biography provided yet. Click Edit Profile to update details."}
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Workspace Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill) => (
                        <span key={skill} className="text-xs font-bold text-slate-300 bg-slate-850 px-3 py-1 rounded-full border border-slate-800">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No skills cataloged yet.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative z-10"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-['Outfit'] text-xl font-bold text-white mb-2">Change Account Password</h3>
              <p className="text-xs text-slate-400 font-semibold mb-6">Update your secure login credentials</p>

              {passError && <p className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/55 p-3 rounded-xl mb-4 text-center">{passError}</p>}
              {passSuccess && <p className="text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/55 p-3 rounded-xl mb-4 text-center">{passSuccess}</p>}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-draveonPurple text-sm text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-gradient py-3.5 rounded-xl font-bold text-xs shadow-md mt-6"
                >
                  Update Credentials
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
