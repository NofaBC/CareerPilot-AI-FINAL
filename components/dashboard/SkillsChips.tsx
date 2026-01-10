'use client';

export function SkillsChips({ userId }: { userId: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 space-y-2">
      <h3 className="text-sm font-semibold text-slate-50">
        Skills Extracted
      </h3>
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-600 text-slate-100">
          Resume parsing pending…
        </span>
      </div>
    </div>
  );
}
