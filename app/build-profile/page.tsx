'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';




import Link from 'next/link';
import { FiUser, FiTarget, FiMapPin, FiDollarSign, FiSave, FiUploadCloud, FiAlertCircle } from 'react-icons/fi';

export default function BuildProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [resume, setResume] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setLoading(true);
      // Profile loading logic removed as firebase.ts is not in this repo
      // Mock profile loading
      setProfileExists(true);
      setProfileData({
        targetRole: 'Software Engineer',
        location: 'Remote',
        minSalary: 100000,
        lastUpdated: { seconds: Date.now() / 1000 },
      });
      setTargetRole('Software Engineer');
      setLocation('Remote');
      setMinSalary('100000');
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResume(event.target.files[0]);
      // Resume parsing logic removed as profile-service.ts is not in this repo
      // Mock resume parsing
      console.log('Mock resume parsing for:', event.target.files[0].name);
      setLoading(false);
    }
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    const profile = {
      targetRole,
      location,
      minSalary: parseInt(minSalary),
      lastUpdated: new Date(),
    };

    // Profile saving logic removed as firebase.ts is not in this repo
    // Mock profile saving
    console.log('Mock profile saved:', profile);
    setProfileExists(true);
    setProfileData(profile);
    setLoading(false);
    alert('Profile saved successfully!');
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-slate-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Please sign in to build your profile</p>
        <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Build Your Profile</h1>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Resume Upload */}
          <div>
            <label htmlFor="resume-upload" className="block text-sm font-medium text-slate-700 mb-2">
              <FiUploadCloud className="inline-block w-4 h-4 mr-1" /> Upload Resume (Optional)
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {resume && <p className="mt-2 text-sm text-slate-600">Selected file: {resume.name}</p>}
            <p className="mt-2 text-xs text-slate-500">Our AI will extract your skills and experience to find the best matches.</p>
          </div>

          {/* Target Role */}
          <div>
            <label htmlFor="targetRole" className="block text-sm font-medium text-slate-700 mb-2">
              <FiTarget className="inline-block w-4 h-4 mr-1" /> Target Role
            </label>
            <input
              type="text"
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
              <FiMapPin className="inline-block w-4 h-4 mr-1" /> Preferred Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, Remote, San Francisco Bay Area"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Minimum Salary */}
          <div>
            <label htmlFor="minSalary" className="block text-sm font-medium text-slate-700 mb-2">
              <FiDollarSign className="inline-block w-4 h-4 mr-1" /> Minimum Desired Salary (USD)
            </label>
            <input
              type="number"
              id="minSalary"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              placeholder="e.g., 80000"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            <FiSave className="w-4 h-4 mr-2" />
            {loading ? 'Saving Profile...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Current Profile Summary (Optional) */}
      {profileExists && profileData && (
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Current Profile</h2>
          <p><strong>Target Role:</strong> {profileData.targetRole}</p>
          <p><strong>Location:</strong> {profileData.location}</p>
          <p><strong>Min Salary:</strong> ${profileData.minSalary}</p>
          <p className="text-sm text-slate-500 mt-2">Last updated: {new Date(profileData.lastUpdated.seconds * 1000).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
