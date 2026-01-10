// app/api/extract-profile/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

// HARDCODED KEY TEST - Replace with your actual key
const HARDCODED_API_KEY = "sk-or-v1-dc545db75818e6a616b790e407f3e45a07d7714e1443bdee3330da4XXXXXXXX";

export async function POST(request: Request) {
  let resumeText = '';
  
  try {
    const body = await request.json();
    resumeText = body.resumeText || '';
    
    console.log('📥 API received resume. Length:', resumeText.length);
    console.log('🔍 HARDODED KEY PRESENT:', HARDCODED_API_KEY ? '✅ YES' : '❌ NO');

    if (!HARDCODED_API_KEY) {
      console.error('❌ Hardcoded key missing');
      return NextResponse.json({
        error: 'API key missing',
        extractedData: fallbackExtract(resumeText)
      });
    }

    console.log('✅ Using hardcoded key, calling OpenAI...');
    
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: HARDCODED_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://career-pilot-ai-delta.vercel.app",
        "X-Title": "CareerPilot AI",
      },
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Extract: skills[], experienceYears, jobTitles[], industries[]. Return JSON only."
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content || '';
    console.log('📤 AI Response:', content);
    
    const extractedData = JSON.parse(content);
    console.log('✅ AI extracted data:', extractedData);
    
    return NextResponse.json({ extractedData });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      error: 'Extraction failed',
      extractedData: fallbackExtract(resumeText)
    });
  }
}

function fallbackExtract(resumeText: string) {
  const skills = ['retail', 'sales', 'management', 'p&l', 'inventory'];
  const extractedSkills = skills.filter(skill =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  
  return {
    skills: extractedSkills,
    experienceYears: 3,
    jobTitles: ['Manager'],
    industries: ['Technology'],
  };
}
