'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Layers, Cpu, Smartphone, ArrowRight, ShieldCheck, 
  Mail, User, Phone, Briefcase, CheckCircle, Code2, Rocket, 
  Terminal, BarChart3, Users, Zap, Check, ArrowUpRight, X, Menu,
  Database, Play, CornerDownRight, Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatbotWidget from './components/ChatbotWidget';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';

interface Project {
  id: number;
  title: string;
  category: string;
  badge: string;
  description: string;
  features?: string[];
  technology: string[];
  ethicalNote: string;
  footer?: string;
  specTable: { key: string; val: string }[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Enterprise AI Voice Assistant",
    category: "Artificial Intelligence",
    badge: "Client Project (Company Confidential)",
    description: "Built a customized voice transcription and natural language intent classification router to handle client incoming enquiries automatically.",
    features: [
      "Real-time Audio Processing",
      "Intent Router Node",
      "Multi-language Synthesis",
      "Offline Failover Mode"
    ],
    technology: ["Python", "FastAPI", "OpenRouter", "WebSockets"],
    ethicalNote: "Developed as part of a professional software engineering role.",
    footer: "Enterprise Project • Company Confidential",
    specTable: [
      { key: "Stack", val: "Python / FastAPI" },
      { key: "API Rotation", val: "OpenRouter / Groq" },
      { key: "Protocols", val: "WebSockets" },
      { key: "Compliance", val: "Company Confidential" }
    ]
  },
  {
    id: 2,
    title: "Document Retrieval Engine (RAG)",
    category: "Artificial Intelligence",
    badge: "Client Project (Company Confidential)",
    description: "Engineered a vector embeddings search pipeline allowing employees to query confidential product manuals and retrieve contextual guidelines within seconds.",
    features: [
      "Vector Embeddings Generation",
      "Semantic Search Router",
      "Document Upload Pipeline",
      "Conversation Memory Store"
    ],
    technology: ["React", "FastAPI", "OpenAI", "PostgreSQL"],
    ethicalNote: "Enterprise-grade AI platform developed for a confidential organization.",
    footer: "Professional Project • Company Confidential",
    specTable: [
      { key: "Stack", val: "React / FastAPI" },
      { key: "Database", val: "PostgreSQL / Vector pg" },
      { key: "API Hub", val: "OpenAI embeddings" },
      { key: "Release Version", val: "v1.4.2" }
    ]
  },
  {
    id: 3,
    title: "Hospital Appointment Management System",
    category: "Web Applications",
    badge: "Personal Project",
    description: "Designed and developed a hospital appointment platform allowing patients to book appointments, manage schedules, and receive notifications.",
    features: [
      "Patient Booking Portal",
      "Doctor Scheduling Grid",
      "Email & SMS Notifications",
      "Admin Control Panel",
      "Patient History Tracking"
    ],
    technology: ["React", "FastAPI", "PostgreSQL"],
    ethicalNote: "Developed as a personal software engineering project.",
    specTable: [
      { key: "Stack", val: "React / FastAPI" },
      { key: "Database", val: "PostgreSQL Schemas" },
      { key: "Release", val: "Personal Core" }
    ]
  },
  {
    id: 4,
    title: "Modern Business Website",
    category: "Frontend Sites",
    badge: "Personal Project",
    description: "Constructed a high-fidelity business landing page utilizing Next.js, Framer Motion, and Tailwind CSS. Fully responsive and optimized for PageSpeed.",
    features: [
      "Responsive Fluid Layout",
      "Framer Motion Animations",
      "Vercel Edge Deployment",
      "SEO Metadata Optimization",
      "Dynamic Routing"
    ],
    technology: ["Next.js", "React", "Tailwind CSS"],
    ethicalNote: "Developed as a personal software engineering project.",
    specTable: [
      { key: "Stack", val: "Next.js / React" },
      { key: "Styling", val: "Tailwind CSS" },
      { key: "SEO Rank", val: "100/100 Core Web" }
    ]
  }
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Website Development',
    project_brief: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Interactive Console States
  const [consoleTab, setConsoleTab] = useState<'api' | 'db' | 'ai'>('api');

