"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function EmissionTrend({ logs }) {
  // Aggregate logs by date to show daily totals
  const dailyData = (logs || []).reduce((acc, curr) => {
    const date = new Date(curr.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const impact = (curr.diesel_liters * 2.68) + (curr.electricity_kwh * 0.71);
    
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.impact += impact;
    } else {
      acc.push({ date, impact });
    }
    return acc;
  }, []).reverse();

  const avgImpact = dailyData.reduce((a, b) => a + b.impact, 0) / (dailyData.length || 1);

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800">Emission Velocity</h3>
        <p className="text-slate-400 text-sm mt-1">Daily gross CO2-e tonnage across all operational scopes.</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            {/* Average Line to highlight over-performance */}
            <ReferenceLine y={avgImpact} stroke="#CBD5E1" strokeDasharray="3 3" label={{ position: 'right', value: 'AVG', fill: '#94A3B8', fontSize: 10 }} />
            <Line 
              type="monotone" 
              dataKey="impact" 
              stroke="#F43F5E" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#F43F5E', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}