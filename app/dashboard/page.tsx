// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-hooks';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import JobMatchList from '@/components/JobMatchList';
import Link from 'next/link';
import { FiUser, FiBriefcase, FiClock, FiExternalLink, FiMapPin, FiAlertCircle, FiZap } from 'react-icons/fi';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedAt: Date;
  status: string;
  fitScore?: number;
  applyLink?: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      setLoading(true);
      
      // Check if profile exists
      const profileRef = doc(firestore, 'users', user.uid, 'profile', 'main');
      const profileSnap = await getDoc(profileRef);
      setHasProfile(profileSnap.exists());

      // Fetch user's applications (filter out old test data from Jan 4-6)
      const q = query(
        collection(firestore, 'applications'),
        where('userId', '==', user.uid),
        orderBy('appliedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const apps = (snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          appliedAt: doc.data().appliedAt?.toDate()
        }))
        .filter(app => app.appliedAt > new Date('2026-01-07')) // Hide old test data
      ) as Application[]; // ✅ FIXED: Type assertion wrapped in parentheses
      
      setApplications(apps);
      setLoading(false);
    };

    loadDashboard();
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
        <p className="text-slate-600">Please sign in to view dashboard</p>
        <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">CareerPilot Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your job search and applications</p>
        </div>
        
        <Link 
          href="/build-profile" 
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            hasProfile 
              ? 'border border-slate-300 text-slate-700 hover:bg-slate-50' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FiUser className="w-4 h-4 mr-2" />
          {hasProfile ? 'Edit Profile' : 'Build Profile'}
        </Link>
      </div>

      {/* Profile Warning - Only show if no profile */}
      {!hasProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <FiAlertCircle className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Profile Required</h3>
              <p className="text-amber-700 text-sm mt-1">
                Build your profile first to see personalized AI job matches. Without a profile, the AI cannot tailor results.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Job Matches */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <FiBriefcase className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">AI Job Matches</h2>
            </div>
            <JobMatchList />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Status Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Profile Status</h3>
            {hasProfile ? (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-green-800 font-medium">✅ Profile Active</p>
                <p className="text-green-700 text-sm mt-1">AI is personalizing your job search</p>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-slate-600">No profile configured</p>
              </div>
            )}
          </div>

          {/* Quick Stats - Only show if applications exist */}
          {applications.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Applications</span>
                  <span className="font-bold text-slate-900">{applications.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Avg. Fit Score</span>
                  <span className="font-bold text-slate-900">
                    {applications.length > 0 
                      ? `${Math.round(applications.reduce((acc, app) => acc + (app.fitScore || 0), 0) / applications.length)}%`
                      : '--'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application History Section - Only show if applications > 0 */}
      {applications.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiClock className="w-5 h-5 mr-2 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-900">Your Applications</h2>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {applications.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate">{app.jobTitle}</h3>
                    <p className="text-blue-600 text-sm truncate">{app.company}</p>
                  </div>
                  {app.fitScore && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      app.fitScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <FiZap className="w-3 h-3 mr-1 inline" />
                      {app.fitScore}% match
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <FiMapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{app.location}</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'applied' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {app.appliedAt.toLocaleDateString()}
                  </span>
                </div>
                
                {/* Smart Apply Button - Always show if applyLink exists */}
                {app.applyLink && (
                  <button
                    onClick={() => window.open(app.applyLink, '_blank', 'noopener,noreferrer')}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded text-sm flex items-center justify-center font-medium transition-colors"
                  >
                    <FiExternalLink className="w-3 h-3 mr-1" />
                    View Job
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Applications - Only show if profile exists but no applications */}
      {applications.length === 0 && hasProfile && (
        <div className="mt-12 text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
          <FiBriefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-800">No Applications Yet</h3>
          <p className="text-slate-600 text-sm mt-1">Click "Smart Apply" on job matches to start tracking your applications here</p>
        </div>
      )}
    </div>
  );
}
