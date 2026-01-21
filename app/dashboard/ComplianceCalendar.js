"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Calendar, CheckCircle, AlertTriangle, Clock, Bell, ChevronRight, Filter, Plus, X } from 'lucide-react';

export default function ComplianceCalendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newTask, setNewTask] = useState({
    title: '',
    due_date: '',
    escalation: 'Manager Notified',
    status: 'pending'
  });
  const supabase = createClient();

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { data, error } = await supabase
        .from('compliance_tasks')
        .insert([newTask])
        .select();

      if (error) throw error;
      if (data) setTasks([...tasks, ...data]);
      setIsModalOpen(false);
      setNewTask({ title: '', due_date: '', escalation: 'Manager Notified', status: 'pending' });
    } catch (err) {
      console.error("Error creating task:", err);
      setErrorMessage(err.message || "Failed to create task.");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('compliance_tasks')
          .select('*')
          .order('due_date', { ascending: true });
        
        if (data) setTasks(data);
      } catch (err) {
        console.error("Error fetching compliance tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getSLA = (dateString) => {
    if (!dateString) return "N/A";
    const days = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Overdue";
    if (days === 0) return "Due Today";
    return `${days} days left`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Calendar className="text-emerald-600" size={36} />
            My Compliance Calendar
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Track your regulatory obligations and avoid SLA breaches.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-600">
            <Clock size={20} /> <span className="text-xs font-bold uppercase">Upcoming Deadlines</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{tasks.filter(t => t.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <AlertTriangle size={20} /> <span className="text-xs font-bold uppercase">Overdue Items</span>
          </div>
          <p className="text-3xl font-black text-red-600">{tasks.filter(t => t.status === 'overdue').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle size={20} /> <span className="text-xs font-bold uppercase">On-Time Rate</span>
          </div>
          <p className="text-3xl font-black text-emerald-600">92%</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex gap-2">
            {['all', 'pending', 'overdue', 'completed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${filter === f ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="divide-y divide-slate-100">
          {loading && <div className="p-6 text-center text-slate-500">Loading compliance data...</div>}
          {!loading && filteredTasks.length === 0 && <div className="p-6 text-center text-slate-500">No tasks found.</div>}

          {filteredTasks.map(task => (
            <div key={task.id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${task.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  {task.status === 'overdue' ? <AlertTriangle size={24} /> : <Calendar size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{task.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    SLA Status: <span className={task.status === 'overdue' ? 'text-red-500 font-bold' : 'text-slate-600'}>{getSLA(task.due_date || task.due)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Due Date</p>
                  <p className="font-mono font-bold text-slate-700">{task.due_date || task.due}</p>
                </div>

                {task.status === 'overdue' && (
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-red-400 uppercase mb-1">Escalation</p>
                    <p className="font-bold text-red-600 text-sm">
                       {task.escalation || "None"}
                    </p>
                  </div>
                )}

                <div className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-wider ${getStatusColor(task.status)}`}>
                  {task.status}
                </div>
                
                <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Add Compliance Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Title</label>
                <input 
                  required
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-emerald-500"
                  placeholder="e.g. Submit Monthly Report"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                <input 
                  required
                  type="date" 
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Escalation Protocol</label>
                <select 
                  value={newTask.escalation}
                  onChange={(e) => setNewTask({...newTask, escalation: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-emerald-500"
                >
                  <option value="Manager Notified">Manager Notified</option>
                  <option value="Regional Head">Regional Head</option>
                  <option value="Central Ministry">Central Ministry</option>
                  <option value="None">None</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition mt-4"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}