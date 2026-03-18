import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  MapPin, 
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';
import { cn } from '../lib/utils';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  dateApplied: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  notes: string;
}

const initialJobs: JobApplication[] = [
  {
    id: '1',
    company: 'Zambia National Bank',
    position: 'Senior Accountant',
    location: 'Lusaka',
    dateApplied: '2026-03-10',
    status: 'Interview',
    notes: 'Interview scheduled for next Tuesday.'
  },
  {
    id: '2',
    company: 'Airtel Zambia',
    position: 'Marketing Manager',
    location: 'Ndola',
    dateApplied: '2026-03-12',
    status: 'Applied',
    notes: 'Applied via LinkedIn.'
  }
];

export default function JobTracker() {
  const [jobs, setJobs] = useState<JobApplication[]>(initialJobs);
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState<Partial<JobApplication>>({
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0]
  });

  const addJob = () => {
    if (newJob.company && newJob.position) {
      setJobs([
        ...jobs,
        { ...newJob, id: Math.random().toString() } as JobApplication
      ]);
      setIsAdding(false);
      setNewJob({ status: 'Applied', dateApplied: new Date().toISOString().split('T')[0] });
    }
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-600';
      case 'Interview': return 'bg-yellow-100 text-yellow-600';
      case 'Offer': return 'bg-green-100 text-green-600';
      case 'Rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Job Application Tracker</h2>
          <p className="text-slate-500 text-sm">Keep track of all your job applications in one place.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-accent text-primary px-6 py-3 rounded-full font-bold hover:bg-accent-hover transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Application
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: jobs.length, color: 'bg-primary' },
          { label: 'Interviews', count: jobs.filter(j => j.status === 'Interview').length, color: 'bg-yellow-500' },
          { label: 'Offers', count: jobs.filter(j => j.status === 'Offer').length, color: 'bg-green-500' },
          { label: 'Applied', count: jobs.filter(j => j.status === 'Applied').length, color: 'bg-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-primary">{stat.count}</div>
            <div className={cn("h-1 w-8 mt-2 rounded-full", stat.color)} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-accent-muted outline-none text-sm"
            />
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Company & Position</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{job.company}</div>
                    <div className="text-xs text-slate-500">{job.position}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {job.dateApplied}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusColor(job.status))}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteJob(job.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
          >
            <h3 className="text-xl font-bold text-primary mb-6">Add New Application</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Company</label>
                  <input 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-accent"
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Position</label>
                  <input 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-accent"
                    onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Location</label>
                  <input 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-accent"
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Status</label>
                  <select 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-accent"
                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value as any })}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={addJob}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
              >
                Save Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
