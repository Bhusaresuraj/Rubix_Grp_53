"use client";
import React from "react";
import { motion } from "framer-motion";
import { Database, Factory, Landmark, ArrowRightLeft, Zap, ShieldCheck, Eye, Globe, Cpu } from "lucide-react";

// Reusable Feature Box with enhanced styling
const FeatureBox = ({ icon: Icon, title, subtitle, features, color, align }) => (
  <div className={`relative group backdrop-blur-md bg-slate-900/60 border border-${color}-500/20 p-8 rounded-3xl hover:bg-slate-800/80 transition-all duration-500 shadow-xl shadow-${color}-900/10 overflow-hidden`}>
    {/* Subtle background glow based on color */}
    <div className={`absolute inset-0 bg-gradient-to-br from-${color}-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    
    <div className={`relative z-10 flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
      <div className={`p-4 bg-${color}-500/20 rounded-2xl mb-4 shadow-[0_0_20px_rgba(var(--color-${color}-500),0.3)] inline-block`}>
        <Icon size={32} className={`text-${color}-400`} />
      </div>
      <h4 className="text-xl font-black text-white mb-1">{title}</h4>
      <p className={`text-xs text-${color}-400 font-bold uppercase tracking-widest mb-6`}>{subtitle}</p>
    </div>
    
    <ul className="space-y-4 relative z-10">
      {features.map((feature, idx) => (
        <li key={idx} className={`flex items-start gap-3 text-sm text-slate-300 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
          <div className={`mt-0.5 shrink-0 p-1 bg-${color}-500/20 rounded-full text-${color}-400`}>{feature.icon}</div>
          <span>{feature.text}</span>
        </li>
      ))}
    </ul>
    
    {/* High-tech corner accent */}
    <div className={`absolute bottom-0 ${align === 'right' ? 'left-0' : 'right-0'} p-4 opacity-30`}>
      <Cpu size={24} className={`text-${color}-500`} />
    </div>
  </div>
);

// Animated Data Particles for SVG paths
const ParticleStream = ({ color, delay, path, reverse }) => (
  <motion.circle
    r="3"
    fill={`var(--color-${color}-400)`}
    filter={`url(#glow-${color})`}
    style={{ offsetPath: `path('${path}')` }}
    animate={{ offsetDistance: reverse ? ["100%", "0%"] : ["0%", "100%"] }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: delay }}
  />
);

export default function CentralizedImpact() {
  return (
    <section className="py-40 bg-slate-950 relative overflow-hidden perspective-1000">
        {/* DEFINE COLORS for Tailwind JIT interpolation */}
        <span className="hidden text-amber-400 bg-amber-500/20 border-amber-500/20 shadow-amber-900/10 from-amber-600/10 text-amber-500"></span>
        <span className="hidden text-blue-400 bg-blue-500/20 border-blue-500/20 shadow-blue-900/10 from-blue-600/10 text-blue-500"></span>

      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block mb-4 px-4 py-2 rounded-full bg-slate-800/80 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
              System Architecture
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Single Source</span> <br/> of Truth.
            </h2>
          </motion.div>
        </div>

        {/* MAIN ARCHITECTURE GRID With "Tilt" effect via vertical offsets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative">
          
          {/* === LEFT WING: ORGANIZATION (Pushed Down) === */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="lg:mt-24 relative z-10"
          >
            <FeatureBox 
              icon={Factory}
              title="Mining Operator"
              subtitle="Data Source & Strategy"
              color="amber"
              align="right"
              features={[
                { icon: <ArrowRightLeft size={14}/>, text: "Instant Input: Log Diesel/Grid usage directly into the ledger." },
                { icon: <Zap size={14}/>, text: "AI Strategy: Receive real-time mitigation pathways based on DB trends." },
              ]}
            />
            {/* HUD Element */}
            <div className="absolute -top-8 right-4 text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">
              Status: Uplink Active
            </div>
          </motion.div>

          {/* === CENTER STAGE: THE CENTRAL DATABASE (Elevated & Complex Animation) === */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center relative z-20 -mt-12 lg:-mt-24"
          >
            {/* The Glowing Core Structure */}
            <div className="relative w-64 h-64 flex items-center justify-center">
               {/* Outer rotating ring */}
              <motion.div 
                animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30"
              ></motion.div>
               {/* Inner counter-rotating ring */}
               <motion.div 
                animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-2 border-dotted border-teal-400/40"
              ></motion.div>

              {/* The Core Sphere */}
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-600 to-slate-900 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.5)] border border-emerald-400/50 relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30 mix-blend-overlay animate-pulse-slow"></div>
                <Database size={64} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-20" />
                {/* Scanning effect */}
                <motion.div
                  animate={{ top: ["100%", "-100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute w-full h-2 bg-emerald-400/30 blur-md"
                ></motion.div>
              </div>
            </div>
            
            <div className="text-center mt-10 relative">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">Centralized Ledger</h3>
              <p className="text-emerald-400 text-sm font-bold mt-2 flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Immutable & Synchronized
              </p>
               {/* Holographic Base */}
               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-64 h-12 bg-emerald-500/20 blur-xl rounded-[100%]"></div>
            </div>
          </motion.div>

          {/* === RIGHT WING: GOVERNMENT (Pushed Down) === */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="lg:mt-24 relative z-10"
          >
            <FeatureBox 
              icon={Landmark}
              title="Regulatory Body"
              subtitle="Oversight & Verification"
              color="blue"
              align="left"
              features={[
                { icon: <Eye size={14}/>, text: "Real-Time Oversight: Monitor compliance heatmaps instantly." },
                { icon: <Globe size={14}/>, text: "National View: Aggregate data for policy making." },
              ]}
            />
             {/* HUD Element */}
             <div className="absolute -top-8 left-4 text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">
              Status: Monitoring Live
            </div>
          </motion.div>

          {/* === THE DATA HIGHWAYS (SVG CONNECTORS) === */}
          {/* This sits behind the content layers */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
             <svg width="100%" height="100%" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                <defs>
                   {/* Glow filters for particles */}
                   <filter id="glow-amber"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                   <filter id="glow-blue"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                
                {/* Left Highway (Amber - Ingress) */}
                {/* Using Bezier curves to create the "tilted" perspective connection */}
                <path id="left-path-1" d="M 300 350 C 450 350, 500 250, 600 250" stroke="url(#grad-amber)" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.3" />
                <ParticleStream path="M 300 350 C 450 350, 500 250, 600 250" color="amber" delay={0} />
                <ParticleStream path="M 300 350 C 450 350, 500 250, 600 250" color="amber" delay={2} />

                {/* Right Highway (Blue - Egress) */}
                <path id="right-path-1" d="M 600 250 C 700 250, 750 350, 900 350" stroke="url(#grad-blue)" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.3" />
                {/* Reverse direction for egress */}
                <ParticleStream path="M 600 250 C 700 250, 750 350, 900 350" color="blue" delay={1} reverse={true} />
                <ParticleStream path="M 600 250 C 700 250, 750 350, 900 350" color="blue" delay={3} reverse={true} />

                {/* Gradients for the paths */}
                <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0" /><stop offset="50%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></linearGradient>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0" /><stop offset="50%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></linearGradient>
             </svg>
          </div>

        </div>
      </div>
    </section>
  );
}