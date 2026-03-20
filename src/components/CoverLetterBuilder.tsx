import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Building2, 
  FileText, 
  Sparkles, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  Loader2,
  Phone,
  Mail,
  MapPin,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';
import { View } from '../App';
import { getExpertSuggestions } from '../services/geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DocumentPreviewWrapper from './DocumentPreviewWrapper';
import CoverLetterPreview, { CoverLetterData } from './CoverLetterPreview';

interface CoverLetterBuilderProps {
  navigateTo: (view: View) => void;
  templateId?: string;
}

const initialData: CoverLetterData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  recipient: {
    name: '',
    position: '',
    company: '',
    address: '',
  },
  content: {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD for input
    subject: 'Application for Position',
    salutation: 'Dear Hiring Manager,',
    body: '',
    closing: 'Sincerely,',
  },
};

export default function CoverLetterBuilder({ navigateTo, templateId = 'modern' }: CoverLetterBuilderProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CoverLetterData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      recipient: { ...prev.recipient, [name]: value }
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      content: { ...prev.content, [name]: value }
    }));
  };

  const generateExpertBody = async () => {
    if (!data.recipient.company) {
      alert("Please enter the company name first.");
      return;
    }
    setIsGenerating(true);
    try {
      const context = `Position: ${data.recipient.position || 'the role'}, Company: ${data.recipient.company}, Applicant: ${data.personal.fullName}. 
      Recipient Name: ${data.recipient.name || 'Hiring Manager'}. 
      PRIMARY FOCUS - Subject/RE: ${data.content.subject}.
      
      CRITICAL: The cover letter body MUST be specifically tailored to the EXACT job title or reference mentioned in the "Subject/RE" field above. 
      Ensure the tone is professional and the content highlights why the applicant is a great fit for THIS SPECIFIC role at ${data.recipient.company}.`;
      
      const suggestion = await getExpertSuggestions('cover_letter', context);
      
      if (suggestion.startsWith('Error:')) {
        alert(suggestion);
      } else {
        setData(prev => ({
          ...prev,
          content: { ...prev.content, body: suggestion }
        }));
      }
    } catch (error: any) {
      console.error("Generate body error:", error);
      alert("Failed to generate cover letter body. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHiringEmail = async () => {
    setIsGeneratingEmail(true);
    try {
      const context = `Applicant: ${data.personal.fullName}, Company: ${data.recipient.company}, Position: ${data.recipient.position}, Recipient: ${data.recipient.name || 'Hiring Manager'}. 
      Cover Letter Content: ${data.content.body.substring(0, 500)}...
      The email should be based on this cover letter and mention that a CV and Cover Letter are attached.`;
      
      const email = await getExpertSuggestions('hiring_manager_email', context);
      
      if (email.startsWith('Error:')) {
        alert(email);
      } else {
        setGeneratedEmail(email);
        setShowEmailModal(true);
      }
    } catch (error: any) {
      console.error("Generate email error:", error);
      alert("Failed to generate email. Please try again.");
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      // Ensure fonts are loaded
      await document.fonts.ready;
      
      // Scroll to top to avoid capture offsets
      window.scrollTo(0, 0);

      const pages = previewRef.current.querySelectorAll('.page-container');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 3,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          imageTimeout: 0,
          width: 794,
          onclone: (clonedDoc) => {
            const previewContent = clonedDoc.body.querySelector('.preview-content') as HTMLElement;
            if (previewContent) {
              previewContent.style.transform = 'none';
              previewContent.style.position = 'relative';
              previewContent.style.width = '794px';
              previewContent.style.height = 'auto';
              previewContent.style.display = 'block';
              
              // Hide siblings of previewContent (like the spacer in DocumentPreviewWrapper)
              const parent = previewContent.parentElement;
              if (parent) {
                Array.from(parent.children).forEach(child => {
                  if (child !== previewContent) {
                    (child as HTMLElement).style.display = 'none';
                  }
                });
                parent.style.width = '794px';
                parent.style.height = 'auto';
                parent.style.minHeight = '0';
                parent.style.padding = '0';
                parent.style.margin = '0';
                parent.style.background = 'white';
                parent.style.boxShadow = 'none';
              }
            }
            const el = clonedDoc.body.querySelector(`[data-page="${i + 1}"]`) as HTMLElement;
            if (el) {
              el.style.transform = 'none';
              el.style.width = '210mm';
              el.style.minHeight = '297mm';
              el.style.height = 'auto';
              el.style.margin = '0';
              el.style.boxShadow = 'none';
            }
            // Ensure all parents are visible and have auto height
            let parent = el?.parentElement;
            while (parent && parent !== clonedDoc.body) {
              parent.style.height = 'auto';
              parent.style.minHeight = '0';
              parent.style.overflow = 'visible';
              parent.style.display = 'block';
              parent.style.margin = '0';
              parent.style.padding = '0';
              parent = parent.parentElement;
            }
          }
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      pdf.save(`${data.personal.fullName || 'My_Cover_Letter'}_ZambiaCV.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
    setIsDownloading(false);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Form Side */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="h-2 bg-slate-100">
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: '33%' }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                    {step === 1 && <User className="text-accent" />}
                    {step === 2 && <Building2 className="text-accent" />}
                    {step === 3 && <FileText className="text-accent" />}
                    {step === 1 && "Your Information"}
                    {step === 2 && "Recipient Details"}
                    {step === 3 && "Letter Content"}
                  </h2>
                  <span className="text-sm font-bold text-slate-400">Step {step} of 3</span>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Hiring Manager Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={data.recipient.name}
                            onChange={handleRecipientChange}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Position Title</label>
                          <input 
                            type="text" 
                            name="position"
                            value={data.recipient.position}
                            onChange={handleRecipientChange}
                            placeholder="e.g. Senior Accountant"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Company Name</label>
                          <input 
                            type="text" 
                            name="company"
                            value={data.recipient.company}
                            onChange={handleRecipientChange}
                            placeholder="e.g. Zambia National Bank"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Company Address</label>
                          <input 
                            type="text" 
                            name="address"
                            value={data.recipient.address}
                            onChange={handleRecipientChange}
                            placeholder="e.g. Cairo Road, Lusaka"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                      </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Date</label>
                          <input 
                            type="date" 
                            name="date"
                            value={data.content.date}
                            onChange={handleContentChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">RE: (Subject)</label>
                          <input 
                            type="text" 
                            name="subject"
                            value={data.content.subject}
                            onChange={handleContentChange}
                            placeholder="e.g. Application for Accountant"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-700">Letter Body</label>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setData(prev => ({ ...prev, content: { ...prev.content, body: '' } }))}
                              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                            >
                              Clear Text
                            </button>
                            <button 
                              onClick={generateExpertBody}
                              disabled={isGenerating}
                              className="flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-hover transition-colors disabled:opacity-50"
                            >
                              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                              Generate Body
                            </button>
                          </div>
                        </div>
                        <textarea 
                          name="body"
                          value={data.content.body}
                          onChange={handleContentChange}
                          placeholder="Start writing your cover letter..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent-muted outline-none transition-all h-64 resize-none"
                        />
                      </div>
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
                    onClick={() => step < 3 ? setStep(step + 1) : null}
                    className={cn(
                      "flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition-all active:scale-95",
                      step === 3 && "hidden"
                    )}
                  >
                    Next Step
                    <ArrowRight size={18} />
                  </button>
                  {step === 3 && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={generateHiringEmail}
                        disabled={isGeneratingEmail}
                        className="flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors disabled:opacity-50"
                      >
                        {isGeneratingEmail ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                        Generate Email
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

          {/* Email Modal */}
          <AnimatePresence>
            {showEmailModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Mail className="text-accent" />
                        Hiring Manager Email
                      </h3>
                      <button 
                        onClick={() => setShowEmailModal(false)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <ArrowLeft size={20} />
                      </button>
                    </div>
                    
                    <div className="bg-slate-50 rounded-2xl p-6 mb-6 font-mono text-sm whitespace-pre-wrap border border-slate-100 max-h-[400px] overflow-y-auto">
                      {generatedEmail}
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedEmail || '');
                          alert("Email copied to clipboard!");
                        }}
                        className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all"
                      >
                        Copy to Clipboard
                      </button>
                      <button 
                        onClick={() => setShowEmailModal(false)}
                        className="flex-1 bg-slate-100 text-primary py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Preview Side */}
          <div className="w-full lg:w-[450px]">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <FileText size={18} className="text-accent" />
                  Live Preview
                </h3>
              </div>

              <div ref={previewRef}>
                <DocumentPreviewWrapper>
                  <CoverLetterPreview data={data} templateId={templateId} />
                </DocumentPreviewWrapper>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
