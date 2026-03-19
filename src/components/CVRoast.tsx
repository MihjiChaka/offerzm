import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Share2, RefreshCw, MessageSquare, Trophy, AlertCircle, Upload, FileText, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configure PDF.js worker using Vite's native worker loading
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

type RoastType = 'cv' | 'cover_letter';

export default function CVRoast() {
  const [text, setText] = useState('');
  const [roastType, setRoastType] = useState<RoastType>('cv');
  const [roast, setRoast] = useState<{ text: string, score: number, title: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File) => {
    setExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Sort items by vertical position (top to bottom) then horizontal (left to right)
        const items = textContent.items as any[];
        items.sort((a, b) => {
          if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
            return b.transform[5] - a.transform[5];
          }
          return a.transform[4] - b.transform[4];
        });

        let lastY = -1;
        let pageText = '';
        for (const item of items) {
          if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n';
          } else if (lastY !== -1) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = item.transform[5];
        }
        
        fullText += pageText + '\n\n';
      }
      
      setText(fullText);
    } catch (error) {
      console.error("PDF extraction error:", error);
      alert("Failed to extract text from PDF. Please try pasting the text manually.");
    } finally {
      setExtracting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target?.result as string);
      reader.readAsText(file);
    } else {
      alert("Please upload a PDF or Text file.");
    }
  };

  const handleRoast = async () => {
    if (!text.trim()) return;
    setLoading(true);
    
    const typeLabel = roastType === 'cv' ? 'CV' : 'Cover Letter';
    
    try {
      const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Today's date is ${currentDate}. Roast this ${typeLabel} text in a funny, witty, but helpful way. Use Zambian slang (like 'mwebantu', 'zed', 'kopala', 'chalila', 'ba boss', 'chi guy') and cultural references. 
        Be brutally honest about formatting, clichés, boring summaries, and generic statements. 
        Also, provide a '${typeLabel} Score' out of 100 and a funny 'Job Seeker Title' (e.g., 'The Professional Intern', 'The Overqualified Dreamer', 'The Ghost Applicant').
        
        Return the response in this JSON format:
        {
          "text": "The roast text here...",
          "score": 85,
          "title": "The Zambian CEO in Waiting"
        }
        
        ${typeLabel} Text: ${text}`,
        config: { responseMimeType: "application/json" }
      });

      const rawText = response.text || '{}';
      const jsonText = rawText.replace(/```json\n?|```/g, '').trim();
      const result = JSON.parse(jsonText);
      setRoast(result);
    } catch (error) {
      console.error("Roast error:", error);
      alert(`The experts are too shocked by your ${typeLabel} to roast it right now. Try again!`);
    } finally {
      setLoading(false);
    }
  };

  const shareRoast = () => {
    if (!roast) return;
    const typeLabel = roastType === 'cv' ? 'CV' : 'Cover Letter';
    const shareText = `🔥 I just got my ${typeLabel} roasted by OfferZM!\n\nScore: ${roast.score}/100\nTitle: ${roast.title}\n\nThink your ${typeLabel} is better? Try it here: ${window.location.origin}`;
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <section className="pt-32 pb-20 bg-slate-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-6 shadow-lg shadow-orange-500/40"
          >
            <Flame size={40} className="text-white animate-pulse" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            The Ultimate Roast
          </h2>
          <p className="text-slate-400 text-lg">
            Think your career documents are perfect? Let our experts give you the "Zambian Truth." <br className="hidden md:block" />
            Brutally honest, highly shareable, and actually helpful.
          </p>
        </div>

        {!roast ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
          >
            {/* Roast Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-950 p-1 rounded-2xl flex gap-1 border border-slate-800">
                <button 
                  onClick={() => setRoastType('cv')}
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                    roastType === 'cv' ? "bg-orange-500 text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  CV Roast
                </button>
                <button 
                  onClick={() => setRoastType('cover_letter')}
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                    roastType === 'cover_letter' ? "bg-orange-500 text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  Cover Letter Roast
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Paste text or upload file
                </label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setText('')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Clear Text
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    {extracting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Upload PDF/Text
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.txt"
                  className="hidden"
                />
              </div>
              <textarea 
                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-300 focus:border-orange-500 outline-none transition-all resize-none font-mono text-sm"
                placeholder={roastType === 'cv' ? "Experience: 5 years of doing nothing... Skills: Sleeping, eating nshima..." : "Dear Hiring Manager, I am the best person for this job because my mother said so..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button 
              onClick={handleRoast}
              disabled={loading || !text.trim() || extracting}
              className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  Heating up the grill...
                </>
              ) : (
                <>
                  <Flame size={20} />
                  Roast My {roastType === 'cv' ? 'CV' : 'Cover Letter'}
                </>
              )}
            </button>
            <div className="mt-6 flex items-center gap-2 text-slate-500 text-xs justify-center">
              <AlertCircle size={14} />
              <span>Don't worry, we don't save your data. We just roast it.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-slate-900 border-2 border-orange-500 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10">
              <div className="bg-orange-500 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 font-black text-2xl">
                    {roast.score}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl">{roast.title}</h3>
                    <p className="text-white/80 text-xs uppercase tracking-widest">Official Score</p>
                  </div>
                </div>
                <Trophy className="text-white/40" size={40} />
              </div>
              <div className="p-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed text-lg italic">
                    "{roast.text}"
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={shareRoast}
                className="py-5 bg-[#25D366] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all"
              >
                <Share2 size={20} />
                Share Score to WhatsApp
              </button>
              <button 
                onClick={() => setRoast(null)}
                className="py-5 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-700 transition-all"
              >
                <RefreshCw size={20} />
                Roast Another {roastType === 'cv' ? 'CV' : 'Cover Letter'}
              </button>
            </div>

            <div className="bg-primary/20 border border-primary/30 p-8 rounded-3xl text-center">
              <h4 className="text-xl font-bold mb-2">Actually want a better {roastType === 'cv' ? 'CV' : 'Cover Letter'}?</h4>
              <p className="text-slate-400 text-sm mb-6">
                Our experts can turn this roast into a masterpiece that gets you hired.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-3 bg-accent text-primary rounded-full font-bold hover:bg-accent-hover transition-all"
              >
                View Professional Services
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
