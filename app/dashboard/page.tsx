"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, firestore } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  Briefcase, Target, Send, Mic2, ChevronRight, LayoutDashboard,
  User, Search, FileText, Star, Settings, LogOut, BarChart3
} from 'lucide-react';
import { JobMatchList } from '@/components/JobMatchList';
import { FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    profileComplete: 0,
    jobsQueued: 0,
    interviewsScheduled: 0,
    matchedThisWeek: 0,
    applicationsSent: 0,
    responsesReceived: 0,
    interviewsBooked: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Fetch profile and applications to calculate stats
          const profileQuery = query(collection(firestore, "users"), where("uid", "==", currentUser.uid));
          const profileSnap = await getDocs(profileQuery);
          let pData: any = {};
          if (!profileSnap.empty) {
            pData = profileSnap.docs[0].data();
            setProfile(pData);
          }

          const applicationsQuery = query(collection(firestore, "applications"), where("userId", "==", currentUser.uid));
          const applicationsSnap = await getDocs(applicationsQuery);
          const applications = applicationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setApplications(applications);

          // Calculate stats
          const profileCompletion = pData?.targetRole && pData?.location && pData?.skills?.length > 0 ? 100 : 50;
          const jobsQueuedCount = 12; // Placeholder
          const interviewsScheduledCount = applications.filter(app => app.status === 'interview').length;
          const matchedThisWeekCount = 7; // Placeholder
          const applicationsSentCount = applications.length;
          const responsesReceivedCount = applications.filter(app => app.status === 'viewed' || app.status === 'interview').length;
          const interviewsBookedCount = applications.filter(app => app.status === 'interview').length;

          setStats({
            profileComplete: profileCompletion,
            jobsQueued: jobsQueuedCount,
            interviewsScheduled: interviewsScheduledCount,
            matchedThisWeek: matchedThisWeekCount,
            applicationsSent: applicationsSentCount,
            responsesReceived: responsesReceivedCount,
            interviewsBooked: interviewsBookedCount
          });

        } catch (e) {
          console.error("Error fetching dashboard data:", e);
        }
        finally { setIsLoading(false); }
      } else { window.location.href = '/login'; }
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
          <LayoutDashboard className="absolute inset-0 m-auto w-10 h-10 text-blue-500" />
        </div>
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Initializing AI Command Center...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col fixed h-full z-[50]">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="text-white w-7 h-7" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">CareerPilot<span className="text-blue-500">AI</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Command Center', path: '/dashboard', active: true },
            { id: 'profile', icon: User, label: 'My Profile', path: '/profile/edit' },
            { id: 'jobs', icon: Search, label: 'Job Search', path: '/dashboard' },
            { id: 'applications', icon: FileText, label: 'My Applications', path: '/dashboard' },
            { id: 'interview', icon: Mic2, label: 'Interview Coach', path: '/dashboard/interview' },
            { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => item.path && (window.location.href = item.path)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${
                item.active
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <button onClick={() => auth.signOut().then(() => window.location.href = '/')} className="w-full flex items-center gap-4 p-4 text-rose-500/70 hover:bg-rose-500/10 rounded-2xl font-bold transition-all"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 relative z-10">
        {/* Hero Panel */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-blue-600/20 to-indigo-700/20 backdrop-blur-md p-10 rounded-[40px] border border-white/10 shadow-2xl mb-16"
        >
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">Your 60–90 Day Job Search Campaign</h1>
          <p className="text-blue-200 text-lg mb-8">
            Profile: {stats.profileComplete}% complete &middot; {stats.jobsQueued} jobs queued &middot; {stats.interviewsScheduled} interviews scheduled
          </p>
          <button className="bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30">
            Continue Campaign <ChevronRight className="w-5 h-5" />
          </button>
        </motion.section>

        {/* Main Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Tile 1: Build / Refine Profile */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-blue-400" /></div>
              <h2 className="font-black text-2xl text-white">Build / Refine Profile</h2>
            </div>
            <p className="text-slate-400 mb-6 flex-1">Tell CareerPilot who you are. We extract skills, experience, and target roles.</p>
            <button onClick={() => window.location.href = '/profile/edit'} className="bg-blue-700/30 text-blue-300 font-bold py-3 px-6 rounded-full text-md hover:bg-blue-600/50 transition-all">
              Update Profile
            </button>
          </motion.div>

          {/* Tile 2: Find & Score Jobs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center"><Search className="w-6 h-6 text-indigo-400" /></div>
              <h2 className="font-black text-2xl text-white">Find & Score Jobs</h2>
            </div>
            <p className="text-slate-400 mb-6 flex-1">Search for roles. See 0–100% Fit Scores with explanations.</p>
            <button onClick={() => document.getElementById('job-matches')?.scrollIntoView({ behavior: 'smooth' })} className="bg-indigo-700/30 text-indigo-300 font-bold py-3 px-6 rounded-full text-md hover:bg-indigo-600/50 transition-all">
              Search Jobs
            </button>
          </motion.div>

          {/* Tile 3: Smart Apply */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center"><Send className="w-6 h-6 text-green-400" /></div>
              <h2 className="font-black text-2xl text-white">Smart Apply</h2>
            </div>
            <p className="text-slate-400 mb-6 flex-1">Generate tailored cover letters and track applications.</p>
            <button onClick={() => document.getElementById('applications')?.scrollIntoView({ behavior: 'smooth' })} className="bg-green-700/30 text-green-300 font-bold py-3 px-6 rounded-full text-md hover:bg-green-600/50 transition-all">
              Open Applications
            </button>
          </motion.div>

          {/* Tile 4: Interview Coach */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center"><Mic2 className="w-6 h-6 text-purple-400" /></div>
              <h2 className="font-black text-2xl text-white">Interview Coach</h2>
            </div>
            <p className="text-slate-400 mb-6 flex-1">Practice with AI before the real interview.</p>
            <button onClick={() => window.location.href = '/dashboard/interview'} className="bg-purple-700/30 text-purple-300 font-bold py-3 px-6 rounded-full text-md hover:bg-purple-600/50 transition-all">
              Start Interview Practice
            </button>
          </motion.div>
        </div>

        {/* Job Matches Section */}
        <section id="job-matches" className="mb-16">
          <JobMatchList userId={user.uid} />
        </section>

        {/* Applications Section - only if there are applications */}
        {applications.length > 0 && (
          <section id="applications" className="mb-16">
            <div className="flex items-center mb-6">
              <FiCalendar className="w-6 h-6 mr-2 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Your Applications</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {app.jobTitle}
                      </h3>
                      <p className="text-blue-400 font-medium">{app.company}</p>
                      {app.location && (
                        <p className="text-sm text-slate-400 mt-1 flex items-center">
                          <FiMapPin className="w-3 h-3 mr-1" />
                          {app.location}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      app.status === 'offer' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      app.status === 'interview' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      app.status === 'screening' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    {app.applyLink && (
                      <a 
                        href={app.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        View Job <FiExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Campaign Analytics */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 shadow-xl"
        >
          <h2 className="font-black text-2xl text-white tracking-tight mb-6 flex items-center gap-3"><BarChart3 className="w-6 h-6 text-blue-400" /> Campaign Analytics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="px-4">
              <div className="text-3xl font-black text-white mb-1">{stats.matchedThisWeek}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Jobs matched this week</div>
            </div>
            <div className="px-4 border-l border-white/5">
              <div className="text-3xl font-black text-white mb-1">{stats.applicationsSent}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Applications sent</div>
            </div>
            <div className="px-4 border-l border-white/5">
              <div className="text-3xl font-black text-white mb-1">{stats.responsesReceived}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Responses received</div>
            </div>
            <div className="px-4 border-l border-white/5">
              <div className="text-3xl font-black text-white mb-1">{stats.interviewsBooked}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Interviews booked</div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
