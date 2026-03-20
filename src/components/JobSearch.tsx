import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Building2, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { ai, apiKey, withTimeout } from '../services/geminiService';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastQuery, setLastQuery] = useState('Latest jobs');

  const searchJobs = async (searchQuery?: string, isLoadMore = false) => {
    const activeQuery = searchQuery || query || lastQuery;
    if (!activeQuery) return;
    
    const currentPage = isLoadMore ? page + 1 : 1;
    setIsSearching(true);
    
    // Get existing job titles to avoid duplicates
    const existingJobTitles = isLoadMore ? jobs.map(j => `${j.title} at ${j.company}`).join(', ') : '';
    
    // Only clear jobs and show full skeleton if it's a fresh search
    if (!isLoadMore) {
      setJobs([]);
      setLastQuery(activeQuery);
    }
    
    try {
      if (!apiKey && !(ai as any).apiKey) {
        alert("GEMINI_API_KEY is missing. Please set it in your environment variables or use the 'Connect AI' button.");
        setIsSearching(false);
        return;
      }
      
      const prompt = `I need to find real, current job openings for "${activeQuery}" in "${location}". 
      This is page ${currentPage} of the results. 
      CRITICAL: You MUST provide a COMPLETELY DIFFERENT set of 5-8 jobs than the previous pages. 
      ${existingJobTitles ? `Do NOT repeat any of these jobs: ${existingJobTitles}.` : ''}
      Please use your Google Search tool to find actual listings from reputable sites like LinkedIn, Indeed, GoZambiaJobs, or company career pages. 
      
      Return the results as a JSON array of objects. 
      Each object must have: 
      - id: a unique string (e.g., "job_123")
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

      let response;
      try {
        // Use a shorter timeout for the web search to fail fast and fallback
        response = await withTimeout(ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { 
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }]
          }
        }), 25000); // 25s for web search
      } catch (searchError: any) {
        console.warn("Live search failed or timed out, falling back to internal knowledge:", searchError);
        // Fallback: Try without the search tool if the search tool fails or times out
        response = await withTimeout(ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Provide a list of 5 typical, high-probability job openings for "${activeQuery}" in "${location}" based on your internal knowledge of the Zambian job market. 
          Return the results as a JSON array of objects with fields: id, title, company, location, type, description, requirements (array), salary, sourceUrl (use a generic search link like "https://www.google.com/search?q=jobs+in+zambia").`,
          config: { responseMimeType: "application/json" }
        }), 15000); // 15s for fallback
      }

      if (response.text) {
        try {
          const results = JSON.parse(response.text);
          if (Array.isArray(results)) {
            if (isLoadMore) {
              setJobs(prev => [...prev, ...results]);
            } else {
              setJobs(results);
            }
            setPage(currentPage);
            setHasMore(results.length >= 5);
            if (results.length === 0) {
              console.log("No jobs found for query:", activeQuery);
            }
          } else {
            console.error("Results is not an array:", results);
            if (!isLoadMore) setJobs([]);
            setHasMore(false);
          }
        } catch (e) {
          console.error("JSON Parse Error:", e);
          // Try to extract JSON if it's wrapped in markdown
          const jsonMatch = response.text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              const results = JSON.parse(jsonMatch[0]);
              const finalResults = Array.isArray(results) ? results : [];
              if (isLoadMore) {
                setJobs(prev => [...prev, ...finalResults]);
              } else {
                setJobs(finalResults);
              }
              setPage(currentPage);
              setHasMore(finalResults.length >= 5);
            } catch (innerE) {
              console.error("Inner JSON Parse Error:", innerE);
              if (!isLoadMore) setJobs([]);
              setHasMore(false);
            }
          } else {
            if (!isLoadMore) setJobs([]);
            setHasMore(false);
          }
        }
      }
    } catch (error: any) {
      console.error("Job search error:", error);
      const errorMessage = error?.message || String(error);
      
      if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key not valid')) {
        alert("The provided GEMINI_API_KEY is invalid. Please check your key.");
      } else if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        alert("AI Search limit reached. Please try again in a few minutes.");
      } else {
        alert(`Search Error: ${errorMessage.substring(0, 100)}${errorMessage.length > 100 ? '...' : ''}`);
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
            {isSearching && jobs.length === 0 ? (
              // Loading Skeleton for initial search
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse">
                    <div className="flex justify-between mb-4">
                      <div className="h-6 bg-slate-100 rounded-lg w-1/2"></div>
                      <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                    </div>
                    <div className="h-4 bg-slate-50 rounded-lg w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-50 rounded-lg w-1/2 mb-6"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-50 rounded-lg w-16"></div>
                      <div className="h-6 bg-slate-50 rounded-lg w-16"></div>
                    </div>
                  </div>
                ))}
                <div className="text-center py-4">
                  <p className="text-sm text-slate-400 animate-bounce">Searching Zambian job boards and LinkedIn...</p>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <>
                {jobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-accent transition-all group mb-6"
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => navigateTo('builder', job)}
                        className="text-accent text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Apply with OfferZM CV <ArrowRight size={16} />
                      </button>
                      <button 
                        onClick={() => navigateTo('cover-letter-builder', job)}
                        className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Tailor Cover Letter <ArrowRight size={16} />
                      </button>
                      <div className="flex-1" />
                      <button 
                        onClick={() => job.sourceUrl && window.open(job.sourceUrl, '_blank')}
                        className="text-slate-400 hover:text-primary transition-colors"
                        title="View original listing"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {hasMore && (
                  <div className="text-center py-8">
                    <button 
                      onClick={() => searchJobs(lastQuery, true)}
                      disabled={isSearching}
                      className="px-8 py-3 bg-white border border-slate-200 text-primary rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {isSearching ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} className="rotate-90" />}
                      {isSearching ? 'Loading More...' : 'Load More Jobs'}
                    </button>
                  </div>
                )}
              </>
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
