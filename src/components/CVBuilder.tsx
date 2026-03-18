import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Sparkles, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2,
  Save,
  FileText,
  Loader2,
  CheckCircle,
  Phone,
  X,
  Mail,
  MapPin,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { View } from '../App';
import { getExpertSuggestions } from '../services/geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DocumentPreviewWrapper from './DocumentPreviewWrapper';
import CVPreview, { CVData } from './CVPreview';

interface CVBuilderProps {
  navigateTo: (view: View) => void;
  templateId?: string;
}

const initialData: CVData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  references: [],
};

export default function CVBuilder({ navigateTo, templateId = 'modern' }: CVBuilderProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CVData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Math.random().toString(), company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Math.random().toString(), school: '', degree: '', year: '' }
      ]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value.trim();
      if (value && !data.skills.includes(value)) {
        setData(prev => ({ ...prev, skills: [...prev.skills, value] }));
        e.currentTarget.value = '';
      }
    }
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };
  
  const addReference = () => {
    setData(prev => ({
      ...prev,
      references: [
        ...prev.references,
        { id: Math.random().toString(), name: '', position: '', company: '', phone: '', email: '' }
      ]
    }));
  };

  const updateReference = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      references: prev.references.map(ref => ref.id === id ? { ...ref, [field]: value } : ref)
    }));
  };

  const removeReference = (id: string) => {
    setData(prev => ({
      ...prev,
      references: prev.references.filter(ref => ref.id !== id)
    }));
  };

  const generateExpertSummary = async () => {
    if (!data.personal.fullName) {
      alert("Please enter your name first to give us some context.");
      return;
    }
    setIsGenerating(true);
    const context = `Name: ${data.personal.fullName}, Experience: ${data.experience.map(e => e.position).join(', ')}, Skills: ${data.skills.join(', ')}`;
    const suggestion = await getExpertSuggestions('summary', context);
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, summary: suggestion }
    }));
    setIsGenerating(false);
  };

  const downloadPDF = async () => {
    if (!cvPreviewRef.current) return;
    setIsDownloading(true);
    try {
      // Ensure fonts are loaded
      await document.fonts.ready;
      
      // Scroll to top to avoid capture offsets
      window.scrollTo(0, 0);

      const previewElement = cvPreviewRef.current;
      if (!previewElement) return;

      const canvas = await html2canvas(previewElement, {
        scale: 3, // 3x is plenty for 210mm width
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        width: 794, // Fixed A4 width in pixels at 96dpi
        onclone: (clonedDoc) => {
          const previewContent = clonedDoc.body.querySelector('.preview-content') as HTMLElement;
          if (previewContent) {
            previewContent.style.transform = 'none';
            previewContent.style.position = 'relative';
          }
          const el = clonedDoc.body.querySelector('.page-container') as HTMLElement;
          if (el) {
            el.style.transform = 'none';
            el.style.width = '210mm';
            el.style.minHeight = '297mm';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate how many pages we need based on the canvas height
      // canvas.width is 794 (A4 at 96dpi), so A4 height at 96dpi is 1123
      const pxPageHeight = Math.floor(canvas.width * (297 / 210));
      const totalPages = Math.ceil(canvas.height / pxPageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        
        // We use a temporary canvas to slice the main canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = pxPageHeight;
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          ctx.drawImage(
            canvas,
            0, i * pxPageHeight, canvas.width, pxPageHeight, // source
            0, 0, canvas.width, pxPageHeight // destination
          );
          
          const pageImgData = tempCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }
      }

      pdf.save(`${data.personal.fullName || 'My_CV'}_ZambiaCV.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
    setIsDownloading(false);
  };

  const sendToWhatsApp = () => {
    const text = `Hi, I just created my CV on OfferZM! My name is ${data.personal.fullName}. Can you help me review it?`;
    window.open(`https://wa.me/260977572626?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Form Side */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Progress Bar */}
              <div className="h-2 bg-slate-100">
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: '20%' }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                />
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                    {step === 1 && <User className="text-accent" />}
                    {step === 2 && <Briefcase className="text-accent" />}
                    {step === 3 && <GraduationCap className="text-accent" />}
                    {step === 4 && <Wrench className="text-accent" />}
                    {step === 5 && <Users className="text-accent" />}
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Work Experience"}
                    {step === 3 && "Education"}
                    {step === 4 && "Skills & Summary"}
                    {step === 5 && "References"}
                  </h2>
                  <span className="text-sm font-bold text-slate-400">Step {step} of 5</span>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Full Name</label>
                          <input 
                            type="text" 
                            name="fullName"
                            value={data.personal.fullName}
                            onChange={handlePersonalChange}
                            placeholder="e.g. Chanda Mwila"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Email Address</label>
                          <input 
                            type="email" 
                            name="email"
                            value={data.personal.email}
                            onChange={handlePersonalChange}
                            placeholder="e.g. chanda@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Phone Number</label>
                          <input 
                            type="text" 
                            name="phone"
                            value={data.personal.phone}
                            onChange={handlePersonalChange}
                            placeholder="e.g. +260 977 000 000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Location</label>
                          <input 
                            type="text" 
                            name="location"
                            value={data.personal.location}
                            onChange={handlePersonalChange}
                            placeholder="e.g. Lusaka, Zambia"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {data.experience.map((exp) => (
                        <div key={exp.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 relative group">
                          <button 
                            onClick={() => removeExperience(exp.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input 
                              placeholder="Company Name"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <input 
                              placeholder="Position"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                              <input 
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">End Date</label>
                              <input 
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                              />
                            </div>
                          </div>
                          <textarea 
                            placeholder="Key Responsibilities & Achievements"
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent h-24 resize-none"
                          />
                        </div>
                      ))}
                      <button 
                        onClick={addExperience}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Experience
                      </button>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {data.education.map((edu) => (
                        <div key={edu.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 relative">
                          <button 
                            onClick={() => removeEducation(edu.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input 
                              placeholder="School/University"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <input 
                              placeholder="Degree/Certificate"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Graduation Date</label>
                              <input 
                                type="date"
                                value={edu.year}
                                onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={addEducation}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Education
                      </button>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-700">Professional Summary</label>
                          <button 
                            onClick={generateExpertSummary}
                            disabled={isGenerating}
                            className="flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-hover transition-colors disabled:opacity-50"
                          >
                            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            Pro Tip
                          </button>
                        </div>
                        <textarea 
                          name="summary"
                          value={data.personal.summary}
                          onChange={handlePersonalChange}
                          placeholder="Briefly describe your professional background and goals..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all h-32 resize-none"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700">Skills (Press Enter to add)</label>
                        <input 
                          type="text" 
                          onKeyDown={handleSkillAdd}
                          placeholder="e.g. Project Management, Python, Leadership"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                        />
                        <div className="flex flex-wrap gap-2">
                          {data.skills.map(skill => (
                            <span key={skill} className="inline-flex items-center gap-2 px-3 py-1 bg-primary-faint text-primary text-xs font-bold rounded-full border border-slate-200">
                              {skill}
                              <button onClick={() => removeSkill(skill)}><X size={12} /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {data.references.map((ref) => (
                        <div key={ref.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 relative">
                          <button 
                            onClick={() => removeReference(ref.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                              placeholder="Reference Name"
                              value={ref.name}
                              onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <input 
                              placeholder="Position"
                              value={ref.position}
                              onChange={(e) => updateReference(ref.id, 'position', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <input 
                              placeholder="Company"
                              value={ref.company}
                              onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <input 
                              placeholder="Phone Number"
                              value={ref.phone}
                              onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent"
                            />
                            <input 
                              placeholder="Email (Optional)"
                              value={ref.email}
                              onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                              className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-accent md:col-span-2"
                            />
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={addReference}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add Reference
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
                  <button 
                    onClick={() => step > 1 ? setStep(step - 1) : navigateTo('home')}
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={18} />
                    {step === 1 ? "Cancel" : "Back"}
                  </button>
                  <button 
                    onClick={() => step < 5 ? setStep(step + 1) : null}
                    className={cn(
                      "flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition-all active:scale-95",
                      step === 5 && "hidden"
                    )}
                  >
                    Next Step
                    <ArrowRight size={18} />
                  </button>
                  {step === 5 && (
                    <div className="flex gap-4">
                      <button 
                        onClick={sendToWhatsApp}
                        className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-all active:scale-95"
                      >
                        <Phone size={18} />
                        WhatsApp
                      </button>
                      <button 
                        onClick={downloadPDF}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-accent text-primary px-8 py-3 rounded-full font-bold hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="w-full lg:w-[450px]">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <FileText size={18} className="text-accent" />
                  Live Preview
                </h3>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Updating
                </div>
              </div>

              {/* CV Template Preview */}
              <div ref={cvPreviewRef}>
                <DocumentPreviewWrapper>
                  <CVPreview data={data} templateId={templateId} />
                </DocumentPreviewWrapper>
              </div>
              
              <div className="mt-6 p-4 bg-primary-faint rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-muted rounded-full flex items-center justify-center text-accent">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">Pro Tip</h4>
                    <p className="text-xs text-slate-500">Use our expert suggestions to make your achievements stand out to recruiters.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
