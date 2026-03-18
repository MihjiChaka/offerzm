import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { View } from '../App';

interface HeroProps {
  navigateTo: (view: View) => void;
}

export default function Hero({ navigateTo }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-slate-50 rounded-bl-[100px]" />
      <div className="absolute top-20 left-10 -z-10 w-64 h-64 bg-accent-faint rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-faint text-accent font-bold text-sm mb-6">
              <Sparkles size={16} />
              <span>Professional Excellence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-tight mb-6">
              Your Dream Job Starts With a <span className="text-accent">Powerful CV</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Build a professional, ATS-friendly CV in minutes with our expert builder or order professional writing services tailored for the Zambian job market.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigateTo('builder')}
                className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary transition-all shadow-xl active:scale-95 group"
              >
                Create My CV
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigateTo('roast')}
                className="flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-xl active:scale-95 group"
              >
                🔥 Roast My CV
              </button>
              <button 
                onClick={() => navigateTo('services')}
                className="flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary-muted px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                Order Service
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-bold text-primary">500+</span> Zambian professionals hired this month
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100">
              <div className="space-y-8">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-primary">Job Offer Received!</div>
                    <div className="text-xs text-slate-500">3 Interviews in one week</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-full w-full" />
                  <div className="h-4 bg-slate-100 rounded-full w-5/6" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-faint p-4 rounded-2xl border border-primary-muted">
                    <div className="text-accent font-bold text-2xl">98%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">ATS Score</div>
                  </div>
                  <div className="bg-accent-faint p-4 rounded-2xl border border-accent-muted">
                    <div className="text-primary font-bold text-2xl">100+</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Templates</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-primary font-bold justify-center pt-4">
                  <Sparkles size={18} className="text-accent" />
                  <span>Expert Optimized for Zambia</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
