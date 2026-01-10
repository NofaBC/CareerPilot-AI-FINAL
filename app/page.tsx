import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-slate-50">CareerPilot AI™</h1>
          <p className="text-xl text-slate-300">Autonomous Job Hunt Agent</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-emerald-500 text-slate-900 px-6 py-3 rounded-lg font-semibold">
              Start Free Trial
            </Link>
            <Link href="/login" className="border border-slate-600 text-slate-200 px-6 py-3 rounded-lg">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
