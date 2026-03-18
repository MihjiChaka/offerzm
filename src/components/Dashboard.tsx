import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  FileText, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  CreditCard,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { View } from '../App';
import JobTracker from './JobTracker';
import InterviewPrep from './InterviewPrep';

interface DashboardProps {
  navigateTo: (view: View) => void;
}

export default function Dashboard({ navigateTo }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'cvs' | 'orders' | 'admin' | 'tracker' | 'prep'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([
    { id: 1, name: 'Chanda Mwila', email: 'chanda@example.com', joined: '2026-03-01' },
    { id: 2, name: 'Misozi Banda', email: 'misozi@example.com', joined: '2026-03-05' },
    { id: 3, name: 'Kelvin Phiri', email: 'kelvin@example.com', joined: '2026-03-10' }
  ]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Oops, we haven't got JSON!");
        }
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(err => {
        console.error("Dashboard Fetch Error:", err);
        // Fallback to empty orders if API fails
        setOrders([]);
      });
  }, []);

  const stats = [
    { label: 'My CVs', value: '2', icon: <FileText className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Active Orders', value: orders.length.toString(), icon: <ShoppingBag className="text-orange-500" />, color: 'bg-orange-50' },
    { label: 'Job Matches', value: '12', icon: <TrendingUp className="text-green-500" />, color: 'bg-green-50' },
  ];

  const adminStats = [
    { label: 'Total Users', value: allUsers.length.toString(), icon: <Users className="text-purple-500" />, color: 'bg-purple-50' },
    { label: 'Total Orders', value: orders.length.toString(), icon: <ShoppingBag className="text-orange-500" />, color: 'bg-orange-50' },
    { label: 'Revenue', value: `K${orders.reduce((acc, o) => acc + (parseInt(o.amount?.replace('K', '') || '0')), 0)}`, icon: <CreditCard className="text-emerald-500" />, color: 'bg-emerald-50' },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: <Layout size={20} /> },
              { id: 'cvs', label: 'My CVs', icon: <FileText size={20} /> },
              { id: 'tracker', label: 'Job Tracker', icon: <Briefcase size={20} /> },
              { id: 'prep', label: 'Interview Prep', icon: <MessageSquare size={20} /> },
              { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={20} /> },
              { id: 'admin', label: 'Admin Panel', icon: <Users size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-slate-500 hover:bg-white hover:text-primary"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-primary">Welcome back, Chanda!</h2>
                  <button 
                    onClick={() => navigateTo('builder')}
                    className="bg-accent text-primary px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-accent-hover transition-all"
                  >
                    <Plus size={18} />
                    Create New CV
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <h3 className="text-lg font-bold text-primary mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                    {[
                      { action: "CV Downloaded", time: "2 hours ago", icon: <Download size={16} />, color: "text-blue-500" },
                      { action: "New Order Placed", time: "1 day ago", icon: <ShoppingBag size={16} />, color: "text-orange-500" },
                      { action: "Profile Updated", time: "3 days ago", icon: <CheckCircle size={16} />, color: "text-green-500" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-bold text-primary text-sm">{item.action}</div>
                            <div className="text-xs text-slate-400">{item.time}</div>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-slate-400 hover:text-primary">View</button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tracker' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <JobTracker />
              </motion.div>
            )}

            {activeTab === 'prep' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InterviewPrep />
              </motion.div>
            )}

            {activeTab === 'cvs' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-primary">My CVs</h2>
                  <button 
                    onClick={() => navigateTo('builder')}
                    className="text-primary font-bold flex items-center gap-2 hover:text-accent"
                  >
                    <Plus size={18} />
                    New CV
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "Professional CV - Marketing", date: "Mar 15, 2026", template: "Modern" },
                    { name: "Creative Resume - Design", date: "Feb 28, 2026", template: "Creative" }
                  ].map((cv, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <FileText size={24} />
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Download size={18} /></button>
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <h3 className="font-bold text-primary mb-1">{cv.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                        <span>{cv.date}</span>
                        <span>•</span>
                        <span>{cv.template} Template</span>
                      </div>
                      <button 
                        onClick={() => navigateTo('builder')}
                        className="w-full mt-6 py-3 rounded-xl border border-slate-100 font-bold text-primary hover:bg-slate-50 transition-all"
                      >
                        Edit CV
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-primary">My Orders</h2>
                
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Service</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.length > 0 ? orders.map((order: any) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 font-bold text-primary text-sm">#{order.id}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{order.serviceName || 'Custom Service'}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider">
                              <Clock size={10} />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold text-primary text-sm">{order.amount || 'K0'}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                            No orders found. Start by ordering a professional service!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {adminStats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-50">
                    <h3 className="font-bold text-primary">Recent Users</h3>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {allUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 font-bold text-primary text-sm">{user.name}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                          <td className="px-6 py-4 text-slate-400 text-sm">{user.joined}</td>
                          <td className="px-6 py-4">
                            <button className="text-xs font-bold text-accent hover:underline">Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
