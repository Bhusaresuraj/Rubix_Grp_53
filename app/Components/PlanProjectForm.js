"use client";
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function PlanProjectForm({ mineId }) {
  const [target, setTarget] = useState({ year: 2030, offset: 0 });
  const supabase = createClient();

  const handlePlan = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('afforestation_plans').insert([{
      location_id: mineId,
      target_year: target.year,
      estimated_offset: target.offset,
      recommended: true
    }]);

    if (!error) alert("New Neutrality Plan Saved!");
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 mb-4">Set Neutrality Target</h3>
      <form onSubmit={handlePlan} className="space-y-4">
        <input 
          type="number" placeholder="Target Year (e.g. 2030)" 
          className="w-full bg-slate-50 p-3 rounded-xl border-none text-sm"
          onChange={(e) => setTarget({...target, year: Number(e.target.value)})}
        />
        <input 
          type="number" placeholder="Estimated Offset (Tons)" 
          className="w-full bg-slate-50 p-3 rounded-xl border-none text-sm"
          onChange={(e) => setTarget({...target, offset: Number(e.target.value)})}
        />
        <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition">
          Create Strategic Plan
        </button>
      </form>
    </div>
  );
}