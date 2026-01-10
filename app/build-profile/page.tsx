'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-hooks';
import { firestore } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FiUser, FiTarget, FiMapPin, FiDollarSign, FiSave } from 'react-icons/fi';
import { extractProfileFromResume, updateExtractedProfileData } from '@/lib/profile-service';

export default function BuildProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    resume: '',
    targetRole: '',
    location: '',
    minSalary: '',
    maxSalary: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to create a profile');
      return;
    }

    setLoading(true);
    try {
      // 1. Save basic profile
      await setDoc(doc(firestore, 'users', user.uid, 'profile', 'main'), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 2. AI Extract skills from resume
      const extractedData = await extractProfileFromResume(user.uid, formData.resume);
      
      // 3. Save extracted data
      await updateExtractedProfileData(user.uid, extractedData);

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <FiUser className="w-10 h-10 mr-3 text-blue-600" />
          Build Your Career Profile
        </h1>
        <p className="text-gray-600 text-lg">
          Tell us about yourself so our AI can find the perfect job matches for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        {/* Resume/Bio Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FiSave className="w-6 h-6 mr-2 text-blue-600" />
            Your Background
          </h2>
          <label className="block text-sm font-medium text-gray-700">
            Paste your resume, LinkedIn bio, or work experience
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={formData.resume}
            onChange={(e) => handleChange('resume', e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Full Stack Developer with 5 years experience in React, Node.js, and TypeScript..."
            required
          />
          <p className="text-sm text-gray-500">
            Our AI will extract your skills and experience to find the best matches.
          </p>
        </div>

        {/* Job Preferences Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FiTarget className="w-6 h-6 mr-2 text-green-600" />
            What You're Looking For
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Job Title<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => handleChange('targetRole', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg"
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg"
                placeholder="e.g. Remote, New York, San Francisco"
              />
            </div>
          </div>
        </div>

        {/* Salary Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FiDollarSign className="w-6 h-6 mr-2 text-green-600" />
            Salary Expectations
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary
              </label>
              <input
                type="text"
                value={formData.minSalary}
                onChange={(e) => handleChange('minSalary', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg"
                placeholder="e.g. $80k"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary
              </label>
              <input
                type="text"
                value={formData.maxSalary}
                onChange={(e) => handleChange('maxSalary', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg"
                placeholder="e.g. $120k"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Profile...
              </>
            ) : (
              <>
                Generate My Profile
                <FiSave className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