  const categories = ['All', 'Artificial Intelligence', 'Web Applications', 'Frontend Sites'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
      const res = await fetch(`${apiBase}/v1/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Website Development',
          project_brief: ''
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const faqs = [
    {
      q: "What services does DRAVEON provide?",
      a: "DRAVEON specializes in building modern websites, custom mobile applications, workflow automation, and custom CRM/ERP business systems."
    },
    {
      q: "How do I get started with a project?",
      a: "Simply fill out our brief enquiry form with your contact details and project requirements. Our team will review the parameters and schedule a details call within 24 hours."
    },
    {
      q: "Can I update my project requirements later?",
      a: "Absolutely. We follow agile development practices, allowing you to iterate on requirements and features as development progresses."
    }
  ];

  return (
    <div className="min-h-screen bg-grid-pattern relative pb-16 font-sans">
      
      {/* Dynamic Background Blob Glows - Understated */}
      <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-draveonPurple/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[5%] w-[500px] h-[500px] bg-draveonBlue/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Floating Minimal Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition mr-1 shrink-0"
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col justify-between w-4 h-2.5">
                <span className={`block w-4 h-[1.5px] bg-slate-800 dark:bg-slate-200 rounded transform transition-all duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                <span className={`block w-4 h-[1.5px] bg-slate-800 dark:bg-slate-200 rounded transform transition-all duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
              </div>
            </button>
            <Logo className="w-8 h-8 shrink-0" />
            <div>
              <span className="font-['Outfit'] text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">DRAVEON</span>
              <span className="block text-[7px] text-slate-400 font-bold tracking-[0.25em] uppercase mt-0.5 leading-none">Build • Automate • Innovate</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Home</a>
            <a href="#services" className="hover:text-slate-900 dark:hover:text-white transition">Services</a>
            <a href="#portfolio" className="hover:text-slate-900 dark:hover:text-white transition">Portfolio</a>
            <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition">About</a>
            <a href="#process" className="hover:text-slate-900 dark:hover:text-white transition">Process</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition">FAQ</a>
            <a href="#enquiry" className="hover:text-slate-900 dark:hover:text-white transition">Contact</a>
            <a href="#enquiry" className="bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-slate-950 px-4 py-2 rounded-full font-bold text-xs transition shadow-sm">
              Enquire Now
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-slate-600 dark:text-slate-350 hover:text-draveonPurple transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 flex flex-col gap-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-draveonPurple transition">Home</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-draveonPurple transition">Services</a>
              <a href="#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-draveonPurple transition">Portfolio</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-draveonPurple transition">About</a>
              <a href="#process" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-draveonPurple transition">Process</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-draveonPurple transition">FAQ</a>
              <a href="#enquiry" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-draveonPurple transition">Contact</a>
              <a href="#enquiry" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 rounded-full font-bold mx-6">
                Enquire Now
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-36 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-bold mb-8 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-draveonPurple" /> MODERN AI-FIRST DIGITAL AGENCY
        </div>
        <h1 className="font-['Outfit'] text-6xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.02] max-w-5xl mx-auto mb-8">
          Crafting systems for the <span className="text-gradient">next generation</span> of technology.
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-semibold">
          A newly launched software development and AI automation agency focused on constructing high-performance next-generation web portals, mobile apps, and custom business databases.
        </p>
        
        <div className="flex items-center gap-6 justify-center mb-24">
          <a href="#enquiry" className="bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 py-4 rounded-full font-bold text-base transition shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex items-center gap-2">
            Discuss Your Project <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#services" className="text-slate-900 dark:text-white font-bold text-base hover:underline flex items-center gap-1">
            Explore Services
          </a>
        </div>

        {/* Premium Developer Console Mockup */}
        <div className="max-w-4xl mx-auto relative mt-16 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 text-slate-200 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-[10px] font-mono font-bold text-slate-500 ml-4 tracking-wider uppercase">draveon_engine_v1.0.4</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setConsoleTab('api')}
                className={`px-3 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition ${consoleTab === 'api' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                API Core
              </button>
              <button 
                onClick={() => setConsoleTab('db')}
                className={`px-3 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition ${consoleTab === 'db' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                Database
              </button>
              <button 
                onClick={() => setConsoleTab('ai')}
                className={`px-3 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition ${consoleTab === 'ai' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                AI Router
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 font-mono text-left text-xs md:text-sm leading-relaxed overflow-x-auto min-h-[220px]">
            <AnimatePresence mode="wait">
              {consoleTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-slate-500">{"// GET /api/v1/inquiry"}</p>
                  <p className="text-emerald-400">{"HTTP/1.1 200 OK"}</p>
                  <p className="text-slate-400">{"{"}</p>
                  <p className="pl-6"><span className="text-blue-400">"status"</span>: <span className="text-emerald-400">"connected"</span>,</p>
                  <p className="pl-6"><span className="text-blue-400">"database"</span>: <span className="text-emerald-400">"SQLite Engine (persisted)"</span>,</p>
                  <p className="pl-6"><span className="text-blue-400">"routes"</span>: <span className="text-slate-300">["/inquiry", "/chatbot/query"]</span>,</p>
                  <p className="pl-6"><span className="text-blue-400">"microservices"</span>: <span className="text-slate-300">"decoupled Next.js + FastAPI stack"</span></p>
                  <p className="text-slate-400">{"}"}</p>
                </motion.div>
              )}

              {consoleTab === 'db' && (
                <motion.div
                  key="db"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-slate-500">{"// SQL schema models.py"}</p>
                  <p className="text-purple-400"><span className="text-blue-400">CREATE TABLE</span> enquiries (</p>
                  <p className="pl-6">id INTEGER PRIMARY KEY AUTOINCREMENT,</p>
                  <p className="pl-6">name VARCHAR(<span className="text-amber-400">100</span>) NOT NULL,</p>
                  <p className="pl-6">email VARCHAR(<span className="text-amber-400">150</span>) NOT NULL,</p>
                  <p className="pl-6">phone VARCHAR(<span className="text-amber-400">50</span>),</p>
                  <p className="pl-6">service VARCHAR(<span className="text-amber-400">100</span>) DEFAULT <span className="text-emerald-400">'Website Development'</span>,</p>
                  <p className="pl-6">project_brief TEXT NOT NULL</p>
                  <p className="text-purple-400">);</p>
                </motion.div>
              )}

              {consoleTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-slate-500">{"// AI query processing logs"}</p>
                  <p><span className="text-blue-400">{"\u003e\u003e\u003e"}</span> incoming chatbot query: <span className="text-slate-300">"What is your stack?"</span></p>
                  <p><span className="text-blue-400">{"\u003e\u003e\u003e"}</span> retrieving vector search embeddings ...</p>
                  <p><span className="text-blue-400">{"\u003e\u003e\u003e"}</span> match confidence: <span className="text-emerald-400">0.974</span> (context: technology_stack.md)</p>
                  <p className="text-slate-500 mt-2">{"// response payload"}</p>
                  <p className="text-emerald-400">"We configure a decoupled stack using Next.js 14 for speed & SEO, backed by FastAPI for rapid endpoints."</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Enquiry Form (Relocated below Hero Section) */}
      <section id="enquiry" className="py-32 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-100 dark:border-slate-900">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          {/* Offset Header */}
          <div className="md:col-span-2 space-y-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect</span>
            <h2 className="font-['Outfit'] text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">Let's discuss the parameters.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">
              Fill out your specifications, and Sri Mahadevan and Rajkumar will formulate a release proposal within 24 hours.
            </p>
          </div>

          {/* Form Card */}
          <div className="md:col-span-3 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
            {status === 'success' ? (
              <div className="text-center py-12 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="font-['Outfit'] text-2xl font-bold text-slate-950 dark:text-white mb-2">Project Brief Submitted!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Your details have been written to the SQL database. A DRAVEON representative will contact you shortly.</p>
                <button onClick={() => setStatus('idle')} className="btn-gradient px-6 py-2.5 rounded-full font-bold text-sm">
                  Submit Another Project Brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="E.g., John Doe"
                      className="w-full pb-3 border-b border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-slate-950 dark:focus:border-white text-sm text-slate-900 dark:text-slate-100 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="E.g., john@draveon.com"
                      className="w-full pb-3 border-b border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-slate-950 dark:focus:border-white text-sm text-slate-900 dark:text-slate-100 transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="E.g., +1 (555) 000-0000"
                      className="w-full pb-3 border-b border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-slate-950 dark:focus:border-white text-sm text-slate-900 dark:text-slate-100 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Service Area</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full pb-3 border-b border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-slate-950 dark:focus:border-white text-sm text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      <option value="Website Development">Website Development</option>
                      <option value="Mobile Applications">Mobile Applications</option>
                      <option value="AI Chatbot Integration">AI Chatbot Integration</option>
                      <option value="Enterprise CRM/ERP">Enterprise CRM/ERP</option>
                      <option value="Workflow Automation">Workflow Automation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Requirements & Timeline</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.project_brief}
                    onChange={(e) => setFormData({...formData, project_brief: e.target.value})}
                    placeholder="Outline key project deliverables, targets, or custom integration briefs..."
                    className="w-full pb-3 border-b border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-slate-950 dark:focus:border-white text-sm text-slate-900 dark:text-slate-100 transition resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs font-bold text-red-500 text-center">Connection error. Please confirm that your FastAPI backend service is active.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-slate-950 py-4 rounded-xl font-bold text-base transition shadow-md flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? 'Saving Details...' : 'Submit Project Enquiry'} <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Services Section (Asymmetrical Grid) */}
      <section id="services" className="py-32 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/60 dark:border-slate-800/60 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left max-w-2xl mb-24 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Capabilities</span>
            <h2 className="font-['Outfit'] text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">Enterprise Engineering Solutions</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Bespoke technical execution built using our Next.js + FastAPI decoupled stack.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Wide */}
            <div className="premium-card p-8 rounded-2xl md:col-span-2 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-10 h-10 rounded-lg bg-draveonPurple/10 text-draveonPurple flex items-center justify-center mb-6">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-['Outfit'] text-2xl font-bold text-slate-950 dark:text-white mb-3">Custom Web Apps</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 font-medium max-w-xl">
                  Modern frontend platforms built using Next.js, TypeScript, and Tailwind CSS. We construct highly optimized client portals designed for SEO compliance, load speeds, and fluid responsive behaviors.
                </p>
              </div>
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-draveonPurple" /> Next.js / React / SSG / Vercel Edge</div>
            </div>
            
            {/* Card 2: Square */}
            <div className="premium-card p-8 rounded-2xl flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-10 h-10 rounded-lg bg-draveonBlue/10 text-draveonBlue flex items-center justify-center mb-6">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-['Outfit'] text-xl font-bold text-slate-950 dark:text-white mb-3">AI & Automation</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                  Custom retrieval chatbot configurations (RAG) and workflow automation. Multi-key rotation balances query load across OpenRouter / Groq.
                </p>
              </div>
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-draveonBlue" /> API Rotator / RAG</div>
            </div>
            
            {/* Card 3: Square */}
            <div className="premium-card p-8 rounded-2xl flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 flex items-center justify-center mb-6">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-['Outfit'] text-xl font-bold text-slate-950 dark:text-white mb-3">Mobile & ERP Core</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                  Bespoke databases built with SQLite/PostgreSQL, school management tools, and cross-platform native iOS & Android applications.
                </p>
              </div>
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-slate-400" /> React Native / SQL</div>
            </div>

            {/* Card 4: Wide */}
            <div className="premium-card p-8 rounded-2xl md:col-span-2 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-['Outfit'] text-2xl font-bold text-slate-950 dark:text-white mb-3">Database Architecture</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 font-medium max-w-xl">
                  Robust SQLite and PostgreSQL schemas built to support active data pipelines. Includes automated backup releases, migration templates, and rapid endpoint indexing for high-scale enterprise query load.
                </p>
              </div>
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> PostgreSQL / SQLite / Indexed Models</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section (Alternating Showcases) */}
      <section id="portfolio" className="py-32 max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-left mb-24 space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Studies</span>
          <h2 className="font-['Outfit'] text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
            Featured Case Studies
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Explore a curated selection of enterprise integrations and high-performance software builds.
          </p>
        </div>

        {/* Minimal Category Pills */}
        <div className="flex flex-wrap gap-2 mb-20">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                selectedCategory === category
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white'
                  : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Alternating Project Blocks */}
        <div className="space-y-32">
          {filteredProjects.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={project.id}
                className="grid md:grid-cols-2 gap-16 items-center"
              >
                {/* Visual Graphic Block */}
                <div className={`premium-card p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/20 border border-slate-200/80 dark:border-slate-800/80 h-[280px] flex flex-col justify-between font-mono text-[10px] text-slate-400 ${!isEven ? 'md:order-2' : ''}`}>
                  <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
                    <span className="font-bold text-slate-500 uppercase">{project.category}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  
                  <div className="space-y-1.5 flex-1 pt-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project Scope:</p>
                    <p className="font-sans font-medium">{project.description}</p>
                  </div>

                  <div className="flex gap-2">
                    {project.technology.map((tech) => (
                      <span key={tech} className="bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Text Content Block */}
                <div className="space-y-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.badge}</span>
                  <h3 className="font-['Outfit'] text-3xl font-extrabold text-slate-950 dark:text-white leading-none">{project.title}</h3>
                  
                  {/* Spec table */}
                  <div className="w-full border-y border-slate-100 dark:border-slate-900 py-4 my-6 font-mono text-xs text-slate-400 space-y-2">
                    {project.specTable?.map((spec) => (
                      <div key={spec.key} className="flex justify-between border-b border-slate-50 dark:border-slate-900/40 pb-1.5">
                        <span className="uppercase text-[9px] tracking-wider text-slate-500">{spec.key}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{spec.val}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveProject(project)}
                    className="bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-slate-950 px-6 py-3 rounded-full font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                  >
                    View Case Study <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right-Sliding Inspector Drawer Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
            {/* Click closer overlay */}
            <div className="absolute inset-0" onClick={() => setActiveProject(null)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col justify-between z-10 text-slate-900 dark:text-slate-100"
            >
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto pt-10 space-y-8">
                <div>
                  <span className="text-[10px] font-bold text-draveonPurple uppercase tracking-widest bg-draveonPurple/5 px-2.5 py-1 rounded-full inline-block mb-3">
                    {activeProject.category}
                  </span>
                  <h3 className="font-['Outfit'] text-3xl font-black text-slate-950 dark:text-white leading-tight">
                    {activeProject.title}
                  </h3>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">
                  {activeProject.description}
                </p>

                {/* Spec Box */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-3 font-mono text-xs text-slate-400">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 border-b border-slate-100 dark:border-slate-800 pb-2">Technical Properties</h4>
                  {activeProject.specTable?.map((spec) => (
                    <div key={spec.key} className="flex justify-between border-b border-slate-100/40 dark:border-slate-900/40 pb-1.5">
                      <span className="uppercase text-[9px] tracking-wider text-slate-500">{spec.key}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{spec.val}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Deliverables</h4>
                  <div className="grid gap-3">
                    {activeProject.features?.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inspector Footer */}
              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6 mt-8 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span>{activeProject.footer || "Case Study Specs"}</span>
                <span className="text-slate-300 dark:text-slate-700">DRAVEON RELEASE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Company Detail Section */}
      <section id="about" className="py-32 max-w-6xl mx-auto px-6 border-t border-slate-100 dark:border-slate-900 relative z-10">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          <div className="md:col-span-3 space-y-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Our Story</span>
            <h2 className="font-['Outfit'] text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">Modern Digital Architecture</h2>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-semibold">
              <p>
                DRAVEON is a modern engineering agency founded by Sri Mahadevan and Rajkumar. We design, configure, and release high-performance customized digital platforms.
              </p>
              <p>
                By using our decoupled Next.js + FastAPI Microservices stack, we deliver native responsiveness, absolute page optimization, and seamless SQL database records security.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 dark:border-slate-900">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-draveonBlue" /> SQLite / PostgreSQL Security</span>
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-draveonPurple" /> Decoupled Stack API</span>
            </div>
          </div>
          
          <div className="md:col-span-2 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-6">
            <h3 className="font-['Outfit'] text-xl font-bold text-slate-950 dark:text-white mb-2">Our Operating Coordinates</h3>
            
            <div className="space-y-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <span>Front Engineering</span>
                <span className="text-slate-900 dark:text-white text-xs font-sans">Next.js / Tailwind</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <span>Back Orchestration</span>
                <span className="text-slate-900 dark:text-white text-xs font-sans">FastAPI / Uvicorn</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <span>AI Rotation Pool</span>
                <span className="text-slate-900 dark:text-white text-xs font-sans">OpenRouter / RAG</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Core Databases</span>
                <span className="text-slate-900 dark:text-white text-xs font-sans">SQLite / PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Step Section */}
      <section id="process" className="py-32 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/60 dark:border-slate-800/60 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left max-w-2xl mb-24 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Execution Model</span>
            <h2 className="font-['Outfit'] text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">Our Technical Flow</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">How we take parameters and formulate active platform code releases.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-slate-400">01 / BRIEF</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Parameters Brief</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">Submit project details through our dynamic enquiry engine.</p>
            </div>
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-slate-400">02 / DEVEL</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Code & Test</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">FastAPI backend and Next.js frontend code development.</p>
            </div>
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-slate-400">03 / CONFIG</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Key Config</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">Setting up database parameters and API rotation pools.</p>
            </div>
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-slate-400">04 / DEPLOY</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Launch</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">Rolling updates and deployment releases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="py-32 max-w-4xl mx-auto px-6 border-t border-slate-100 dark:border-slate-900 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">FAQ</span>
          <h2 className="font-['Outfit'] text-4xl font-black text-slate-950 dark:text-white tracking-tight">Common Questions</h2>
        </div>
        
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="border-b border-slate-150 dark:border-slate-800/80 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full py-6 text-left flex items-center justify-between font-bold text-slate-950 dark:text-white text-base hover:text-slate-500 dark:hover:text-slate-400 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform duration-300 text-slate-400 text-xs ${isOpen ? 'rotate-180 text-slate-950 dark:text-white' : ''}`}>
                    ▼
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="pb-6 pt-1 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 py-20 text-center text-xs text-slate-500 dark:text-slate-400 relative z-10">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <Logo className="w-6 h-6 shrink-0" />
            <span className="font-['Outfit'] text-lg font-bold text-slate-950 dark:text-white tracking-tight leading-none">DRAVEON</span>
          </div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Build • Automate • Innovate</p>
          <p className="text-[10px] text-slate-400">© {new Date().getFullYear()} DRAVEON. All rights reserved. Designed worldwide for enterprise scale.</p>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatbotWidget />

      {/* Sidebar Panel */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    </div>
  );
}
