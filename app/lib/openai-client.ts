// app/lib/openai-client.ts
import OpenAI from 'openai';
import { getServerConfig } from './server-config';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!client) {
    try {
      const config = getServerConfig();
      
      console.log('✅ Initializing OpenAI client with key length:', config.OPENROUTER_API_KEY?.length);
      
      client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: config.OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": "https://career-pilot-ai-wine.vercel.app",
          "X-Title": "CareerPilot AI",
        },
      });
    } catch (error) {
      console.error('❌ OpenAI client initialization failed:', error);
      return null;
    }
  }
  
  return client;
}

export function isOpenAIConfigured(): boolean {
  try {
    const config = getServerConfig();
    return !!config.OPENROUTER_API_KEY;
  } catch {
    return false;
  }
}
