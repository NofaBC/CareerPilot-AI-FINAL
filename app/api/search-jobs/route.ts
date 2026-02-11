import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Fetch user profile from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const profile = userDoc.data();
    const searchQuery = `${profile.targetRole || 'software engineer'} in ${profile.location || 'remote'}`;
    const skills = profile.skills || [];

    // Call JSearch API
    const jsearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1`;
    const response = await fetch(jsearchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY!,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      console.error('JSearch API error:', response.status, await response.text());
      return NextResponse.json({ error: 'Failed to fetch jobs from JSearch' }, { status: 500 });
    }

    const data = await response.json();
    const jobs = data.data || [];

    // Calculate fit scores
    const scoredJobs = jobs.map((job: any) => {
      const jobSkills = job.skills?.map((s: any) => s.skill_name?.toLowerCase() || '') || [];
      const matchingSkills = skills.filter((userSkill: string) =>
        jobSkills.some((jobSkill: string) =>
          jobSkill.includes(userSkill.toLowerCase()) || userSkill.toLowerCase().includes(jobSkill)
        )
      );
      const fitScore = Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 100);

      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city ? `${job.job_city}, ${job.job_state}` : 'Remote',
        description: job.job_description?.slice(0, 300) + '...',
        applyLink: job.job_apply_link,
        salary: job.job_salary?.min ? `${job.job_salary.min.toLocaleString()} - ${job.job_salary.max?.toLocaleString() || ''}` : 'Not disclosed',
        fitScore,
        matchingSkills: matchingSkills.slice(0, 5),
        posted: job.job_posted_at ? new Date(job.job_posted_at).toLocaleDateString() : 'Recent',
      };
    }).sort((a: any, b: any) => b.fitScore - a.fitScore).slice(0, 10);

    return NextResponse.json({ jobs: scoredJobs });
  } catch (error) {
    console.error('/api/search-jobs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
