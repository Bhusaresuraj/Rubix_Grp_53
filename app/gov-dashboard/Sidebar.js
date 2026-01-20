"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";


import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  Trees,
  TrendingUp,
  AlertTriangle,
  MapPinned,
} from "lucide-react";

export default function GovSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
  {
    label: "National Overview",
    icon: LayoutDashboard,
    path: "/gov-dashboard",
  },
  
  {
    label: "Organization Analysis",
    icon: Building2,
    path: "/gov-dashboard?view=OrganizationAnalysis",
  },
  {
    label: "Plantation History",
    icon: Trees,
    path: "/gov-dashboard?view=plantation",
  },
  {
    label: "Emission Trends",
    icon: TrendingUp,
    path: "/gov-dashboard?view=emissions",
  },
  {
    label: "Compliance Status",
    icon: AlertTriangle,
    path: "/gov-dashboard?view=compliance",
  },
  {
    label: "Geographical View",
    icon: MapPinned,
    path: "/gov-dashboard?view=map",
  },
];


  return (
    <aside className="w-[280px] min-h-screen bg-slate-800 text-white flex flex-col px-6 py-8">
      
      {/* ===== BRAND ===== */}
      <div className="flex items-center gap-3 mb-10">
        <ShieldCheck className="text-emerald-400" size={32} />
        <h1 className="text-xl font-black tracking-wide">
          Gov Panel
        </h1>
      </div>

      {/* ===== WELCOME CARD ===== */}
      <div className="bg-slate-700/60 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black">
            G
          </div>
          <div>
            <p className="text-xs text-slate-300">Welcome,</p>
            <p className="font-bold">Government</p>
          </div>
        </div>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition
                ${
                  active
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ===== FOOTER / AUTHORITY TAG ===== */}
      <div className="mt-8 text-xs text-slate-400 border-t border-slate-700 pt-4">
        Ministry of Coal & Energy  
        <br />
        Government of India
      </div>
    </aside>
  );
}
