import { getOpenAIClient, isOpenAIConfigured } from './openai-client';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';

export async function extractProfileFromResume(userId: string, resumeText: string) {
  console.log('=== AI Extraction Starting ===');
  console.log('User ID:', userId);
  console.log('Resume length:', resumeText.length);

  const client = getOpenAIClient();
  
  if (!client || !isOpenAIConfigured()) {
    console.warn('⚠️ OpenRouter not configured - using fallback extraction');
    return fallbackExtract(resumeText);
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `You are a resume parsing AI. Extract structured data from resumes. Return ONLY a JSON object with these fields:
          {
            "skills": ["skill1", "skill2"],
            "experienceYears": number,
            "jobTitles": ["title1", "title2"],
            "industries": ["industry1"]
          }`
        },
        {
          role: "user",
          content: `Extract data from this resume:\n\n${resumeText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    try {
      const extractedData = JSON.parse(content);
      console.log('✅ AI extracted data:', extractedData);
      return extractedData;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return fallbackExtract(resumeText);
    }
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return fallbackExtract(resumeText);
  }
}

export async function updateExtractedProfileData(userId: string, extractedData: any) {
  const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
  await updateDoc(profileRef, {
    extractedData: extractedData,
    extractedAt: new Date().toISOString(),
  });
  console.log('✅ Extracted data saved to profile');
}

// Fallback extraction for when OpenAI/OpenRouter is not available
function fallbackExtract(resumeText: string) {
  const skills = [
    // Tech
    'javascript', 'typescript', 'react', 'node', 'python', 'sql', 'aws', 'docker',
    // Business/Retail
    'retail', 'sales', 'management', 'p&l', 'operations', 'inventory', 'merchandising', 'regional', 'director',
    // Healthcare
    'nurse', 'rn', 'bsn', 'acls', 'critical care', 'patient care',
    // Finance
    'excel', 'financial modeling', 'cfa', 'accounting',
    // Culinary
    'chef', 'cooking', 'menu planning', 'food safety', 'restaurant'
  ];
  
  const extractedSkills = skills.filter(skill => 
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    skills: extractedSkills,
    experienceYears: extractYearsOfExperience(resumeText),
    jobTitles: extractJobTitles(resumeText),
    industries: extractIndustries(resumeText),
  };
}

function extractYearsOfExperience(text: string): number {
  const matches = text.match(/(\d+)\s*\+?\s*years?/i);
  return matches ? parseInt(matches[1]) : 3;
}

function extractJobTitles(text: string): string[] {
  const titles = ['Full Stack Developer', 'Frontend Developer', 'Software Engineer', 'Regional Manager', 'Sales Director', 'Executive Chef', 'Registered Nurse', 'Financial Analyst'];
  return titles.filter(title => text.toLowerCase().includes(title.toLowerCase()));
}

function extractIndustries(text: string): string[] {
  return ['Technology']; // Simplified for MVP
}
