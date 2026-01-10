'use client';
import { useState } from 'react';

export function ProfileForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
          1
        </span>
        Build Your Career Profile
      </h2>
      
      <p className="text-sm text-slate-50">
        Fill in your details and click "Save Profile" to create your AI-powered career profile.
      </p>

      <form className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-slate-900 py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-emerald-400"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
