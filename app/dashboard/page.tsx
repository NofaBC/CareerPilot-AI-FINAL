'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBriefcase, FiClock, FiZap, FiUser, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';





export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  interface Application {
    id: string;
    company: string;
    role: string;
    status: string;
  }

  const [applications, setApplications] = useState<Application[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      // Mock data for applications and profile
      setApplications([
        { id: '1', company: 'Tech Corp', role: 'Software Engineer', status: 'Applied' },
        { id: '2', company: 'Innovate Inc', role: 'Product Manager', status: 'Interviewing' },
      ]);
      setHasProfile(true);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Please sign in to view your dashboard</p>
        <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Campaign Dashboard</h1>

      {!hasProfile && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg flex items-center justify-between shadow-sm mb-8">
          <div className="flex items-center">
            <FiAlertCircle className="w-6 h-6 mr-3" />
            <p className="text-lg">You haven't built your profile yet!</p>
          </div>
          <Link href="/build-profile" className="bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
            Build Profile <FiChevronRight className="inline-block ml-1" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex items-center text-slate-700">
              <FiBriefcase className="w-5 h-5 mr-3 text-blue-500" />
              <span>Applications Sent: {applications.length}</span>
            </div>
            <div className="flex items-center text-slate-700">
              <FiClock className="w-5 h-5 mr-3 text-green-500" />
              <span>Response Rate: 0%</span>
            </div>
            <div className="flex items-center text-slate-700">
              <FiZap className="w-5 h-5 mr-3 text-purple-500" />
              <span>Interviews: 0</span>
            </div>
          </div>
        </div>

        {/* Target Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Target Profile</h2>
          <div className="flex items-center text-slate-700 mb-3">
            <FiUser className="w-5 h-5 mr-3 text-orange-500" />
            <span>{hasProfile ? 'Profile Complete' : 'No Profile Yet'}</span>
          </div>
          <Link href="/build-profile" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Edit Profile <FiChevronRight className="inline-block ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Match List (Removed for MVP) */}
        {/* <JobMatchList userId={user.uid} /> */}

        {/* Interview Prep Panel (Removed for MVP) */}
        {/* <InterviewPrepPanel userId={user.uid} /> */}
      </div>
    </div>
  );
}
