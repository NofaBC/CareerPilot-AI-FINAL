'use client';

export function ProfileSummary({ userId }: { userId: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 space-y-2">
      <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 text-[11px] font-bold">
          AI
        </span>
        Profile Summary
      </h3>
      <p className="text-xs sm:text-[13px] text-slate-100 leading-relaxed">
        Generate a profile to see your AI-powered summary here.
      </p>
    </div>
  );
}
