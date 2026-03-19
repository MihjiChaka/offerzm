import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Layout, 
  Users, 
  CheckCircle, 
  MessageSquare, 
  ArrowRight, 
  Download, 
  Plus, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  CreditCard,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import CVBuilder from './components/CVBuilder';
import Templates from './components/Templates';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Dashboard from './components/Dashboard';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import CVRoast from './components/CVRoast';
import JobSearch from './components/JobSearch';
import Terms from './components/Terms';
import Privacy from './components/Privacy';

export type View = 'home' | 'builder' | 'templates' | 'dashboard' | 'services' | 'cover-letter-builder' | 'roast' | 'terms' | 'privacy' | 'jobs';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (view: View, jobData?: any) => {
    if (jobData) setSelectedJob(jobData);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    if (id.includes('cover')) {
      navigateTo('cover-letter-builder');
    } else {
      navigateTo('builder');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-accent-soft">
      <Navbar 
        currentView={currentView} 
        navigateTo={navigateTo} 
        isScrolled={isScrolled} 
      />
      
      <main>
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero navigateTo={navigateTo} />
              <Services navigateTo={navigateTo} />
              <div className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Get your professional CV in three simple steps.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { step: "01", title: "Fill Details", desc: "Enter your personal info, experience, and skills into our intuitive builder." },
                      { step: "02", title: "Expert Optimization", desc: "Our system suggests powerful phrasing and optimizes your content for ATS." },
                      { step: "03", title: "Download & Apply", desc: "Choose a premium template and download your polished CV as a PDF." }
                    ].map((item, i) => (
                      <div key={i} className="relative p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-5xl font-display font-bold text-accent-muted absolute top-4 right-4">{item.step}</span>
                        <h3 className="text-xl font-bold text-primary mb-3 relative z-10">{item.title}</h3>
                        <p className="text-slate-600 relative z-10">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Templates navigateTo={navigateTo} onSelectTemplate={handleSelectTemplate} limit={3} />
              <Testimonials />
            </motion.div>
          )}

          {currentView === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CVBuilder navigateTo={navigateTo} templateId={selectedTemplate} selectedJob={selectedJob} />
            </motion.div>
          )}

          {currentView === 'cover-letter-builder' && (
            <motion.div
              key="cover-letter-builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CoverLetterBuilder navigateTo={navigateTo} templateId={selectedTemplate.replace('cover-', '')} />
            </motion.div>
          )}

          {currentView === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Templates navigateTo={navigateTo} onSelectTemplate={handleSelectTemplate} />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Dashboard navigateTo={navigateTo} />
            </motion.div>
          )}
          
          {currentView === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Services navigateTo={navigateTo} fullPage />
            </motion.div>
          )}

          {currentView === 'roast' && (
            <motion.div
              key="roast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CVRoast />
            </motion.div>
          )}

          {currentView === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JobSearch navigateTo={navigateTo} />
            </motion.div>
          )}

          {currentView === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Terms />
            </motion.div>
          )}

          {currentView === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Privacy />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer 
        navigateTo={navigateTo} 
        onShowTerms={() => setShowTerms(true)}
        onShowPrivacy={() => setShowPrivacy(true)}
      />
      <WhatsAppButton />

      {/* Modals */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-primary">Terms of Service</h3>
                <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Terms />
              </div>
            </motion.div>
          </div>
        )}

        {showPrivacy && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-primary">Privacy Policy</h3>
                <button onClick={() => setShowPrivacy(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Privacy />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
