"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendChart({ logs }) {
  const data = (logs || []).map(log => ({
    date: log.recorded_at,
    emissions: ((log.diesel_liters * 2.68 + log.electricity_kwh * 0.82) / 1000).toFixed(2)
  })).reverse();

  return (
    <div className="h-[300px] w-full mt-8">
      <h3 className="text-slate-400 text-[10px] uppercase font-bold mb-4">Emission Intensity Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
          <YAxis stroke="#64748b" fontSize={10} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
          <Area type="monotone" dataKey="emissions" stroke="#ef4444" fillOpacity={1} fill="url(#colorE)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}