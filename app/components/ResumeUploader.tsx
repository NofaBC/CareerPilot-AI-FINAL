'use client';

import { useState } from 'react';
import { FiUpload, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { firestore, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-hooks';

export default function ResumeUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { user } = useAuth();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;

    setUploading(true);
    const file = e.target.files[0];

    try {
      // Upload to Firebase Storage
      const filePath = `resumes/${user.uid}/${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await setDoc(doc(firestore, 'resumes', user.uid), {
        fileName: file.name,
        downloadURL,
        uploadedAt: new Date(),
        fileType: file.type,
        fileSize: file.size,
      }, { merge: true });

      setUploaded(true);

      // Call API to analyze resume
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, filePath }),
      });

      const result = await response.json();
      setAnalysis(result.analysis);
      setUploading(false);

    } catch (error) {
      console.error('Upload/analysis failed:', error);
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiFileText className="w-5 h-5 mr-2 text-blue-600" />
        Resume Upload & AI Analysis
      </h3>

      {!uploaded ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading & Analyzing...' : 'Click to upload resume (PDF, DOCX)'}
          </span>
          <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleUpload} disabled={uploading} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <FiCheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Resume uploaded & analyzed!</p>
              {analysis && (
                <p className="text-sm text-gray-600">Match Score: {analysis.matchScore}%</p>
              )}
            </div>
          </div>
          
          {analysis && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Experience Level: {analysis.experienceLevel}</li>
                <li>• Key Skills: {analysis.skills?.slice(0, 3).join(', ')}</li>
                <li>• Recommendation: {analysis.recommendations?.[0]}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
