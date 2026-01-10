// app/lib/server-config.ts
// This forces Next.js to load env vars at runtime in server context

const getEnvVar = (key: string): string | undefined => {
  // Explicitly access process.env in server runtime
  if (typeof process !== 'undefined') {
    return process.env[key];
  }
  return undefined;
};

export function getServerConfig() {
  const config = {
    OPENROUTER_API_KEY: getEnvVar('OPENROUTER_API_KEY'),
    NEXT_PUBLIC_FIREBASE_API_KEY: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    NEXT_PUBLIC_FIREBASE_APP_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
    FIREBASE_PRIVATE_KEY: getEnvVar('FIREBASE_PRIVATE_KEY'),
  };

  // Debug log (visible in Vercel build logs)
  console.log('🔍 Server Config Loaded:', {
    hasOpenRouterKey: !!config.OPENROUTER_API_KEY,
    keyLength: config.OPENROUTER_API_KEY?.length,
  });

  // Throw error if key is missing (fail fast)
  if (!config.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
  }

  return config;
}
