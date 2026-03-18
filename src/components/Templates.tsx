import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Edit3, CheckCircle, X } from 'lucide-react';
import { View } from '../App';

interface TemplatesProps {
  navigateTo: (view: View) => void;
  onSelectTemplate?: (id: string) => void;
  limit?: number;
}

import CVPreview, { CVData } from './CVPreview';
import CoverLetterPreview, { CoverLetterData } from './CoverLetterPreview';

const sampleData: CVData = {
  personal: {
    fullName: 'Chanda Mwila',
    email: 'chanda@example.com',
    phone: '+260 977 000 000',
    location: 'Lusaka, Zambia',
    summary: 'Experienced professional with a strong background in project management and team leadership.',
  },
  experience: [
    {
      id: '1',
      company: 'Zambia Tech Corp',
      position: 'Senior Project Manager',
      startDate: '2020',
      endDate: 'Present',
      description: 'Leading cross-functional teams to deliver innovative solutions.'
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of Zambia',
      degree: 'BSc Computer Science',
      year: '2018'
    }
  ],
  skills: ['Project Management', 'Leadership', 'Strategic Planning'],
  references: []
};

const sampleCoverLetter: CoverLetterData = {
  personal: {
    fullName: 'Chanda Mwila',
    email: 'chanda@example.com',
    phone: '+260 977 000 000',
    location: 'Lusaka, Zambia',
  },
  recipient: {
    name: 'Hiring Manager',
    position: 'Senior Accountant',
    company: 'Zambia National Bank',
    address: 'Cairo Road, Lusaka',
  },
  content: {
    date: '18/03/2026',
    subject: 'Application for Senior Accountant Position',
    salutation: 'Dear Hiring Manager,',
    body: 'I am writing to express my strong interest in the Senior Accountant role at Zambia National Bank. With over 5 years of experience in financial management and a proven track record of optimizing accounting processes, I am confident in my ability to contribute significantly to your team.',
    closing: 'Sincerely,',
  },
};

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    category: 'Professional',
    type: 'cv'
  },
  {
    id: 'creative',
    name: 'Creative Edge',
    category: 'Creative',
    type: 'cv'
  },
  {
    id: 'minimal',
    name: 'Clean Minimalist',
    category: 'Corporate',
    type: 'cv'
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    category: 'Executive',
    type: 'cv'
  },
  {
    id: 'academic',
    name: 'Academic Researcher',
    category: 'Academic',
    type: 'cv'
  },
  {
    id: 'cover-modern',
    name: 'Modern Letter',
    category: 'Professional',
    type: 'cover'
  },
  {
    id: 'cover-creative',
    name: 'Creative Letter',
    category: 'Creative',
    type: 'cover'
  },
  {
    id: 'cover-minimal',
    name: 'Minimal Letter',
    category: 'Corporate',
    type: 'cover'
  }
];

export default function Templates({ navigateTo, onSelectTemplate, limit }: TemplatesProps) {
  const [activeTab, setActiveTab] = useState<'cv' | 'cover'>('cv');
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  
  const filteredTemplates = templates.filter(t => t.type === activeTab);
  const displayTemplates = limit ? filteredTemplates.slice(0, limit) : filteredTemplates;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Templates Gallery</h2>
            <p className="text-slate-600 max-w-xl">
              Choose from our collection of professionally designed, ATS-friendly templates for CVs and Cover Letters.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('cv')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'cv' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
            >
              CVs
            </button>
            <button 
              onClick={() => setActiveTab('cover')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'cover' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
            >
              Cover Letters
            </button>
          </div>
          {limit && (
            <button 
              onClick={() => navigateTo('templates')}
              className="text-primary font-bold hover:text-accent transition-colors"
            >
              View All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTemplates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-100">
                <div className="w-full h-full pointer-events-none">
                  {template.type === 'cv' ? (
                    <CVPreview data={sampleData} templateId={template.id} isMini />
                  ) : (
                    <CoverLetterPreview data={sampleCoverLetter} templateId={template.id.replace('cover-', '')} isMini />
                  )}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary-soft opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                  <button 
                    onClick={() => onSelectTemplate ? onSelectTemplate(template.id) : navigateTo('builder')}
                    className="bg-white text-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                  >
                    <Edit3 size={18} />
                    Use Template
                  </button>
                  <button 
                    onClick={() => setPreviewTemplate(template)}
                    className="text-white font-medium flex items-center gap-2 hover:underline transform translate-y-4 group-hover:translate-y-0 delay-75"
                  >
                    <Eye size={18} />
                    Preview
                  </button>
                </div>

                <div className="absolute top-4 left-4 bg-white-90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                  {template.category}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-bold text-primary">{template.name}</h3>
                <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                  <CheckCircle size={14} />
                  <span>ATS Ready</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-primary">{previewTemplate.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{previewTemplate.category} Template</p>
                </div>
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center">
                <div className="w-full max-w-[800px] aspect-[1/1.41] bg-white shadow-2xl rounded-sm overflow-hidden">
                  {previewTemplate.type === 'cv' ? (
                    <CVPreview data={sampleData} templateId={previewTemplate.id} />
                  ) : (
                    <CoverLetterPreview data={sampleCoverLetter} templateId={previewTemplate.id.replace('cover-', '')} />
                  )}
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-50 flex justify-end gap-4">
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3 text-slate-500 font-bold hover:text-primary transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    onSelectTemplate ? onSelectTemplate(previewTemplate.id) : navigateTo('builder');
                    setPreviewTemplate(null);
                  }}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Use This Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
