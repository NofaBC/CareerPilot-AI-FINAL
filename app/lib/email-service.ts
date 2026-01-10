import { getOpenAIClient, isOpenAIConfigured } from './openai-client';

export async function generateCoverLetter(
  jobTitle: string,
  company: string,
  jobDescription: string,
  resumeText: string
): Promise<string> {
  console.log('=== AI Cover Letter Starting ===');
  
  const client = getOpenAIClient();
  
  if (!client || !isOpenAIConfigured()) {
    console.warn('⚠️ OpenRouter not configured - using placeholder');
    return generatePlaceholderCoverLetter(jobTitle, company);
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `You are a professional career coach specializing in writing compelling cover letters. Write a personalized cover letter that:
          1. Opens with enthusiasm for the specific role
          2. Highlights 2-3 relevant skills from the resume
          3. Mentions the company name and why they're a good fit
          4. Closes with a strong call to action
          Format professionally with proper paragraphs.`
        },
        {
          role: "user",
          content: `Job: ${jobTitle} at ${company}\nDescription: ${jobDescription}\nMy Resume: ${resumeText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const coverLetter = completion.choices[0]?.message?.content || '';
    console.log('✅ AI-generated cover letter:', coverLetter.substring(0, 100) + '...');
    return coverLetter;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return generatePlaceholderCoverLetter(jobTitle, company);
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
