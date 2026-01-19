import React from 'react'
import Link from 'next/link'
export default function Hero() {
  return (
    <div>
      <div className="min-h-screen bg-slate-900 text-white selection:bg-green-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-green-400">CoalCarbon.ai</div>
        <Link href="/login" className="px-5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition">
          Login
        </Link>
      </nav>

      {/* Hero Content */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          Quantifying India's <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            Net Zero Coal Future
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          The standardized platform for Indian coal mines to track emissions, 
          manage afforestation sinks, and simulate carbon neutrality pathways 
          aligned with 2026 standards.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login" className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-green-500/20 transition-all">
            Get Started Free
          </Link>
          <button className="px-8 py-4 rounded-full font-bold text-lg border border-slate-700 hover:bg-slate-800 transition">
            View Live Demo
          </button>
        </div>
      </main>
    </div>
    </div>
  )
}
