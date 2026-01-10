'use client';
import { useState } from 'react';

export function JobMatchList({ userId }: { userId: string }) {
  const [jobs, setJobs] = useState([]);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 sm:p-5 space-y-3">
      <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
          2
        </span>
        JobMatch Engine™
      </h2>
      <button className="w-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 py-2 rounded-lg hover:bg-emerald-500/20">
        Scan for Job Matches
      </button>
      <div className="text-xs text-slate-100 text-center py-4">
        Click "Scan for Job Matches" to see AI-generated job recommendations
      </div>
    </div>
  );
}
