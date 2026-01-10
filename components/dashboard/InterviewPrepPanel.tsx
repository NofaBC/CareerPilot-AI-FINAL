'use client';

export function InterviewPrepPanel({ userId }: { userId: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/15 border border-violet-400/40 text-violet-300 text-xs font-bold">
          3
        </span>
        Mock Interview Prep
      </h2>
      <div className="text-xs text-slate-100 text-center py-4">
        Select a job to generate personalized interview questions and coaching tips
      </div>
    </div>
  );
}
