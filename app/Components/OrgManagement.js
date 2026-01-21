"use client";
import React from "react";
import { motion } from "framer-motion";
import { Factory, Coins, Map, Activity, Layers, ArrowRight, Cpu, Maximize } from "lucide-react";

// Reusable Data Card appearing on the Holo-Screen
const DataCard = ({ icon: Icon, title, value, unit, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
    className={`bg-${color}-950/30 border border-${color}-500/30 p-4 rounded-xl backdrop-blur-md relative overflow-hidden group`}
  >
    {/* Background pulse effect */}
    <div className={`absolute inset-0 bg-${color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 bg-${color}-500/20 rounded-lg text-${color}-400`}>
        <Icon size={18} />
      </div>
      <span className={`text-${color}-200/70 text-xs font-bold uppercase tracking-wider`}>{title}</span>
    </div>
    <div className="flex items-end gap-2">
      <h4 className="text-2xl font-black text-white">{value}</h4>
      <span className={`text-${color}-400 text-sm font-bold mb-1`}>{unit}</span>
    </div>
    {/* subtle animated line at bottom */}
    <motion.div 
        animate={{ scaleX: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
        className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-${color}-500 to-transparent`}
    />
  </motion.div>
);

// Animated SVG Connector Line
const DataConnector = ({ from, toId, color, delay }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
            <filter id={`glow-${color}`}><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <motion.path
            d={from} // Simple straightish lines for industrial feel
            stroke={`var(--color-${color}-500)`} strokeWidth="2" fill="none" filter={`url(#glow-${color})`}
            strokeDasharray="10,10" opacity="0.4"
            animate={{ strokeDashoffset: [100, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay }}
        />
         <motion.circle r="3" fill={`var(--color-${color}-400)`} filter={`url(#glow-${color})`}>
            <animateMotion dur="2s" repeatCount="indefinite" delay={delay} path={from} />
        </motion.circle>
    </svg>
);


export default function OrgManagement() {
  return (
    <section className="py-40 bg-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Tailwind JIT color inclusion */}
      <span className="hidden from-rose-500 via-rose-500 to-rose-500 bg-rose-950/30 border-rose-500/30 text-rose-400 text-rose-200/70"></span>
      <span className="hidden from-amber-500 via-amber-500 to-amber-500 bg-amber-950/30 border-amber-500/30 text-amber-400 text-amber-200/70"></span>
      <span className="hidden from-slate-500 via-slate-500 to-slate-500 bg-slate-950/30 border-slate-500/30 text-slate-400 text-slate-200/70"></span>

      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[url('/circuit-board.svg')] bg-center opacity-5 animate-pulse-slow"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-overlay"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* --- LEFT: THE STATEMENT & VALUE PROP --- */}
        <div className="order-2 lg:order-1 space-y-8">
          <div>
             <span className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
               <Cpu size={14} /> Operational Hub
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Total Command <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-slate-300 to-amber-400">
                Over Every Metric.
              </span>
            </h2>
          </div>
          
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Silos slow you down. We unify your geological data, production output, and environmental impact into a single, real-time command interface.
          </p>

          <ul className="space-y-5">
            <li className="flex items-start gap-3 text-slate-300">
              <div className="p-1 bg-amber-500/20 rounded mt-1"><Coins size={16} className="text-amber-400"/></div>
              <div><strong className="text-white">Production vs. Pollution:</strong> See the exact carbon cost of every ounce of gold extracted.</div>
            </li>
             <li className="flex items-start gap-3 text-slate-300">
              <div className="p-1 bg-blue-500/20 rounded mt-1"><Map size={16} className="text-blue-400"/></div>
              <div><strong className="text-white">Territorial Oversight:</strong> Manage land use across hectares from one screen.</div>
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <div className="p-1 bg-rose-500/20 rounded mt-1"><Factory size={16} className="text-rose-400"/></div>
              <div><strong className="text-white">Proactive Compliance:</strong> Spot emission spikes before they become regulatory issues.</div>
            </li>
          </ul>

          <div className="pt-6">
            <button className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-3">
              Access Command Deck <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>


        {/* --- RIGHT: THE VISUAL COMMAND DECK --- */}
        <div className="order-1 lg:order-2 relative h-[500px] perspective-1000">
           
           {/* The Central Holo-Screen */}
           <motion.div
             initial={{ opacity: 0, scale: 0.9, rotateY: 15 }} whileInView={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 0.8 }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-slate-900/80 backdrop-blur-xl border-[3px] border-blue-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.2)] p-6 flex flex-col z-20 overflow-hidden"
           >
              {/* Screen Header */}
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                 <div className="flex items-center gap-2">
                    <Activity size={18} className="text-blue-400 animate-pulse"/>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Operations Feed</span>
                 </div>
                 <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 </div>
              </div>

              {/* The 3 Data Modules placed "inside" the screen */}
              <div className="grid grid-cols-1 gap-4 flex-1">
                 {/* 1. Territory (Blue/Slate) */}
                 <DataCard icon={Maximize} title="Active Territory" value="1,250" unit="Hectares" color="slate" delay={0.2} />
                 
                 {/* 2. Output (Amber/Gold) */}
                 <DataCard icon={Coins} title="YTD Yield (Au/Ag)" value="45.2" unit="Tons" color="amber" delay={0.4} />
                 
                 {/* 3. Pollution (Rose/Red) */}
                 <DataCard icon={Factory} title="Current Emissions" value="8,920" unit="tCO2e" color="rose" delay={0.6} />
              </div>

              {/* Subtle screen scanline overlay */}
              <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
           </motion.div>

           {/* Incoming Data Streams (Visual connectors feeding the screen) */}
           <div className="absolute inset-0 z-10">
              {/* Stream 1: Area (Top Left) */}
              <DataConnector from="M 0 100 L 150 200" color="slate" delay={0} />
              {/* Stream 2: Output (Mid Right) */}
              <DataConnector from="M 500 250 L 350 250" color="amber" delay={0.5} />
              {/* Stream 3: Pollution (Bottom Left) */}
              <DataConnector from="M 0 400 L 150 300" color="rose" delay={1} />
           </div>

        </div>
      </div>
    </section>
  );
}