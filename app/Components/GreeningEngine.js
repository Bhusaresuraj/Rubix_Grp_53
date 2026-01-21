"use client";
import React from "react";
import { motion } from "framer-motion";
import { Database, Sprout, Wind, TreePine, BarChart, CheckCircle2 } from "lucide-react";

const BigTree = ({ icon: Icon, name, rate, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 50 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.8, type: "spring", stiffness: 100 }}
    className="flex flex-col items-center group relative"
  >
    {/* Floating Data Tag */}
    <div className="absolute -top-12 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Sequestration: {rate}</p>
    </div>

    {/* The Massive Tree Icon */}
    <div className={`p-10 rounded-[3rem] bg-gradient-to-b from-${color}-500/20 to-transparent border border-${color}-500/30 mb-6 shadow-2xl shadow-${color}-500/10 group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={120} className={`text-${color}-400 drop-shadow-[0_0_20px_rgba(var(--color-${color}-400),0.5)]`} />
    </div>

    <h4 className="text-xl font-black text-white">{name}</h4>
    <div className={`h-1 w-12 bg-${color}-500 mt-2 rounded-full`}></div>
  </motion.div>
);

export default function GreeningEngine() {
  return (
    <>
    <section className="py-40 bg-slate-950 relative overflow-hidden">
        {/* Color injection for Tailwind JIT */}
        <span className="hidden from-emerald-500/20 to-emerald-500 text-emerald-400"></span>
        <span className="hidden from-teal-500/20 to-teal-500 text-teal-400"></span>
        <span className="hidden from-green-500/20 to-green-500 text-green-400"></span>

      {/* --- BACKGROUND ROOT SYSTEM --- */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-10" viewBox="0 0 1440 800">
          <motion.path
            d="M 720 800 Q 720 400, 200 300 M 720 800 Q 720 400, 720 200 M 720 800 Q 720 400, 1240 300"
            stroke="#10B981" strokeWidth="4" fill="none"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        {/* Header Content */}
        <div className="max-w-3xl mx-auto mb-24">
          <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Greening Engine</span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
            Data that <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Breathes.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium">
            Our centralized database doesn't just count carbon—it manages the cure. By analyzing mine soil and local climate data, we automate the path to a lush, carbon-neutral future.
          </p>
        </div>

        {/* --- THE THREE PILLARS OF GROWTH (BIG ICONS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-32">
          <BigTree icon={Sprout} name="Neem (Azadirachta)" rate="25.4 kg/yr" delay={0.2} color="emerald" />
          <BigTree icon={TreePine} name="Bamboo (Bambusoideae)" rate="18.2 kg/yr" delay={0.4} color="teal" />
          <BigTree icon={Wind} name="Peepal (Ficus Religiosa)" rate="32.1 kg/yr" delay={0.6} color="green" />
        </div>

        {/* --- THE "DATABASE TO DIRT" LOGIC --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-left">
             <BarChart className="text-emerald-500 mb-4" size={32} />
             <h4 className="text-white font-bold text-lg mb-2">Species Optimization</h4>
             <p className="text-slate-400 text-sm">DB identifies the best tree species based on your specific mine-soil toxicity levels.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-left">
             <CheckCircle2 className="text-emerald-500 mb-4" size={32} />
             <h4 className="text-white font-bold text-lg mb-2">Survival Tracking</h4>
             <p className="text-slate-400 text-sm">Every sapling is geotagged in the database, allowing for satellite-verified survival audits.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-left">
             <Database className="text-emerald-500 mb-4" size={32} />
             <h4 className="text-white font-bold text-lg mb-2">Automated Greening</h4>
             <p className="text-slate-400 text-sm">Once the 'Gap Scorecard' hits a threshold, the system triggers a direct planting mandate.</p>
          </div>
        </div>

        {/* --- FINAL CALL TO ACTION --- */}
        <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-32 pt-12 border-t border-white/10"
        >
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 mb-6">
                    <Database size={32} />
                </div>
                <h3 className="text-2xl font-black text-white">One Database. A Billion Trees.</h3>
                <p className="text-slate-500 mt-2">SeeYourCO2: Bridging the industrial gap with biological capital.</p>
            </div>
        </motion.div>

      </div>
    </section>
    {/* --- HACKATHON CREDIT FOOTER --- */}
<motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mt-40 relative z-10"
>
    <div className="inline-flex flex-col items-center group">
        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all group-hover:border-emerald-500/50 group-hover:bg-white/10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                Developed by <span className="text-white font-black group-hover:text-emerald-400 transition-colors">Team Code_To_Solve</span>
            </p>
            <div className="w-[1px] h-4 bg-slate-700 mx-2" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                For Rubix '26 Hackathon
            </p>
        </div>
        
        {/* Subtle decorative elements below the credit */}
        <div className="mt-8 flex gap-8 opacity-20 group-hover:opacity-50 transition-opacity">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-white" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-white" />
        </div>
    </div>
</motion.div></>
  );
}