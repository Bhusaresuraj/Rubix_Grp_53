// "use client";
// import React, { useState } from 'react';
// import { createClient } from '@/utils/supabase/client';

// export default function PlanProjectForm({ mineId }) {
//   const [target, setTarget] = useState({ year: 2030, offset: 0 });
//   const supabase = createClient();

//   const handlePlan = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.from('afforestation_plans').insert([{
//       location_id: mineId,
//       target_year: target.year,
//       estimated_offset: target.offset,
//       recommended: true
//     }]);

//     if (!error) alert("New Neutrality Plan Saved!");
//   };

//   return (
//     <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//       <h3 className="text-sm font-bold text-slate-800 mb-4">Set Neutrality Target</h3>
//       <form onSubmit={handlePlan} className="space-y-4">
//         <input 
//           type="number" placeholder="Target Year (e.g. 2030)" 
//           className="w-full bg-slate-50 p-3 rounded-xl border-none text-sm"
//           onChange={(e) => setTarget({...target, year: Number(e.target.value)})}
//         />
//         <input 
//           type="number" placeholder="Estimated Offset (Tons)" 
//           className="w-full bg-slate-50 p-3 rounded-xl border-none text-sm"
//           onChange={(e) => setTarget({...target, offset: Number(e.target.value)})}
//         />
//         <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition">
//           Create Strategic Plan
//         </button>
//       </form>
//     </div>
//   );
// }


"use client";
import React, { useState } from 'react';
import { useCoal } from "../context/CoalContext";
import { createClient } from '@/utils/supabase/client';
import { Target, Zap, ChevronDown } from 'lucide-react';

export default function PlanProjectForm({ mineId }) {
  const { fetchData } = useCoal();
  const [plan, setPlan] = useState({ year: 2030, offset: 0, species: 'Teak' });
  const supabase = createClient();
   const [target, setTarget] = useState({ year: 2030, offset: 0 });
  // const handlePlan = async (e) => {
  //   e.preventDefault();
  //   const { error } = await supabase.from('afforestation_plans').insert([{
  //     location_id: mineId,
  //     target_year: plan.year,
  //     estimated_offset: plan.offset,
  //     primary_plant_species: plan.species,
  //     recommended: true
  //   }]);


  const handlePlan = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('afforestation_plans').insert([{
      location_id: mineId,
      target_year: target.year,
      estimated_offset: target.offset,
   
      recommended: true
    }]);

    
  
    if (!error) {
      alert("Plan Securely Logged!");
      fetchData(); // Refresh the graph and ledger immediately
    }
  };


  //   const [target, setTarget] = useState({ year: 2030, offset: 0 });
//   const supabase = createClient();

//   const handlePlan = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.from('afforestation_plans').insert([{
//       location_id: mineId,
//       target_year: target.year,
//       estimated_offset: target.offset,
//       recommended: true
//     }]);

//     if (!error) alert("New Neutrality Plan Saved!");
//   };
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50">
      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
        <Target className="text-emerald-500" size={20} /> Strategic Planning
      </h3>
      
      <form onSubmit={handlePlan} className="space-y-5">
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Select Target Species</label>
          <select 
            className="w-full bg-slate-50 p-4 rounded-2xl appearance-none border-none text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
            onChange={(e) => setPlan({...plan, species: e.target.value})}
          >
            <option value="Teak">Indian Teak (Best for Timber)</option>
            <option value="Bamboo">Bamboo (Rapid Restoration)</option>
            <option value="Sal">Sal Tree (High Density Sink)</option>
            <option value="Neem">Neem (Hardy & Medicinal)</option>
          </select>
          <ChevronDown className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" size={16} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Target Year</label>
            <input 
              type="number" placeholder="2030" 
              className="w-full bg-slate-50 p-4 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setPlan({...plan, year: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Offset (Tons)</label>
            <input 
              type="number" placeholder="500" 
              className="w-full bg-slate-50 p-4 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setPlan({...plan, offset: Number(e.target.value)})}
            />
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 group">
          Commit to Strategy <Zap size={16} className="group-hover:text-yellow-400 transition-colors" />
        </button>
      </form>
    </div>
  );
}