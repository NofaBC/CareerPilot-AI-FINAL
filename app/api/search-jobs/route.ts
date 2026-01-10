import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink?: string;
  posted?: string;
  salary?: string;
  remote?: boolean;
  fitScore?: number;
  matchingSkills?: string[];
  category?: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Fetch user profile
    let userProfile = null;
    let extractedSkills: string[] = [];
    let userLocation = 'Rockville, MD'; // Default fallback
    let targetRole = '';

    if (userId) {
      try {
        const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          userProfile = profileSnap.data();
          extractedSkills = userProfile?.extractedData?.skills || [];
          userLocation = userProfile?.location || 'Rockville, MD';
          targetRole = userProfile?.targetRole || '';
          console.log('✅ Profile found. Location:', userLocation, 'Target role:', targetRole);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    // Mock jobs for ALL professions
    const mockJobs: Job[] = [
      // Tech Jobs
      {
        id: '1',
        title: 'Full-Stack Engineer',
        company: 'StartupXYZ',
        location: userLocation,
        description: `Join our ${userLocation} team as a Software Developer. Skills: JavaScript, Web Development, React, Node.js.`,
        applyLink: `https://www.linkedin.com/jobs/search/?keywords=full%20stack%20engineer&location=${encodeURIComponent(userLocation)}`,
        salary: '$100k - $150k',
        posted: '1 week ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['javascript', 'web development', 'react', 'node'], extractedSkills),
        matchingSkills: ['javascript', 'web development'],
        category: 'tech'
      },
      {
        id: '2',
        title: 'Senior Software Developer',
        company: 'DesignFirst Agency',
        location: userLocation,
        description: `Senior Software Developer for ${userLocation}. JavaScript, TypeScript, React required.`,
        applyLink: `https://www.indeed.com/q-senior-software-developer-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$110k - $160k',
        posted: '1 day ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['javascript', 'typescript', 'react'], extractedSkills),
        matchingSkills: ['javascript', 'typescript'],
        category: 'tech'
      },
      // Non-Tech Jobs
      {
        id: '6',
        title: 'Executive Chef',
        company: 'Metropolitan Restaurant Group',
        location: userLocation,
        description: `Lead kitchen operations in ${userLocation}. Menu development, team management, cost control, French cuisine expertise.`,
        applyLink: `https://www.indeed.com/q-executive-chef-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$65k - $85k',
        posted: '2 days ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['menu planning', 'french cuisine', 'team leadership'], extractedSkills),
        matchingSkills: ['menu planning', 'team leadership'],
        category: 'culinary'
      },
      {
        id: '7',
        title: 'Registered Nurse - ICU',
        company: 'Johns Hopkins Hospital',
        location: userLocation,
        description: `Critical care RN for ${userLocation} area. BSN required, 3+ years experience, ACLS certification preferred.`,
        applyLink: `https://www.indeed.com/q-registered-nurse-icu-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$75k - $95k',
        posted: '1 week ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['critical care', 'acls', 'bsn'], extractedSkills),
        matchingSkills: ['critical care', 'acls'],
        category: 'healthcare'
      },
      {
        id: '8',
        title: 'Financial Analyst',
        company: 'Morgan Stanley',
        location: userLocation,
        description: `Financial modeling, Excel expertise, SQL, CFA preferred. Support investment banking team in ${userLocation}.`,
        applyLink: `https://www.glassdoor.com/job-listing/financial-analyst-${encodeURIComponent(userLocation).toLowerCase()}-morgan-stanley-jl.htm`,
        salary: '$60k - $80k',
        posted: '3 days ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['excel', 'financial modeling', 'sql'], extractedSkills),
        matchingSkills: ['excel', 'financial modeling'],
        category: 'finance'
      },
      {
        id: '9',
        title: 'Regional Sales Manager',
        company: 'RetailCorp',
        location: userLocation,
        description: `Lead retail operations across ${userLocation} region. P&L management, team development, sales strategy, inventory optimization for multi-unit stores.`,
        applyLink: `https://www.indeed.com/q-regional-sales-manager-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$90k - $130k',
        posted: '1 day ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['retail', 'sales', 'management', 'p&l', 'inventory'], extractedSkills),
        matchingSkills: ['retail', 'sales', 'management', 'inventory'],
        category: 'retail'
      }
    ];

    // Filter jobs based on target role
    const filteredJobs = filterJobsByRole(mockJobs, targetRole, extractedSkills);
    console.log(`🎯 Found ${filteredJobs.length} relevant jobs for: ${targetRole}`);

    return NextResponse.json({ jobs: filteredJobs });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search jobs' }, { status: 500 });
  }
}

// Filter jobs based on user's target role (TypeScript-safe)
function filterJobsByRole(jobs: Job[], targetRole: string, userSkills: string[]): Job[] {
  if (!targetRole || jobs.length === 0) return jobs;

  const target = targetRole.toLowerCase();
  
  // Define role matching keywords
  const roleMatchers = {
    'software': ['software', 'developer', 'engineer', 'programmer', 'full-stack', 'frontend', 'backend'],
    'chef': ['chef', 'cook', 'culinary', 'kitchen', 'sous', 'executive chef'],
    'nurse': ['nurse', 'rn', 'registered nurse', 'icu', 'bsn', 'acls'],
    'financial': ['financial', 'analyst', 'finance', 'accounting', 'cfa', 'excel'],
    'retail': ['retail', 'sales', 'manager', 'regional', 'store', 'inventory', 'p&l'],
    'manager': ['manager', 'director', 'regional', 'operations', 'team lead']
  };

  // Find which category the user's target matches
  let userCategory: keyof typeof roleMatchers | null = null;
  
  for (const [category, keywords] of Object.entries(roleMatchers)) {
    if (keywords.some(keyword => target.includes(keyword))) {
      userCategory = category as keyof typeof roleMatchers;
      break;
    }
  }

  if (!userCategory) {
    // If no clear category, return all jobs (original behavior)
    return jobs;
  }

  // Filter jobs that match the user's category
  const filtered = jobs.filter((job: Job) => {
    const jobTitle = job.title.toLowerCase();
    const jobCategory = job.category;
    
    // If job has explicit category, match directly
    if (jobCategory) {
      return jobCategory === userCategory;
    }
    
    // Fallback: check title keywords
    return roleMatchers[userCategory].some(keyword => jobTitle.includes(keyword));
  });

  // If no matches found, return top 3 highest scoring jobs
  if (filtered.length === 0) {
    console.log('⚠️ No direct matches, returning highest scoring jobs');
    return jobs
      .sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0))
      .slice(0, 3);
  }

  return filtered;
}

function calculateFitScore(jobSkills: string[], userSkills: string[]): number {
  if (!userSkills || userSkills.length === 0) return 70; // Default if no skills extracted
  
  const matchingSkills = jobSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );
  
  const matchPercentage = (matchingSkills.length / jobSkills.length) * 100;
  return Math.max(60, Math.min(99, Math.round(matchPercentage)));
}
