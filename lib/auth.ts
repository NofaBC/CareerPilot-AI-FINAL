export function useAuth() { 
  return { 
    user: { uid: 'test-user-123', email: 'test@example.com' }, 
    loading: false 
  }; 
} 

export async function signIn(email: string, password: string) { 
  console.log("Sign in:", email); 
} 

export async function signUp(email: string, password: string, name: string) { 
  console.log("Sign up:", email, name); 
}
