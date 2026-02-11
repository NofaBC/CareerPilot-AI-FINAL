import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, jobTitle, company, jobDescription, userProfile } = await request.json();

    if (!userId || !jobTitle || !company || !jobDescription || !userProfile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `Write a concise, enthusiastic cover letter for ${userProfile.name || 'the candidate'} applying to ${jobTitle} at ${company}.

Candidate Profile:
- Skills: ${userProfile.skills?.join(', ') || 'N/A'}
- Experience: ${userProfile.experience || 'N/A'}
- Target Role: ${userProfile.targetRole || 'N/A'}

Job Description:
${jobDescription}

Write in a professional but personable tone. Keep it under 250 words. Start with "Dear Hiring Manager," and end with "Sincerely, ${userProfile.name || 'Candidate'}".`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://career-pilot-ai.vercel.app',
        'X-Title': 'CareerPilot AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const coverLetter = data.choices?.[0]?.message?.content || 'Failed to generate cover letter.';

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('/api/generate-cover-letter error:', error);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
