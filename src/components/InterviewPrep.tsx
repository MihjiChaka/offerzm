import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  PlayCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { getExpertSuggestions } from '../services/geminiService';

export default function InterviewPrep() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState('');

  const generateQuestions = async () => {
    if (!jobTitle) return;
    setIsGenerating(true);
    const result = await getExpertSuggestions('interview_prep', jobTitle);
    // Split by lines and filter empty
    const qList = result.split('\n').filter(q => q.trim().length > 0).slice(0, 5);
    setQuestions(qList);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary">Interview Preparation</h2>
        <p className="text-slate-500 text-sm">Get expert-generated interview questions and tips tailored to your target role.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="max-w-xl">
          <label className="text-sm font-bold text-slate-700 block mb-2">Target Job Title</label>
          <div className="flex gap-4">
            <input 
              placeholder="e.g. Senior Accountant"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-accent"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <button 
              onClick={generateQuestions}
              disabled={isGenerating || !jobTitle}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Generate Questions
            </button>
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <MessageSquare size={18} className="text-accent" />
              Common Interview Questions
            </h3>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 group cursor-pointer hover:border-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-primary transition-colors font-bold text-xs">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-700 font-medium pt-1">{q}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <BookOpen size={18} className="text-accent" />
              Preparation Tips
            </h3>
            <div className="bg-primary text-white p-8 rounded-3xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <h4 className="font-bold mb-4">The STAR Method</h4>
                <p className="text-sm text-white/80 leading-relaxed mb-6">
                  Use the Situation, Task, Action, and Result method to answer behavioral questions effectively.
                </p>
                <div className="space-y-3">
                  {['Research the company culture', 'Prepare your own questions', 'Practice your elevator pitch'].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle size={16} className="text-accent" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full py-3 bg-accent text-primary rounded-xl font-bold hover:bg-accent-hover transition-all flex items-center justify-center gap-2">
                <PlayCircle size={18} />
                Watch Mock Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
