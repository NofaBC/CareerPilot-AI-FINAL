'use client';

import { useAuth } from '@/lib/firebase';
import {
  FiSearch,
import JobMatchList from '@/components/JobMatchList';
  FiBriefcase,
  FiCalendar,
  FiUser,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiTrendingUp,
  FiTarget,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPieChart,
  FiBarChart2,
  FiUpload,
  FiEye,
  FiUsers,
  FiZap,
  FiChevronRight,
  FiChevronDown
} from 'react-icons/fi';
import { useState } from 'react';
import ResumeUploader from '../components/ResumeUploader';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    agent: true,
    applications: true,
    insights: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-600">CareerPilot AI™</h1>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Analytics</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Settings</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
                <FiSettings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.email?.split('@')[0] || 'Job Seeker'}!</h2>
          <p className="text-gray-600 mt-1">Your AI-powered job search agent is working for you 24/7</p>
        </div>

        {/* Stats Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  +3 this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBriefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <FiCalendar className="w-3 h-3 mr-1" />
                  Next: Tomorrow
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">68%</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <FiActivity className="w-3 h-3 mr-1" />
                  +12% improvement
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiBarChart2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">AI Searches/Day</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                <p className="text-xs text-blue-600 mt-2 flex items-center">
                  <FiZap className="w-3 h-3 mr-1" />
                  Running continuously
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiSearch className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Job Matches Section */}
        <div className="mb-8">
          <JobMatchList />
        </div>

        {/* Agent Control Panel */}
        <div className="bg-white border border-gray-200 rounded-xl mb-8">
          <div 
            className="p-6 border-b border-gray-200 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection('agent')}
          >
            <div className="flex items-center space-x-3">
              <FiZap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Agent Control Center</h3>
            </div>
            {expandedSections.agent ? <FiChevronDown className="w-5 h-5 text-gray-500" /> : <FiChevronRight className="w-5 h-5 text-gray-500" />}
          </div>
          {expandedSections.agent && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Agent Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Active Job Search</p>
                          <p className="text-sm text-gray-600">Searching for Senior Frontend roles</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Running</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FiClock className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">LinkedIn Optimization</p>
                          <p className="text-sm text-gray-600">Scheduled for tonight 2:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiClock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-600">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      <FiSearch className="w-4 h-4" />
                      <span>Start New Search</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiSettings className="w-4 h-4" />
                      <span>Configure Agent</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiEye className="w-4 h-4" />
                      <span>View Logs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Applications Section */}
        <div className="bg-white border border-gray-200 rounded-xl mb-8">
          <div 
            className="p-6 border-b border-gray-200 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection('applications')}
          >
            <div className="flex items-center space-x-3">
              <FiBriefcase className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            </div>
            {expandedSections.applications ? <FiChevronDown className="w-5 h-5 text-gray-500" /> : <FiChevronRight className="w-5 h-5 text-gray-500" />}
          </div>
          {expandedSections.applications && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">G</span>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">Google</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Senior Frontend Engineer</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Interview</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 days ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">A</span>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">Amazon</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Frontend Developer II</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Screening</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">M</span>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">Microsoft</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">React Developer</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Applied</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All Applications</button>
              </div>
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div 
            className="p-6 border-b border-gray-200 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection('insights')}
          >
            <div className="flex items-center space-x-3">
              <FiPieChart className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            </div>
            {expandedSections.insights ? <FiChevronDown className="w-5 h-5 text-gray-500" /> : <FiChevronRight className="w-5 h-5 text-gray-500" />}
          </div>
          {expandedSections.insights && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RESUME UPLOADER REPLACES THE OLD APPLICATION PERFORMANCE SECTION */}
                <ResumeUploader />
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Recommendations</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">Add TypeScript Skill</p>
                      <p className="text-xs text-gray-600 mt-1">60% of target jobs require TypeScript proficiency</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">Optimize LinkedIn Profile</p>
                      <p className="text-xs text-gray-600 mt-1">AI detected 3 improvement opportunities</p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">Resume Tailoring</p>
                      <p className="text-xs text-gray-600 mt-1">Increase customization for better ATS matching</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
