// app/api/extract-profile/route.ts - HARDCODED TEST (FIXED)
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const HARDCODED_API_KEY = "sk-or-v1-dc545db75818e6a616b790e407f3e45a07d7714e1443bdee3330da4XXXXXXXX"; // Replace with actual key

export async function POST(request: Request) {
  let resumeText = '';
  
  try {
    const body = await request.json();
    resumeText = body.resumeText || '';
    
    console.log('HARDCODED TEST STARTING...');
    console.log('Key exists:', !!HARDCODED_API_KEY);

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: HARDCODED_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://career-pilot-ai-lovat.vercel.app",
        "X-Title": "CareerPilot AI",
      },
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Extract: skills[], experienceYears, jobTitles[], industries[]. Return JSON." },
        { role: "user", content: resumeText }
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    const extractedData = JSON.parse(completion.choices[0]?.message?.content || '');
    console.log('✅ AI EXTRACTION SUCCESS:', extractedData);
    
    return NextResponse.json({ extractedData });
    
  } catch (error) {
    console.error('❌ HARD CODED TEST FAILED:', error);
    // Type guard for unknown error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage });
  }
}
