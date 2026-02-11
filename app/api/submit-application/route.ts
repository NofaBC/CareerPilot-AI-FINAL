import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { userId, jobId, jobTitle, company, applyLink, coverLetter, status = 'applied' } = await request.json();

    if (!userId || !jobTitle || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const applicationRef = db.collection('applications').doc();
    await applicationRef.set({
      userId,
      jobId,
      jobTitle,
      company,
      applyLink,
      coverLetter,
      status,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error) {
    console.error('/api/submit-application error:', error);
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
  }
}
