'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Cpu, Smartphone, Check, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function BrandShowcaseWheel() {
  const [hoveredNode, setHoveredNode] = useState<'build' | 'automate' | 'innovate' | null>(null);

  const nodeDetails = {
    build: {
      title: "BUILD",
      tagline: "Next-Gen Web Platforms",
      desc: "Constructing modular frontend systems using Next.js, React, Tailwind CSS, and Framer Motion animations. Optimized for native speed, SEO compliance, and fluid layouts.",
      tech: ["Next.js / React", "TypeScript", "Tailwind CSS", "SEO Optimization"],
      color: "from-draveonPurple to-draveonPurple-light",
      accentColor: "#7B2CBF"
    },
    automate: {
      title: "AUTOMATE",
      tagline: "AI Orchestration Pipelines",
      desc: "Engineering decoupled Python FastAPI microservices with vector search embeddings (RAG) and intelligent multi-key OpenRouter / Groq API rotation pools.",
      tech: ["FastAPI / Python", "Vector DB (RAG)", "API Rotation Pool", "Groq / OpenAI"],
      color: "from-draveonPurple to-draveonBlue",
      accentColor: "#00B4D8"
    },
    innovate: {
      title: "INNOVATE",
      tagline: "Native & Secure Database Cores",
      desc: "Configuring robust SQLite and PostgreSQL database schemas, workflow automation, and cross-platform native iOS & Android applications.",
      tech: ["SQLite / Postgres", "Native Apps", "ERP / CRM Core", "Security Schemas"],
      color: "from-draveonBlue to-draveonBlue-light",
      accentColor: "#48CAE4"
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 relative px-4">
      {/* Ambient background glow matching the brand theme */}
      <div className="absolute inset-0 bg-gradient-to-tr from-draveonPurple/10 to-draveonBlue/10 rounded-3xl blur-[40px] opacity-60 z-0" />
      
      <div className="premium-card rounded-3xl p-6 md:p-10 shadow-2xl relative z-10 border border-slate-200/80 dark:border-slate-800/80">
        
        {/* Header decoration */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs font-bold text-slate-400 ml-2 tracking-wider">DRAVEON IDENTITY ORBIT HUB</span>
          </div>
          <span className="text-[9px] font-bold text-draveonPurple dark:text-draveonBlue bg-draveonPurple/5 dark:bg-draveonPurple/15 border border-draveonPurple/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Logo Orbit Theme
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Orbital Showcase Wheel */}
          <div className="flex justify-center items-center relative h-[300px]">
            {/* Center Brand Logo Container */}
            <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200/60 dark:border-slate-800/80 flex items-center justify-center shadow-xl relative z-20 group">
              <div className="absolute inset-0.5 rounded-full bg-logo-gradient opacity-10 blur-sm group-hover:opacity-30 transition-opacity duration-300" />
              <Logo className="w-16 h-16 object-contain relative z-10 animate-pulse duration-[3000ms]" />
            </div>

            {/* Orbit Ring 1 (Inner - Build) */}
            <div 
              onMouseEnter={() => setHoveredNode('build')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute w-52 h-52 rounded-full border border-dashed border-slate-200 dark:border-slate-800/60 animate-spin duration-[20s] cursor-pointer"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-draveonPurple flex items-center justify-center shadow-md hover:scale-125 transition-transform">
                <Layers className="w-3 h-3 text-draveonPurple" />
              </div>
            </div>

            {/* Orbit Ring 2 (Middle - Automate) */}
            <div 
              onMouseEnter={() => setHoveredNode('automate')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute w-72 h-72 rounded-full border border-dashed border-slate-200 dark:border-slate-800/60 animate-spin duration-[30s] reverse-spin cursor-pointer"
            >
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-draveonBlue flex items-center justify-center shadow-md hover:scale-125 transition-transform">
                <Cpu className="w-3 h-3 text-draveonBlue" />
              </div>
            </div>

            {/* Orbit Ring 3 (Outer - Innovate) */}
            <div 
              onMouseEnter={() => setHoveredNode('innovate')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-slate-200 dark:border-slate-800/60 animate-spin duration-[40s] cursor-pointer"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-draveonBlue-light flex items-center justify-center shadow-md hover:scale-125 transition-transform">
                <Smartphone className="w-3 h-3 text-draveonBlue-light" />
              </div>
            </div>

            {/* Label overlays pointing to nodes */}
            <span 
              onClick={() => setHoveredNode('build')}
              className={`absolute top-4 left-[20%] text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md cursor-pointer transition-all duration-300 ${
                hoveredNode === 'build' ? 'border-draveonPurple bg-draveonPurple/10 text-draveonPurple' : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500'
              }`}
            >
              Build
            </span>
            <span 
              onClick={() => setHoveredNode('automate')}
              className={`absolute right-4 top-[35%] text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md cursor-pointer transition-all duration-300 ${
                hoveredNode === 'automate' ? 'border-draveonBlue bg-draveonBlue/10 text-draveonBlue' : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500'
              }`}
            >
              Automate
            </span>
            <span 
              onClick={() => setHoveredNode('innovate')}
              className={`absolute bottom-4 left-[25%] text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md cursor-pointer transition-all duration-300 ${
                hoveredNode === 'innovate' ? 'border-draveonBlue-light bg-draveonBlue/10 text-draveonBlue-light' : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-500'
              }`}
            >
              Innovate
            </span>
          </div>

          {/* Right Column: Dynamic Description Panel */}
          <div className="h-[260px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {hoveredNode ? (
                <motion.div
                  key={hoveredNode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      style={{ backgroundColor: nodeDetails[hoveredNode].accentColor }}
                      className="w-2.5 h-6 rounded-full" 
                    />
                    <div>
                      <h4 className="font-['Outfit'] text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                        {nodeDetails[hoveredNode].title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-1">
                        {nodeDetails[hoveredNode].tagline}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
                    {nodeDetails[hoveredNode].desc}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                    {nodeDetails[hoveredNode].tech.map((t) => (
                      <div key={t} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-350">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center md:text-left space-y-4"
                >
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Logo className="w-8 h-8 object-contain" />
                    <h4 className="font-['Outfit'] text-xl font-extrabold text-slate-900 dark:text-white">DRAVEON CORE</h4>
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
                    Hover over the outer orbiting nodes (**Build**, **Automate**, or **Innovate**) to trace how Draveon leverages its decoupled microservices stack to configure enterprise digital ecosystems.
                  </p>

                  <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-draveonPurple bg-draveonPurple/5 dark:bg-draveonPurple/15 border border-draveonPurple/10 px-3 py-1.5 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 text-draveonBlue" /> Hover orbits to inspect
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
