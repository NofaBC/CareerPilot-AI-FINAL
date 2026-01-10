import { NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured } from '@/lib/openai-client';

export async function POST(request: Request) {
  let jobTitle = '', company = '', jobDescription = ''; // ✅ Declare outside try
  
  try {
    const body = await request.json();
    jobTitle = body.jobTitle || '';
    company = body.company || '';
    jobDescription = body.jobDescription || '';
    
    if (!jobTitle || !company) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        coverLetter: generatePlaceholderCoverLetter(jobTitle, company)
      });
    }

    const client = getOpenAIClient();
    
    if (!client || !isOpenAIConfigured()) {
      return NextResponse.json({ 
        error: 'OpenRouter not configured',
        coverLetter: generatePlaceholderCoverLetter(jobTitle, company)
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `You are a professional career coach specializing in writing compelling cover letters. Write a personalized cover letter that:
          1. Opens with enthusiasm for the specific role
          2. Highlights 2-3 relevant skills from the resume
          3. Mentions the company name and why they're a good fit
          4. Closes with a strong call to action`
        },
        {
          role: "user",
          content: `Job: ${jobTitle} at ${company}\nDescription: ${jobDescription}\nMy Resume: ${body.resumeText || ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const coverLetter = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return NextResponse.json({ 
      error: 'Generation failed',
      coverLetter: generatePlaceholderCoverLetter(jobTitle, company) // ✅ Now in scope
    });
  }
}

function generatePlaceholderCoverLetter(jobTitle: string, company: string): string {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. 

With my proven track record and passion for excellence, I am confident I would be a valuable asset to your team.

I look forward to the opportunity to discuss how my skills and experience align with your needs.

Best regards,
Applicant`;
}
