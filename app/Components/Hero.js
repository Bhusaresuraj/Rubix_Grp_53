"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, Database, UserCircle } from 'lucide-react';

// Animation variants for the text content flow
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.8, ease: "easeOut" }
  })
};

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden font-sans flex flex-col">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
         {/* BRAND NAME */}
         <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
         >
            <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-2 rounded-lg">
              <Leaf size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              SeeYour<span className="text-emerald-400">CO2</span>
            </h1>
         </motion.div>

         {/* LOGIN BUTTON */}
         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/login"> {/* Assuming you'll have a /login page later */}
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-bold text-sm text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 group">
                <UserCircle size={18} className="text-slate-300 group-hover:text-white transition-colors" />
                Login
              </button>
            </Link>
         </motion.div>
      </header>

      {/* --- BACKGROUND: THE "LIVING DATA" ANIMATION --- */}
      <div className="absolute inset-0 w-full h-full">
        {/* 1. The "Heat" Blob (Red/Amber - Emissions) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-rose-600/20 to-amber-600/20 rounded-full blur-[150px] mix-blend-screen opacity-70"
        />

        {/* 2. The "Cooling" Blob (Emerald/Teal - Solutions) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-tl from-emerald-600/30 to-teal-400/20 rounded-full blur-[150px] mix-blend-screen opacity-80"
        />

        {/* 3. NEW: Abstract Forest Silhouette Layer */}
        {/* Rises slowly from the bottom to indicate growth */}
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 2, ease: "easeOut" }}
           className="absolute bottom-0 left-0 w-full h-1/3 z-0 pointer-events-none"
        >
           {/* Using an SVG path for an abstract tree-line shape */}
           <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <motion.path 
                 animate={{ d: [
                    "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,176C672,160,768,160,864,176C960,192,1056,224,1152,229.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                 ] }}
                 transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                 fill="url(#treeGradient)" fillOpacity="1" 
              />
              <defs>
                 <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'rgb(6, 78, 59)', stopOpacity:0.4}} /> {/* Dark Emerald */}
                    <stop offset="100%" style={{stopColor:'rgb(13, 148, 136)', stopOpacity:0.2}} /> {/* Teal */}
                 </linearGradient>
              </defs>
           </svg>
        </motion.div>

        {/* 4. Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      </div>

      {/* --- FOREGROUND: HERO CONTENT --- */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6 text-center mt-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Compliance Badge */}
          <motion.div variants={contentVariants} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 bg-emerald-950/30 backdrop-blur-md border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-xl">
              <Leaf size={14} className="animate-pulse text-emerald-400" /> India CCTS 2026 Compliance Engine
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.div variants={contentVariants} initial="hidden" animate="visible" custom={1}>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
              Transforming Carbon <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 animate-gradient-x">
                Data into Decarbonization
              </span>
            </h1>
          </motion.div>

          {/* Sub-Headline */}
          <motion.div variants={contentVariants} initial="hidden" animate="visible" custom={2}>
            <p className="text-xl text-slate-300/80 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              A unified platform where mining operations and government regulators share a single source of truth to balance emissions with green assets.
            </p>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div 
            variants={contentVariants} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {/* Primary CTA */}
            <Link href="/dashboard" className="group relative px-8 py-4 bg-emerald-500 rounded-2xl font-bold text-lg text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="flex items-center gap-2">
                Operator Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </span>
            </Link>

            {/* Secondary CTA */}
            <Link href="/gov-dashboard" className="px-8 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl font-bold text-lg text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-3">
              <Database size={20} className="text-blue-400" /> Regulatory Portal
            </Link>
          </motion.div>

        </div>
      </div>

      {/* CSS for gradient text animation */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 5s linear infinite;
        }
      `}</style>
    </div>
  );
}