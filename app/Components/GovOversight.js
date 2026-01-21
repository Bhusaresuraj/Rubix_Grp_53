"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Map, database, TreePine, Coins, Maximize, Activity } from "lucide-react";

// Individual Gold Bar for the background map
const MapGold = ({ top, left, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 0.6, scale: 1 }} transition={{ delay }}
    className="absolute w-12 h-5 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-sm shadow-lg border-b-2 border-amber-800 pointer-events-none"
    style={{ top, left, transform: 'rotateX(45deg) rotateZ(-20deg)' }}
  />
);

// Individual Tree for the background map
const MapTree = ({ top, left, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 0.8, scale: 1 }} transition={{ delay }}
    className="absolute pointer-events-none text-emerald-500/40"
    style={{ top, left }}
  >
    <TreePine size={24} className="drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
  </motion.div>
);

export default function GovOversight() {
  return (
    <section className="py-40 bg-slate-950 relative overflow-hidden flex items-center justify-center">
      
      {/* --- BACKGROUND: THE 3D DATA LANDSCAPE --- */}
      <div className="absolute inset-0 z-0 perspective-1000 opacity-40">
        <motion.div 
          animate={{ rotateX: [15, 18, 15], rotateZ: [-5, -8, -5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          {/* Grid Floor */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:100px_100px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20"></div>

          {/* Mining Zone Alpha (Gold Clusters) */}
          <MapGold top="20%" left="15%" delay={0.1} />
          <MapGold top="22%" left="18%" delay={0.2} />
          <MapGold top="18%" left="20%" delay={0.3} />
          
          {/* Restoration Zone Beta (Tree Clusters) */}
          <MapTree top="60%" left="70%" delay={0.4} />
          <MapTree top="65%" left="75%" delay={0.5} />
          <MapTree top="58%" left="78%" delay={0.6} />
          <MapTree top="70%" left="65%" delay={0.7} />

          {/* Scanning Radar Line */}
          <motion.div 
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10"
          />
        </motion.div>
      </div>

      {/* --- FOREGROUND: THE GOV OVERSIGHT PANEL --- */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: THE LIVE DATA INTERFACE */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group"
        >
          {/* Tech HUD Detail */}
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <Activity className="text-blue-400 animate-pulse" size={40} />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Mine Oversight Panel</h3>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Target: MB-MINE-402</p>
            </div>
          </div>

          {/* THE HARD METRICS */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Operational Area</p>
                <h4 className="text-xl font-black text-white flex items-center gap-2"><Maximize size={16} className="text-blue-400"/> 420.5 <span className="text-xs font-normal">Ha</span></h4>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Est. Gold Reserve</p>
                <h4 className="text-xl font-black text-white flex items-center gap-2"><Coins size={16} className="text-amber-500"/> 12.4 <span className="text-xs font-normal">Tons</span></h4>
              </div>
            </div>

            <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Afforestation Progress</p>
                <span className="text-emerald-400 font-black">18,500 <span className="text-[10px]">Trees</span></span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} whileInView={{ width: "65%" }} transition={{ duration: 1.5 }}
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-slate-400 leading-relaxed italic">
            "Real-time visibility into mineral extraction versus environmental restoration ensures total accountability in the 2026 CCTS cycle."
          </p>
        </motion.div>

        {/* RIGHT: THE STATEMENT & ADVANTAGES */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Government Insight <br />
            <span className="text-blue-500 italic">Redefined.</span>
          </h2>
          
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Regulators no longer wait for annual reports. By seeing the physical relationship between **Mineral Assets** and **Green Assets**, oversight becomes immediate and undeniable.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-slate-300 font-bold">
              <div className="w-2 h-2 bg-blue-500 rounded-full" /> Full spatial visibility of gold/silver reserves.
            </li>
            <li className="flex items-center gap-4 text-slate-300 font-bold">
              <div className="w-2 h-2 bg-amber-500 rounded-full" /> Correlate mine profitability with emission intensity.
            </li>
            <li className="flex items-center gap-4 text-slate-300 font-bold">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Satellite-verified tree counts vs. logged claims.
            </li>
          </ul>

          <div className="pt-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
              Explore Regulatory Map <Map size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}