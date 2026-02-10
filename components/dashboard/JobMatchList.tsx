'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ExternalLink, RefreshCw } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink?: string;
  salary?: string;
  fitScore?: number;
  matchingSkills?: string[];
  posted?: string;
}

export function JobMatchList({ userId }: { userId: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 sm:p-5 space-y-3 mb-16">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
            2
          </span>
          JobMatch Engine™
        </h2>
        <button 
          onClick={fetchJobs}
          disabled={loading}
          className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
          title="Refresh jobs"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-slate-400 text-sm mt-2">Scanning for matches...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-4 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {!loading && !error && jobs.length === 0 && (
        <div className="text-xs text-slate-100 text-center py-4">
          No jobs found. Try updating your profile.
        </div>
      )}
      
      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {jobs.map((job) => (
            <motion.div 
              key={job.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-white line-clamp-1">{job.title}</h3>
                  <p className="text-emerald-400 text-sm">{job.company}</p>
                  <div className="flex items-center text-xs text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {job.location}
                    {job.salary && <span className="ml-3">💰 {job.salary}</span>}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-emerald-400">{job.fitScore}%</div>
                  <div className="text-xs text-slate-400">Fit Score</div>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm line-clamp-2 mb-3">{job.description}</p>
              
              {job.matchingSkills && job.matchingSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.matchingSkills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">{job.posted || 'Recently'}</span>
                {job.applyLink && (
                  <a 
                    href={job.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-lg hover:bg-emerald-500/30 transition-colors"
                  >
                    Apply Now <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
