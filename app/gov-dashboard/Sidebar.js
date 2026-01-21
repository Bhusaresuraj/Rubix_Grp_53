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
  Calculator,
  CalendarCheck,
  Pickaxe,
} from "lucide-react";

export default function GovSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view");

  const menu = [
    {
      label: "National Overview",
      icon: LayoutDashboard,
      path: "/gov-dashboard",
      view: null,
    },
    {
      label: "Organization Analysis",
      icon: Building2,
      path: "/gov-dashboard?view=OrganizationAnalysis",
      view: "OrganizationAnalysis",
    },
    {
      label: "Plantation History",
      icon: Trees,
      path: "/gov-dashboard?view=plantation",
      view: "plantation",
    },
    {
      label: "Emission Trends",
      icon: TrendingUp,
      path: "/gov-dashboard?view=emissions",
      view: "emissions",
    },
    {
      label: "Compliance Status",
      icon: AlertTriangle,
      path: "/gov-dashboard?view=compliance",
      view: "compliance",
    },
    {
      label: "Geographical View",
      icon: MapPinned,
      path: "/gov-dashboard?view=map",
      view: "map",
    },
    {
      label: "Cost-Benefit Analysis",
      icon: Calculator,
      path: "/gov-dashboard?view=cost-benefit",
      view: "cost-benefit",
    },
    {
      label: "Compliance Calendar",
      icon: CalendarCheck,
      path: "/gov-dashboard?view=compliance-calendar",
      view: "compliance-calendar",
    },
    {
      label: "Extracted Resources",
      icon: Pickaxe,
      path: "/gov-dashboard?view=extracted-resources",
      view: "extracted-resources",
    },
  ];

  return (
    <aside className="w-[280px] min-h-screen bg-slate-800 text-white flex flex-col px-6 py-8">
      {/* BRAND */}
      <div className="flex items-center gap-3 mb-10">
        <ShieldCheck className="text-emerald-400" size={32} />
        <h1 className="text-xl font-black tracking-wide">Gov Panel</h1>
      </div>

      {/* WELCOME */}
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

      {/* NAV */}
      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const isActive =
            item.view === null
              ? pathname === "/gov-dashboard" && !currentView
              : currentView === item.view;

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition
                ${
                  isActive
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

      {/* FOOTER */}
      <div className="mt-8 text-xs text-slate-400 border-t border-slate-700 pt-4">
        Ministry of Coal & Energy
        <br />
        Government of India
      </div>
    </aside>
  );
}
