import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Building2, Sparkles, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { ai, apiKey } from '../services/geminiService';
import { View } from '../App';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  sourceUrl?: string;
}

export default function JobSearch({ navigateTo }: { navigateTo: (view: View, jobData?: any) => void }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Zambia');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchJobs = async (searchQuery?: string) => {
    const activeQuery = searchQuery || query;
    if (!activeQuery) return;
    
    setIsSearching(true);
    try {
      if (!apiKey && !(ai as any).apiKey) {
        alert("GEMINI_API_KEY is missing. Please set it in your environment variables or use the 'Connect AI' button.");
        setIsSearching(false);
        return;
      }
      
      // Use a more descriptive prompt to ensure the model uses the search tool effectively
      const prompt = `I need to find real, current job openings for "${activeQuery}" in "${location}". 
      Please use your Google Search tool to find actual listings from reputable sites like LinkedIn, Indeed, GoZambiaJobs, or company career pages. 
      
      CRITICAL: You MUST return the results as a JSON array of objects. 
      Each object must have: 
      - id: a unique string
      - title: the job title
      - company: the company name
      - location: the city or region
      - type: e.g., "Full-time", "Contract"
      - description: 1-2 sentences summarizing the role
      - requirements: an array of 3-5 key skills or qualifications
      - salary: the salary range or "Negotiable"
      - sourceUrl: the direct link to the job post
      
      If you cannot find any real jobs, return an empty array []. 
      Do NOT include any text outside of the JSON array.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }]
        }
      });

      if (response.text) {
        try {
          const results = JSON.parse(response.text);
          if (Array.isArray(results)) {
            setJobs(results);
            if (results.length === 0) {
              console.log("No jobs found for query:", activeQuery);
            }
          } else {
            console.error("Results is not an array:", results);
            setJobs([]);
          }
        } catch (e) {
          console.error("JSON Parse Error:", e);
          // Try to extract JSON if it's wrapped in markdown
          const jsonMatch = response.text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              const results = JSON.parse(jsonMatch[0]);
              setJobs(Array.isArray(results) ? results : []);
            } catch (innerE) {
              console.error("Inner JSON Parse Error:", innerE);
              setJobs([]);
            }
          } else {
            setJobs([]);
          }
        }
      }
    } catch (error: any) {
      console.error("Job search error:", error);
      if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key not valid')) {
        alert("The provided GEMINI_API_KEY is invalid. Please check your key.");
      } else {
        alert("Failed to fetch jobs. This could be due to a network issue or API limit.");
      }
    }
    setIsSearching(false);
  };

  // Initial jobs pull
  React.useEffect(() => {
    searchJobs('Latest jobs');
  }, []);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Find Your Next Opportunity</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Search for the latest jobs in Zambia and get AI-powered recommendations based on your profile.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company"
              className="bg-transparent border-none outline-none w-full text-primary font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <MapPin className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Location (e.g. Lusaka)"
              className="bg-transparent border-none outline-none w-full text-primary font-medium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
            />
          </div>
          <button 
            onClick={() => searchJobs()}
            disabled={isSearching}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[180px]"
          >
            {isSearching ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Searching Web...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Search Jobs</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-accent transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                      {job.salary}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.requirements.map((req, i) => (
                      <span key={i} className="bg-slate-50 text-slate-500 px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider">
                        {req}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => navigateTo('builder', job)}
                      className="text-accent text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Apply with OfferZM CV <ArrowRight size={16} />
                    </button>
                    <button 
                      onClick={() => job.sourceUrl && window.open(job.sourceUrl, '_blank')}
                      className="text-slate-400 hover:text-primary transition-colors"
                      title="View original listing"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : !isSearching && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-400">No jobs found yet</h3>
                <p className="text-slate-400 text-sm mb-6">Try searching for "Accountant" or "Software Developer"</p>
                <button 
                  onClick={() => searchJobs('Latest jobs')}
                  className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                >
                  Refresh Latest Jobs
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 text-accent opacity-50" size={32} />
              <h3 className="text-xl font-bold mb-4 relative z-10">AI Career Coach</h3>
              <p className="text-white/80 text-sm mb-6 relative z-10 leading-relaxed">
                Get personalized job recommendations and interview tips based on your CV.
              </p>
              <button 
                onClick={() => navigateTo('builder')}
                className="w-full bg-accent text-white py-3 rounded-2xl font-bold hover:bg-accent/90 transition-all relative z-10 shadow-lg"
              >
                Optimize My CV
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-primary mb-4">Popular Categories</h3>
              <div className="space-y-2">
                {['Finance', 'Technology', 'Healthcare', 'Education', 'Agriculture'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => { setQuery(cat); searchJobs(cat); }}
                    className="w-full text-left px-4 py-2 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all flex justify-between items-center"
                  >
                    {cat}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
