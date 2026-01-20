// app/login/page.js
"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

const handleSignIn = async (e) => {
  e.preventDefault();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(error.message);
  } else {
    // 1. Extract the role from the user metadata
    const userRole = data.user.user_metadata?.role;

    // 2. Redirect based on role
    if (userRole === 'government') {
      router.push('/gov-dashboard');
    } else {
      router.push('/dashboard');
    }
  }
};

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Mine Manager Login</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input 
            type="email" placeholder="Official Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-green-500"
            required 
          />
          <input 
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-green-500"
            required 
          />
          <button className="w-full bg-green-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-green-400 transition">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default page