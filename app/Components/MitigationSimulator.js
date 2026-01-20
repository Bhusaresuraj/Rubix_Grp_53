"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Zap, Fuel, Leaf, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function MitigationSimulator({ logs, sinks }) {
  // Simulation States (Percentage or Absolute values)
  const [evTransition, setEvTransition] = useState(0); // 0-100% replacement of diesel
  const [solarShare, setSolarShare] = useState(0);     // 0-100% solar replacement
  const [treeTarget, setTreeTarget] = useState(0);     // Additional trees to plant

  const [aiAdvice, setAiAdvice] = useState("Analyzing your variables...");
  const [isTyping, setIsTyping] = useState(false);

  // 1. Calculate Baseline (Real Data)
  const realE = (logs || []).reduce((acc, curr) => acc + ((curr.diesel_liters * 2.68 + curr.electricity_kwh * 0.71) / 1000), 0);
  const realS = (sinks || []).reduce((acc, curr) => acc + (((curr.neem_count || 0) * 25 + (curr.bamboo_count || 0) * 18.2) / 1000), 0);

  // 2. Simulation Logic
  // Diesel: (Current Diesel * (1 - Transition%)) * Emission Factor
  // Solar: (Current Grid * (1 - Solar%)) * Emission Factor
  const simDiesel = (logs || []).reduce((acc, curr) => acc + ((curr.diesel_liters * (1 - evTransition/100) * 2.68) / 1000), 0);
  const simElec = (logs || []).reduce((acc, curr) => acc + ((curr.electricity_kwh * (1 - solarShare/100) * 0.71) / 1000), 0);
  const simSinks = realS + (treeTarget * 0.025); // Simplified: 25kg per new tree
const co2Saved = (realE - simDiesel).toFixed(1);

useEffect(() => {
    const timer = setTimeout(async () => {
      setIsTyping(true);
      const res = await fetch('/api/gemini', {
        method: 'POST',
        body: JSON.stringify({ evTransition, solarShare, co2Saved })
      });
      const data = await res.json();
      setAiAdvice(data.text);
      setIsTyping(false);
    }, 1000); // 1-second debounce
    
    return () => clearTimeout(timer);
  }, [evTransition, solarShare]);


  const chartData = [
    { name: 'Current Baseline', co2: parseFloat(realE.toFixed(2)), fill: '#94A3B8' },
    { name: 'Simulated Path', co2: parseFloat((simDiesel + simElec).toFixed(2)), fill: '#10B981' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Mitigation Lab</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Scenario Modeling Engine v2.0</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-600 transition shadow-lg shadow-slate-200">Save Strategy</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: THE STRATEGY CONSOLE (Functional Div) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Zap size={18} className="text-amber-500"/> Variable Controls</h4>
            
            {/* EV Transition Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2"><Fuel size={14}/> EV Fleet Transition</label>
                <span className="text-emerald-600 font-black text-sm">{evTransition}%</span>
              </div>
              <input type="range" min="0" max="100" value={evTransition} onChange={(e) => setEvTransition(e.target.value)} 
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>

            {/* Solar Transition Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2"><Zap size={14}/> Solar Grid Share</label>
                <span className="text-blue-600 font-black text-sm">{solarShare}%</span>
              </div>
              <input type="range" min="0" max="100" value={solarShare} onChange={(e) => setSolarShare(e.target.value)} 
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>

            {/* Afforestation Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2"><Leaf size={14}/> Addl. Trees</label>
                <span className="text-emerald-800 font-black text-sm">+{treeTarget.toLocaleString()}</span>
              </div>
              <input type="range" min="0" max="50000" step="500" value={treeTarget} onChange={(e) => setTreeTarget(e.target.value)} 
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-800" />
            </div>
          </div>
        </div>

        {/* CENTER: IMPACT PROJECTION (Main Div) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#64748B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} label={{ value: 'Tons CO2-e', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="co2" radius={[15, 15, 0, 0]} barSize={80}>
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>

          {/* AI GEMINI CONSULTANT (Information Div) */}
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400"><Sparkles size={24} /></div>
                   <div>
                      <h4 className="font-bold text-lg leading-none">Gemini Strategic Assessment</h4>
                      <p className="text-slate-400 text-xs mt-1">AI analyzing scenario feasibility...</p>
                   </div>
                </div>
                
                <div className="space-y-4 text-slate-300 text-sm leading-relaxed max-w-2xl">
                   <p>Based on a <span className="text-emerald-400 font-bold">{evTransition}% fleet transition</span>, you could reduce Scope 1 emissions by <span className="text-white font-bold">{(realE - simDiesel).toFixed(1)} tons</span>. This move aligns with the 2026 CCTS Tier 1 incentives.</p>
                   <p className="p-4 bg-white/5 rounded-2xl border border-white/10 italic">"Strategy Advice: Prioritize Solar Grid Share first. The ROI for grid decarbonization in Mira Bhayandar is 1.4x higher than immediate fleet replacement due to current energy tariffs."</p>
                </div>
             </div>
             <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className={`p-3 rounded-2xl ${isTyping ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  <Sparkles size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-lg">Gemini Strategic Assessment</h4>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                    {isTyping ? "Consulting Regulatory Framework..." : "Live Audit Feedback"}
                  </p>
               </div>
            </div>
            
            <div className={`space-y-4 text-slate-300 text-sm leading-relaxed transition-opacity duration-500 ${isTyping ? 'opacity-30' : 'opacity-100'}`}>
               <p className="font-medium text-white bg-white/5 p-6 rounded-2xl border border-white/10">
                 {aiAdvice}
               </p>
            </div>
         </div>
      </div>
        </div>
      </div>
    </div>
  );
}