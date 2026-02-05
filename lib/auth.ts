import { useState, useEffect } from 'react';

export const useAuth = () => {
  interface MockUser {
    uid: string;
    email: string;
  }

  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async auth check
    setTimeout(() => {
      // For now, we'll simulate a logged-in user
      setUser({ uid: 'mock-user-id', email: 'mock@example.com' });
      setLoading(false);
    }, 1000);
  }, []);

  return { user, loading };
};

export const signIn = async (email: string, password: string) => {
  console.log('Mock signIn called with:', email, password);
  // Simulate successful sign-in
  return { user: { uid: 'mock-user-id', email: 'mock@example.com' } };
};

export const signUp = async (email: string, password: string) => {
  console.log('Mock signUp called with:', email, password);
  // Simulate successful sign-up
  return { user: { uid: 'mock-user-id', email: 'mock@example.com' } };
};
