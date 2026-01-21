"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Sidebar from "./Sidebar";
import OrganizationAnalysis from "./OrganizationAnalysis";
import PlantationHistory from "./PlantationHistory";
import CostBenefitAnalysis from "./CostBenefitAnalysis";
import ComplianceCalendar from "./ComplianceCalendar";
import { createClient } from "@/utils/supabase/client";
import { ShieldCheck, AlertTriangle, Search, FileText, MapPinned, ExternalLink } from "lucide-react";
import { jsPDF } from "jspdf";

export default function GovDashboard() {
  const [orgs, setOrgs] = useState([]);
  const supabase = createClient();

  // ✅ READ VIEW FROM URL
  const searchParams = useSearchParams();
  const view = searchParams.get("view"); // OrganizationAnalysis | plantation | emissions | etc

  useEffect(() => {
    async function fetchGovData() {
      const { data } = await supabase
        .from("government_oversight_view")
        .select("*");
      setOrgs(data || []);
    }
    fetchGovData();
  }, []);

  /* ================= PDF REPORT GENERATOR ================= */
  const generateReport = (org) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- 1. Official Header ---
    doc.setFillColor(16, 185, 129); // Emerald-500
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("GOVERNMENT COMPLIANCE REPORT", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Ministry of Coal & Energy | Official Audit Document", pageWidth / 2, 28, { align: "center" });

    // --- 2. Organization Details ---
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(org.organization_name, 20, 60);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Location: ${org.location || "N/A"}`, 20, 66);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 72);

    // --- 3. AI Logic & Summary ---
    const netImpact = (org.total_co2 * (1 - org.neutrality_rate / 100)).toFixed(1);
    const isCompliant = org.neutrality_rate > 50;
    const workStatus = isCompliant ? "Completed / Maintenance" : "Ongoing Remediation";
    
    // Simulated AI Summary Generation
    const aiSummary = `This automated report serves as an official compliance record for ${org.organization_name}. 

Based on real-time oversight data, the facility has recorded a gross carbon emission of ${org.total_co2} tonnes. Through afforestation and offset measures, approximately ${org.neutrality_rate.toFixed(1)}% of these emissions have been neutralized, resulting in a net carbon impact of ${netImpact} tonnes.

AI ASSESSMENT: ${org.neutrality_rate < 30 
      ? "CRITICAL ALERT. The facility is operating significantly below the mandated green cover threshold. Immediate regulatory intervention and accelerated plantation drives are recommended to avoid penalties." 
      : "SATISFACTORY. The facility demonstrates adequate adherence to environmental protocols. Continued monitoring is advised."}

Work Status: ${workStatus}`;

    // --- 4. Render Summary ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary (AI Generated)", 20, 95);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(aiSummary, 170);
    doc.text(splitText, 20, 105);

    // --- 5. Footer ---
    doc.setDrawColor(200);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Generated via Rubix GovDashboard • Verifiable Record", 20, 280);

    doc.save(`${org.organization_name}_Compliance_Report.pdf`);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ===== SIDEBAR ===== */}
      <Sidebar />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-10">

        {/* =========================
            DEFAULT: NATIONAL OVERVIEW
           ========================= */}
        {!view && (
          <>
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <ShieldCheck className="text-emerald-600" size={36} />
                  National Carbon Oversight
                </h1>
                <p className="text-slate-500 font-medium">
                  Ministry of Coal & Energy Regulatory Portal
                </p>
              </div>

              <div className="bg-white border p-2 rounded-xl flex items-center gap-2 px-4 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Organization..."
                  className="outline-none text-sm"
                />
              </div>
            </header>

            {/* ===== SUMMARY CARDS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase">
                  Total Organizations
                </p>
                <h2 className="text-4xl font-black">{orgs.length}</h2>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm border-l-red-500 border-l-4">
                <p className="text-slate-400 text-xs font-bold uppercase">
                  Non-Compliant
                </p>
                <h2 className="text-4xl font-black text-red-600">
                  {orgs.filter(o => o.neutrality_rate < 20).length}
                </h2>
              </div>

              <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-lg">
                <p className="text-emerald-100 text-xs font-bold uppercase">
                  Avg. Neutrality Rate
                </p>
                <h2 className="text-4xl font-black">
                  {(
                    orgs.reduce((acc, o) => acc + o.neutrality_rate, 0) /
                    (orgs.length || 1)
                  ).toFixed(1)}%
                </h2>
              </div>
            </div>

            {/* ===== DATA TABLE ===== */}
            <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                    <th className="p-6">Organization</th>
                    <th className="p-6">Location</th>
                    <th className="p-6">Gross CO₂ (T)</th>
                    <th className="p-6">Neutrality</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Report</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orgs.map(org => (
                    <tr
                      key={org.mine_id}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="p-6 font-bold text-slate-800">
                        {org.organization_name}
                      </td>
                      <td className="p-6 text-slate-500">{org.location}</td>
                      <td className="p-6 font-mono font-bold">
                        {Number(org.total_co2).toFixed(2)}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full w-24">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${org.neutrality_rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold">
                            {org.neutrality_rate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        {org.neutrality_rate > 50 ? (
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black">
                            COMPLIANT
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit">
                            <AlertTriangle size={10} /> CRITICAL
                          </span>
                        )}
                      </td>
                      <td className="p-6">
                        <button
                          onClick={(e) => { e.stopPropagation(); generateReport(org); }}
                          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition border border-slate-200"
                        >
                          <FileText size={14} />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* =========================
            ORGANIZATION ANALYSIS
           ========================= */}
        {view === "OrganizationAnalysis" && <OrganizationAnalysis />}
        {view === "plantation" && <PlantationHistory />}
        {view === "cost-benefit" && <CostBenefitAnalysis />}
        {view === "compliance-calendar" && <ComplianceCalendar />}

        {/* PLACEHOLDERS (next steps) */}
        {view === "plantation" && (
          <h1 className="text-3xl font-black">Plantation History</h1>
        )}
        {view === "emissions" && (
          <h1 className="text-3xl font-black">Emission Trends</h1>
        )}
        {view === "compliance" && (
          <h1 className="text-3xl font-black">Compliance Status</h1>
        )}
        {view === "map" && (
          <div className="flex flex-col h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <MapPinned className="text-emerald-600" size={36} />
                  Geographical View
                </h1>
                <p className="text-slate-500 font-medium">
                  Live Satellite & GIS Mapping of Mining Zones
                </p>
              </div>
              
              <a 
                href="https://www.infinite-vision.co.in/IV1/Map/map/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
              >
                <ExternalLink size={18} />
                Open Fullscreen Map
              </a>
            </header>

            <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[75vh]">
              <iframe 
                src="https://www.infinite-vision.co.in/IV1/Map/map/index.php" 
                className="w-full h-full absolute inset-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Geographical Map View"
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
